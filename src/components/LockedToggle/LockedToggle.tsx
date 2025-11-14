// utils
import { cn } from "#/lib/utils.js";

// react
import { Show, use$, useObservable } from "@legendapp/state/react";

// state
import type { Observable } from "@legendapp/state";

// components
import type * as TogglePrimitive from "@radix-ui/react-toggle";
import { Toggle } from "#/components/reactive/Toggle.jsx";

type LockedToggleProps = {
	$pressed: Observable<boolean>;
} & TogglePrimitive.ToggleProps;

function LockedToggle({
	$pressed,
	onPressedChange,
	className,
}: LockedToggleProps) {
	const title$ = useObservable(() =>
		$pressed.get()
			? "This character is locked. Its mods will not be assigned to other characters"
			: "This character is not locked",
	);
	const title = use$(title$);
	const commonCSS =
		"size-[16px] m0 p0 leading-[1.2em] bg-[url(/img/character_icons.webp)] bg-[size:160px_32px]";

	return (
		<Toggle
			className={cn("h-[16px] min-w-0 p-0 rounded-none", className)}
			$pressed={$pressed}
			onPressedChange={onPressedChange}
			title={title}
		>
			<Show
				if={$pressed}
				else={() => (
					<div
						className={cn(`${commonCSS} bg-[position:-128px_-16px]`, className)}
					/>
				)}
			>
				<div
					className={cn(`${commonCSS} bg-[position:-128px_-0px]`, className)}
				/>
			</Show>
		</Toggle>
	);
}
export { LockedToggle };
