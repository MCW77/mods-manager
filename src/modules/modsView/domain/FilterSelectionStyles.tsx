import type { TriState } from "./ModsViewOptions";

export function getFilterSelectionStyles(value: TriState, tierColorCSS = "") {
	if (value === 1)
		return `border-inset bg-selected ${tierColorCSS === "" ? "text-selected-foreground" : `text-${tierColorCSS}`} border-selected-border`;
	if (value === -1)
		return `border-inset bg-red-950 border-red-400 ${tierColorCSS === "" ? "text-foreground" : `text-${tierColorCSS}`}`;
	return `${tierColorCSS === "" ? "text-muted-foreground" : `text-${tierColorCSS}`}`;
}
