// react
import type { ComponentProps } from "react";
import { useValue } from "@legendapp/state/react";

// state
import type { Observable } from "@legendapp/state";

// components
import { Switch as ShadCNSwitch } from "#ui/switch";

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

	const handleCheckedChange = (newChecked: boolean) => {
		$checked.set(newChecked);
		onCheckedChange?.(newChecked);
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
