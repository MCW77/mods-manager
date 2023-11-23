import * as React from "react"

import * as CC from "./ui/CollapsibleCard";
import { ChevronDown } from "lucide-react";
import { cn } from "#/lib/shadcn";

interface DefaultCollapsibleCardProps {
  title: string
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
      <CC.CollapsibleCardHeader className="flex flex-row justify-between p-4">
        <CC.CollapsibleCardTitle className="align-middle">{title}</CC.CollapsibleCardTitle>
        <CC.CollapsibleCardTrigger className="flex flex-row justify-around items-center">
          <ChevronDown className={`m-r0 h-4 w-4 ${isOpen ? "transform rotate-180" : ""}`}/>
        </CC.CollapsibleCardTrigger>
      </CC.CollapsibleCardHeader>
      <CC.CollapsibleCardContent className="p-4">
        {children}
      </CC.CollapsibleCardContent>
    </CC.CollapsibleCard>
  )
})

DefaultCollapsibleCard.displayName = "DefaultCollapsibleCard";

export { DefaultCollapsibleCard }
