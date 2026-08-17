// state
import { ui$ } from "#/modules/ui/state/ui";

// components
import { faInfo } from "@fortawesome/free-solid-svg-icons";

ui$.registerSection({
	icon: faInfo,
	isAlwaysVisible: true,
	name: "about",
	titleKey: "header.NavAbout",
	position: 7,
	hasNullSuspenseFallback: false,
});
