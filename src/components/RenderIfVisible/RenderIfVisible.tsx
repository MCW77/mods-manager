// react
import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";

type ComponentProps = {
	className?: string;
	defaultHeight?: number;
	visibleOffset?: number;
	root?: React.RefObject<HTMLElement> | null;
	disabled?: boolean;
	children: React.ReactNode;
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
	...restProps
}: ComponentProps) => {
	const [isVisible, setIsVisible] = useState<boolean>(!isWindowAvailable);
	const placeholderHeight = useRef<number>(defaultHeight);
	const intersectionRef = useRef<HTMLDivElement>(null);
	const hasBeenVisibleRef = useRef<boolean>(false);

	const setVisibleOnIdle = useCallback((visible: boolean) => {
		if (visible) {
			hasBeenVisibleRef.current = true;
			// Show immediately
			if (isRequestIdleCallbackAvailable) {
				window.requestIdleCallback(() => setIsVisible(true), {
					timeout: 600,
				});
			} else {
				setIsVisible(true);
			}
		} else {
			// Once rendered, keep it rendered (don't hide)
			// This prevents flickering during DOM reordering from drag-drop
			if (!hasBeenVisibleRef.current) {
				if (isRequestIdleCallbackAvailable) {
					window.requestIdleCallback(() => setIsVisible(false), {
						timeout: 600,
					});
				} else {
					setIsVisible(false);
				}
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

		if (intersectionRef.current === null) return () => {};

		const observer = new IntersectionObserver(
			([entry]) => {
				setVisibleOnIdle(entry.isIntersecting);
			},
			{
				root: root?.current ?? null,
				rootMargin: `${visibleOffset}px 0px ${visibleOffset}px 0px`,
			},
		);
		observer.observe(intersectionRef.current);
		return () => {
			if (intersectionRef.current !== null) {
				observer.unobserve(intersectionRef.current);
			}
		};
	}, [root, visibleOffset, setVisibleOnIdle, disabled]);

	// Set true height for placeholder element after render.
	useEffect(() => {
		if (intersectionRef.current && isVisible) {
			placeholderHeight.current = intersectionRef.current.offsetHeight;
		}
	}, [isVisible]);

	return (
		<div className={className} ref={intersectionRef} {...restProps}>
			{isVisible ? (
				children
			) : (
				<div style={{ height: placeholderHeight.current }} />
			)}
		</div>
	);
};

RenderIfVisible.displayName = "RenderIfVisible";

export { RenderIfVisible };
