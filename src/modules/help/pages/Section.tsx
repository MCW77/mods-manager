// state
import { ui$ } from "#/modules/ui/state/ui";

// components
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

ui$.registerSection({
	icon: faQuestion,
	isAlwaysVisible: true,
	name: "help",
	titleKey: "header.NavHelp",
	position: 7,
	hasNullSuspenseFallback: false,
});
