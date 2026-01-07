import type * as React from "react";
import { X } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent } from "#ui/select";
import { cn } from "#/lib/utils";

interface ClearableSelectProps {
	value: string | undefined;
	onChange: (value: string | undefined) => void;
	placeholder?: string;
	children: React.ReactNode;
	disabled?: boolean;
	className?: string;
}

export function ClearableSelect({
	value,
	onChange,
	placeholder = "Select…",
	children,
	disabled,
	className,
}: ClearableSelectProps) {
	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange(undefined);
	};

	return (
		<div className="relative w-full">
			<Select
				value={value}
				onValueChange={(v) => onChange(v)}
				disabled={disabled}
			>
				<SelectTrigger className={cn("gap-4", className)}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>{children}</SelectContent>
			</Select>

			{value && !disabled && (
				<button
					type="button"
					onClick={handleClear}
					className="
            absolute right-7 top-1/2 -translate-y-1/2
            text-muted-foreground hover:text-foreground
            transition-colors
          "
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
