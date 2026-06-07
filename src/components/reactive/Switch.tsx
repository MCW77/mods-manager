// react
import type { ComponentProps } from "react";
import { useValue } from "@legendapp/state/react";

// state
import type { Observable } from "@legendapp/state";

// components
import { Switch as ShadCNSwitch } from "#ui/switch";
import type { Switch as BaseUISwitch } from "@base-ui/react/switch";

type ShadCNSwitchProps = ComponentProps<typeof ShadCNSwitch>;
interface SwitchProps extends Omit<ShadCNSwitchProps, "checked"> {
	$checked: Observable<boolean>;
	$disabled?: Observable<boolean>;
}

function Switch({
	$checked,
	$disabled,
	onCheckedChange,
	...props
}: SwitchProps) {
	const checked = useValue($checked);
	const disabled = useValue(() => ($disabled ? $disabled.get() : false));

	const handleCheckedChange = (
		newChecked: boolean,
		eventDetails: BaseUISwitch.Root.ChangeEventDetails,
	) => {
		$checked.set(newChecked);
		onCheckedChange?.(newChecked, eventDetails);
	};

	return (
		<ShadCNSwitch
			{...props}
			checked={checked}
			disabled={disabled}
			onCheckedChange={handleCheckedChange}
		/>
	);
}

export { Switch };
