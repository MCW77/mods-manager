// react
import type { ComponentProps } from "react";
import { useValue } from "@legendapp/state/react";

// state
import type { Observable } from "@legendapp/state";

// components
import { Input as CustomInput } from "#/components/custom/input";

type BaseProps = ComponentProps<typeof CustomInput>;
interface ReactiveInputProps extends Omit<BaseProps, "value" | "onChange"> {
	$value?: Observable<string | undefined>;
	value?: string | undefined;
	onChange?: (value: string | undefined) => void;
}
function Input({ $value, value, onChange, ...props }: ReactiveInputProps) {
	const obsValue = useValue($value);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		if ($value) {
			$value.set(newValue);
		}
		onChange?.(newValue);
	};

	return (
		<CustomInput
			{...props}
			value={$value ? (obsValue ?? "") : value}
			onChange={handleChange}
		/>
	);
}

export { Input };
