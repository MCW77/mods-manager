// state
import { ui$ } from "#/modules/ui/state/ui";

// components
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

ui$.registerSection({
	icon: faMagnifyingGlass,
	isAlwaysVisible: false,
	name: "mod compilations",
	titleKey: "header.NavModCompilations",
	position: 2,
	hasNullSuspenseFallback: false,
});
