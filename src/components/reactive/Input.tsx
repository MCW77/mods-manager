// react
import { useMemo, type ComponentProps } from "react";
import { useValue } from "@legendapp/state/react";

// state
import { observable, type Observable } from "@legendapp/state";

// components
import { Input as CustomInput } from "#/components/custom/input";
import { booleanAsString } from "#/utils/legend-kit/as/booleanAsString";
import { numberAsString } from "#/utils/legend-kit/as/numberAsString";

type CustomInputProps = ComponentProps<typeof CustomInput>;
interface InputProps
	extends Omit<CustomInputProps, "checked" | "value" | "onChange"> {
	$value: Observable<string | number | boolean | undefined>;
	onChange?: (value: string | undefined) => void;
}
function Input({ type, $value, onChange, ...props }: InputProps) {
	const value$ = useMemo(() => {
		if (type === "checkbox" || type === "radio")
			return observable(
				booleanAsString($value as Observable<boolean | undefined>),
			);
		if (type === "number")
			return observable(
				numberAsString($value as Observable<number | undefined>),
			);
		if ($value === undefined) return observable<string>("");
		return $value as Observable<string | undefined>;
	}, [$value, type]);
	const value = useValue(value$);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		value$.set(newValue);
		onChange?.(newValue);
	};

	return (
		<CustomInput {...props} onChange={handleChange} type={type} value={value} />
	);
}

export { Input };
