// utils
import { booleanAsString } from "#/utils/legend-kit/as/booleanAsString";
import { nullableStringAsString } from "#/utils/legend-kit/as/nullableStringAsString";
import { numberAsString } from "#/utils/legend-kit/as/numberAsString";

// react
import { useMemo, type ComponentProps } from "react";
import { useValue } from "@legendapp/state/react";

// state
import { observable, type ObservableParam } from "@legendapp/state";

// components
import { Input as ShadCNInput } from "#ui/input";

type CustomInputProps = ComponentProps<typeof ShadCNInput>;
interface InputProps
	extends Omit<CustomInputProps, "checked" | "value" | "onChange"> {
	$value: ObservableParam<string | number | boolean | undefined | null>;
	onChange?: (value: string | undefined) => void;
}
function Input({ type, $value, onChange, ...props }: InputProps) {
	const value$ = useMemo(() => {
		if (type === "checkbox" || type === "radio")
			return observable(
				booleanAsString($value as ObservableParam<boolean | undefined | null>),
			);
		if (type === "number")
			return observable(
				numberAsString($value as ObservableParam<number | undefined | null>),
			);
		if ($value === undefined || $value === null) return observable<string>("");
		return observable(
			nullableStringAsString(
				$value as ObservableParam<string | undefined | null>,
			),
		);
	}, [$value, type]);
	const value = useValue(value$);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue =
			type === "checkbox" || type === "radio"
				? event.target.checked
					? "true"
					: "false"
				: event.target.value;
		value$.set(newValue);
		onChange?.(newValue);
	};

	const isCheckboxOrRadio = type === "checkbox" || type === "radio";

	return (
		<ShadCNInput
			{...props}
			onChange={handleChange}
			type={type}
			{...(isCheckboxOrRadio
				? { checked: value === "true" }
				: { value: value })}
		/>
	);
}

export { Input };
