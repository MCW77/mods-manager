// utils
import { cn } from "#/lib/utils";

// react
import { Show } from "@legendapp/state/react";

// state
import type { Observable } from "@legendapp/state";

// components
import type * as TogglePrimitive from "@radix-ui/react-toggle";
import { Toggle } from "#/components/reactive/Toggle";

type LockedToggleProps = {
	$pressed: Observable<boolean>;
} & TogglePrimitive.ToggleProps;

function LockedToggle({
	$pressed,
	onPressedChange,
	className,
}: LockedToggleProps) {
	const commonCSS =
		"absolute block size-[1.2em] m0 p0 top-[0.2em] right-[0.2em] leading-[1.2em] bg-[url(/img/character_icons.webp)] bg-[size:12em_2.4em]";

	return (
		<Toggle
			className={"absolute block size-[1.2em] m0 p0 top-[0.2em] right-[0.2em]"}
			$pressed={$pressed}
			onPressedChange={onPressedChange}
		>
			<Show
				if={$pressed}
				else={() => (
					<div
						className={cn(
							`${commonCSS} bg-[position:-9.6em_-1.2em]`,
							className,
						)}
					/>
				)}
			>
				<div
					className={cn(`${commonCSS} bg-[position:-9.6em_-0em]`, className)}
				/>
			</Show>
		</Toggle>
	);
}
export { LockedToggle };
