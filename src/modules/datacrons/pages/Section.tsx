// state
import { ui$ } from "#/modules/ui/state/ui";

// components
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

ui$.registerSection({
	icon: faCreditCard,
	isAlwaysVisible: false,
	name: "datacrons",
	titleKey: "header.NavDatacrons",
	position: 4,
	hasNullSuspenseFallback: false,
});
