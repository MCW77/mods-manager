import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

import { cn } from "#lib/utils";

function CollapsibleCard({
	className,
	size = "default",
	...props
}: CollapsiblePrimitive.Root.Props & { size?: "default" | "sm" }) {
	return (
		<CollapsiblePrimitive.Root
			data-slot="card"
			data-size={size}
			className={cn(
				"group/card flex flex-col gap-4 overflow-hidden rounded-lg bg-card py-4 text-xs/relaxed text-card-foreground ring-1 ring-foreground/10 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg",
				className,
			)}
			{...props}
		/>
	);
}

function CollapsibleCardAction({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

function CollapsibleCardContent({
	className,
	...props
}: CollapsiblePrimitive.Panel.Props) {
	return (
		<CollapsiblePrimitive.Panel
			data-slot="card-content"
			className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
			{...props}
		/>
	);
}

function CollapsibleCardDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-xs/relaxed text-muted-foreground", className)}
			{...props}
		/>
	);
}

function CollapsibleCardFooter({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				"flex items-center rounded-b-lg px-4 group-data-[size=sm]/card:px-3 [.border-t]:pt-4 group-data-[size=sm]/card:[.border-t]:pt-3",
				className,
			)}
			{...props}
		/>
	);
}

function CollapsibleCardHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-lg px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
				className,
			)}
			{...props}
		/>
	);
}

function CollapsibleCardTitle({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn("text-sm font-medium", className)}
			{...props}
		/>
	);
}

const CollapsibleCardTrigger = CollapsiblePrimitive.Trigger;

export {
	CollapsibleCard,
	CollapsibleCardAction,
	CollapsibleCardContent,
	CollapsibleCardDescription,
	CollapsibleCardFooter,
	CollapsibleCardHeader,
	CollapsibleCardTitle,
	CollapsibleCardTrigger,
};
