// state
import { ui$ } from "#/modules/ui/state/ui";

// components
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

ui$.registerSection({
	icon: faMagnifyingGlass,
	isAlwaysVisible: false,
	name: "mods",
	titleKey: "header.NavMods",
	position: 1,
	hasNullSuspenseFallback: true,
});
