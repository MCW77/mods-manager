// utils
import { observe } from "#/utils/intersectionObserver";

// react
import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";

// components
import { SearchableActivity } from "#/components/SearchableActivity/SearchableActivity";

type ComponentProps = {
	className?: string;
	defaultHeight?: number;
	visibleOffset?: number;
	root?: React.RefObject<HTMLElement | null> | null;
	disabled?: boolean;
	children: React.ReactNode;
	searchableText?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const isWindowAvailable = typeof window !== "undefined";
const isRequestIdleCallbackAvailable =
	isWindowAvailable && "requestIdleCallback" in window;

const RenderIfVisible = ({
	className = "",
	defaultHeight = 300,
	visibleOffset = 1000,
	root = null,
	disabled = false,
	children,
	searchableText,
	...restProps
}: ComponentProps) => {
	const [isVisible, setIsVisible] = useState<boolean>(!isWindowAvailable);
	const placeholderHeight = useRef<number>(defaultHeight);
	const intersectionRef = useRef<HTMLDivElement>(null);
	const isVisibleRef = useRef(isVisible);

	useEffect(() => {
		isVisibleRef.current = isVisible;
	}, [isVisible]);

	const setVisibleOnIdle = useCallback((visible: boolean) => {
		if (visible) {
			if (isVisibleRef.current) return;

			// Show immediately
			if (isRequestIdleCallbackAvailable) {
				window.requestIdleCallback(() => setIsVisible(true), {
					timeout: 600,
				});
			} else {
				setIsVisible(true);
			}
		} else {
			if (!isVisibleRef.current) return;

			if (isRequestIdleCallbackAvailable) {
				window.requestIdleCallback(() => setIsVisible(false), {
					timeout: 600,
				});
			} else {
				setIsVisible(false);
			}
		}
	}, []);

	// Set visibility with intersection observer
	useEffect(() => {
		// If disabled, always show content
		if (disabled) {
			setIsVisible(true);
			return () => {};
		}

		// If root is provided but current is null, we might be too early.
		// However, useEffect runs after commit, so it should be set.
		// If it's still null, we fallback to viewport (null).
		const rootElement = root?.current ?? null;

		if (intersectionRef.current === null) return () => {};

		return observe(
			intersectionRef.current,
			(entry) => {
				setVisibleOnIdle(entry.isIntersecting);
			},
			{
				root: rootElement,
				rootMargin: `${visibleOffset}px 0px ${visibleOffset}px 0px`,
			},
		);
	}, [root, visibleOffset, setVisibleOnIdle, disabled]);

	// Set true height for placeholder element after render.
	useEffect(() => {
		if (intersectionRef.current && isVisible) {
			placeholderHeight.current = intersectionRef.current.offsetHeight;
		}
	}, [isVisible]);

	return (
		<div
			className={className}
			ref={intersectionRef}
			style={{ minHeight: !isVisible ? placeholderHeight.current : undefined }}
			{...restProps}
		>
			<SearchableActivity
				mode={isVisible ? "visible" : "hidden"}
				searchableText={searchableText}
			>
				{children}
			</SearchableActivity>
		</div>
	);
};

RenderIfVisible.displayName = "RenderIfVisible";

export { RenderIfVisible };
