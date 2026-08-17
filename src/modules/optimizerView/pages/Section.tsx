// state
import { ui$ } from "#/modules/ui/state/ui";

// components
import { faWrench } from "@fortawesome/free-solid-svg-icons";

ui$.registerSection({
	icon: faWrench,
	isAlwaysVisible: false,
	name: "optimize",
	titleKey: "header.NavOptimizeMods",
	position: 3,
	hasNullSuspenseFallback: false,
});
