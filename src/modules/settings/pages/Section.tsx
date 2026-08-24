// state
import { ui$ } from "#/modules/ui/state/ui";

// components
import { faGear } from "@fortawesome/free-solid-svg-icons";

ui$.registerSection({
	icon: faGear,
	isAlwaysVisible: false,
	name: "settings",
	titleKey: "header.NavSettings",
	position: 6,
	hasNullSuspenseFallback: false,
});
