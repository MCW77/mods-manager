import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "#/lib/utils";

interface ScrollAreaProps
	extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
	showScrollToTop?: boolean;
	scrollThreshold?: number;
}

const ScrollArea = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.Root>,
	ScrollAreaProps
>(
	(
		{
			className,
			children,
			showScrollToTop = true,
			scrollThreshold = 200,
			...props
		},
		ref,
	) => {
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
				ref={ref}
				className={cn("relative overflow-hidden", className)}
				{...props}
			>
				<ScrollAreaPrimitive.Viewport
					ref={viewportRef}
					className="h-full w-full rounded-[inherit]"
					onScroll={handleScroll}
				>
					{children}
				</ScrollAreaPrimitive.Viewport>
				<ScrollBar />
				<ScrollAreaPrimitive.Corner />

				{showScrollToTop && showButton && (
					<button
						type="button"
						onClick={scrollToTop}
						className={cn(
							"fixed bottom-4 right-4 z-50",
							"flex h-10 w-10 items-center justify-center",
							"rounded-full bg-primary text-primary-foreground",
							"shadow-lg transition-all hover:scale-110",
							"focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
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
					</button>
				)}
			</ScrollAreaPrimitive.Root>
		);
	},
);
ScrollArea.displayName = "ScrollArea";

const ScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		className={cn(
			"flex touch-none select-none transition-colors",
			orientation === "vertical" &&
				"h-full w-2.5 border-l border-l-transparent p-[1px]",
			orientation === "horizontal" &&
				"h-2.5 flex-col border-t border-t-transparent p-[1px]",
			className,
		)}
		{...props}
	>
		<ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
