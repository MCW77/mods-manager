// react
import { memo } from "react";

// components
import { Badge } from "../ui/badge";

type ComponentProps = {
	pips: number;
};

const Pip = memo(() => (
	<div className="size-[6px] bg-foreground rounded-full" />
));

// Pre-rendered static components for the most common cases (5 and 6 pips)
// These will only be rendered once and reused, significantly reducing re-renders
const Pips5 = memo(() => (
	<Badge
		variant="outline"
		className="w-17.5 h-auto p-1 items-center justify-between gap-0 border-3"
	>
		<Pip />
		<Pip />
		<Pip />
		<Pip />
		<Pip />
		<div className="size-[6px]" />
	</Badge>
));
Pips5.displayName = "Pips5";

const Pips6 = memo(() => (
	<Badge
		variant="outline"
		className="w-17.5 h-auto p-1 items-center justify-between gap-0 border-3"
	>
		<Pip />
		<Pip />
		<Pip />
		<Pip />
		<Pip />
		<Pip />
	</Badge>
));
Pips6.displayName = "Pips6";

// Dynamic component for rare cases (1-4 pips)
const PipsDynamic = memo(({ pips }: ComponentProps) => {
	return (
		<Badge
			variant="outline"
			className="w-17.5 h-auto p-1 items-center justify-between gap-0 border-3"
		>
			<Pip key={"pip-1"} />
			{pips > 1 ? <Pip key={"pip-2"} /> : <div className="size-[6px]" />}
			{pips > 2 ? <Pip key={"pip-3"} /> : <div className="size-[6px]" />}
			{pips > 3 ? <Pip key={"pip-4"} /> : <div className="size-[6px]" />}
			{pips > 4 ? <Pip key={"pip-5"} /> : <div className="size-[6px]" />}
			{pips > 5 ? <Pip key={"pip-6"} /> : <div className="size-[6px]" />}
		</Badge>
	);
});
PipsDynamic.displayName = "PipsDynamic";

// Main component that chooses the optimal rendering strategy
const Pips = ({ pips }: ComponentProps) => {
	if (pips === 5) return <Pips5 />;
	if (pips === 6) return <Pips6 />;

	return <PipsDynamic pips={pips} />;
};

Pips.displayName = "Pips";

export { Pips };
