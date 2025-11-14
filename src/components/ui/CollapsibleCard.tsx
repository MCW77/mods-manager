import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import { cn } from "#lib/utils.js";

const CollapsibleCard = React.forwardRef<
	React.ElementRef<typeof Collapsible.Root>,
	Collapsible.CollapsibleProps
>(({ className, ...props }, ref) => (
	<Collapsible.Root
		ref={ref}
		className={cn(
			"rounded-xl border bg-card text-card-foreground shadow w-[--radix-collapsible-content-width]",
			className,
		)}
		{...props}
	/>
));
CollapsibleCard.displayName = "CollapsibleCard";

const CollapsibleCardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col gap-2 p-6", className)}
		{...props}
	/>
));
CollapsibleCardHeader.displayName = "CollapsibleCardHeader";

const CollapsibleCardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			"text-lg font-semibold leading-none tracking-tight",
			className,
		)}
		{...props}
	/>
));
CollapsibleCardTitle.displayName = "CollapsibleCardTitle";

const CollapsibleCardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-sm text-muted-foreground", className)}
		{...props}
	/>
));
CollapsibleCardDescription.displayName = "CollapsibleCardDescription";

const CollapsibleCardTrigger = Collapsible.Trigger;

const CollapsibleCardContent = React.forwardRef<
	React.ElementRef<typeof Collapsible.Content>,
	Collapsible.CollapsibleContentProps
>(({ className, ...props }, ref) => (
	<Collapsible.Content
		ref={ref}
		className={cn("p-6 pt-0", className)}
		{...props}
	/>
));
CollapsibleCardContent.displayName = "CollapsibleCardContent";

const CollapsibleCardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex items-center p-6 pt-0", className)}
		{...props}
	/>
));
CollapsibleCardFooter.displayName = "CollapsibleCardFooter";

export {
	CollapsibleCard,
	CollapsibleCardHeader,
	CollapsibleCardFooter,
	CollapsibleCardTitle,
	CollapsibleCardDescription,
	CollapsibleCardContent,
	CollapsibleCardTrigger,
};
