// utils
import { cn } from "#/lib/utils";

// react
import * as React from "react";

// components
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { Button } from "#ui/button";

interface ScrollAreaProps extends ScrollAreaPrimitive.Root.Props {
	showScrollToTop?: boolean;
	scrollThreshold?: number;
}

function ScrollArea({
	className,
	children,
	showScrollToTop = true,
	scrollThreshold = 200,
	...props
}: ScrollAreaProps) {
	const viewportRef = React.useRef<HTMLDivElement>(null);
	const [showButton, setShowButton] = React.useState(false);

	const handleScroll = React.useCallback(() => {
		if (viewportRef.current) {
			const scrollTop = viewportRef.current.scrollTop;
			setShowButton(scrollTop > scrollThreshold);
		}
	}, [scrollThreshold]);

	const scrollToTop = React.useCallback(() => {
		if (viewportRef.current) {
			viewportRef.current.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	}, []);

	return (
		<ScrollAreaPrimitive.Root
			data-slot="scroll-area"
			className={cn("relative", className)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport
				data-slot="scroll-area-viewport"
				className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
				ref={viewportRef}
				onScroll={handleScroll}
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
			{showScrollToTop && showButton && (
				<Button
					type="button"
					variant="outline"
					onClick={scrollToTop}
					className={cn(
						"fixed bottom-4 right-4 z-50 h-10 w-10 p-1",
						"rounded-full transition-all hover:scale-110 bg-background/10",
					)}
					aria-label="Scroll to top"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Scroll to top</title>
						<path d="m18 15-6-6-6 6" />
					</svg>
				</Button>
			)}
		</ScrollAreaPrimitive.Root>
	);
}
ScrollArea.displayName = "ScrollArea";

function ScrollBar({
	className,
	orientation = "vertical",
	...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
	return (
		<ScrollAreaPrimitive.Scrollbar
			data-slot="scroll-area-scrollbar"
			data-orientation={orientation}
			orientation={orientation}
			className={cn(
				"flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
				className,
			)}
			{...props}
		>
			<ScrollAreaPrimitive.Thumb
				data-slot="scroll-area-thumb"
				className="relative flex-1 rounded-full bg-border"
			/>
		</ScrollAreaPrimitive.Scrollbar>
	);
}

export { ScrollArea, ScrollBar };
