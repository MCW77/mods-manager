import type { TriState } from "./ModsViewOptions";

export function getFilterSelectionStyles(value: TriState) {
	if (value === 1)
		return "border-inset bg-selected text-selected-foreground border-selected-border";
	if (value === -1)
		return "border-inset bg-red-950 border-red-400 text-foreground";
	return "text-muted-foreground";
}
