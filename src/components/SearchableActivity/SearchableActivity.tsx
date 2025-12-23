import type React from "react";
import { Activity, useCallback } from "react";

interface SearchableActivityProps {
	mode: "visible" | "hidden";
	children: React.ReactNode;
	searchableText?: string;
}

export const SearchableActivity = ({
	mode,
	children,
	searchableText,
}: SearchableActivityProps) => {
	const setRef = useCallback((element: HTMLDivElement | null) => {
		if (!element) return;

		element.setAttribute("hidden", "until-found");

		const handleBeforeMatch = () => {
			// The browser found text inside this element and is revealing it.
			// We don't need to do anything manually as the browser removes the hidden attribute.
			// The parent RenderIfVisible should detect the intersection change.
		};

		element.addEventListener("beforematch", handleBeforeMatch);
	}, []);

	return (
		<>
			<Activity mode={mode}>{children}</Activity>
			{mode === "hidden" && searchableText && (
				<div ref={setRef}>{searchableText}</div>
			)}
		</>
	);
};
