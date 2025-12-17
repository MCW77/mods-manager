// react
import * as React from "react";

// utils
import { cn } from "#lib/utils";

// components
import { ChevronDown } from "lucide-react";
import * as CC from "./custom/CollapsibleCard";

interface DefaultCollapsibleCardProps {
	title: string;
}

const DefaultCollapsibleCard = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement & DefaultCollapsibleCardProps>
>(({ className, title, children, ...props }, ref) => {
	const [isOpen, setIsOpen] = React.useState(true);

	return (
		<CC.CollapsibleCard
			open={isOpen}
			onOpenChange={setIsOpen}
			ref={ref}
			className={cn(className, "!bg-opacity-20")}
			{...props}
		>
			<CC.CollapsibleCardHeader className="flex flex-row justify-between p-2">
				<div className="flex flex-row items-center justify-between w-full">
					<CC.CollapsibleCardTitle className="align-middle">
						{title}
					</CC.CollapsibleCardTitle>
					<CC.CollapsibleCardTrigger className="flex flex-row justify-around items-center">
						<ChevronDown
							className={`m-r0 h-4 w-4 ${isOpen ? "transform rotate-180" : ""}`}
						/>
					</CC.CollapsibleCardTrigger>
				</div>
			</CC.CollapsibleCardHeader>
			<CC.CollapsibleCardContent className="p-2">
				{children}
			</CC.CollapsibleCardContent>
		</CC.CollapsibleCard>
	);
});

DefaultCollapsibleCard.displayName = "DefaultCollapsibleCard";

export { DefaultCollapsibleCard };
