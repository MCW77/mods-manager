// state
import { ui$ } from "#/modules/ui/state/ui";

// components
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";

ui$.registerSection({
	icon: faChartColumn,
	isAlwaysVisible: false,
	name: "statistics",
	titleKey: "header.NavStatistics",
	position: 5,
	hasNullSuspenseFallback: false,
});
