import type { ReactElement } from "react";

import type { ObservableParam } from "@legendapp/state";
import { useValue } from "@legendapp/state/react";
import type {
	Select as SelectPrimitive,
	SelectRootChangeEventDetails,
} from "@base-ui/react/select";

import { Select as ShadCNSelect } from "#ui/select";

type SelectValue<
	Value,
	Multiple extends boolean | undefined = false,
> = Multiple extends true ? Value[] : Value;

type SelectChangeValue<
	Value,
	Multiple extends boolean | undefined = false,
> = SelectValue<Value, Multiple> | null;

type SelectProps<Value, Multiple extends boolean | undefined = false> = Omit<
	SelectPrimitive.Root.Props<Value, Multiple>,
	"value" | "onValueChange"
> & {
	$value: ObservableParam<SelectValue<Value, Multiple> | undefined | null>;
	onValueChange?: (
		value: SelectValue<Value, Multiple> | undefined,
		eventDetails: SelectRootChangeEventDetails,
	) => void;
};

function Select<Value, Multiple extends boolean | undefined = false>({
	$value,
	onValueChange,
	...props
}: SelectProps<Value, Multiple>): ReactElement {
	const value = useValue($value);

	const handleChange = (
		newValue: SelectChangeValue<Value, Multiple>,
		eventDetails: SelectRootChangeEventDetails,
	): void => {
		if (newValue === null) {
			$value.set(null);
			onValueChange?.(undefined, eventDetails);
			return;
		}

		$value.set(newValue);
		onValueChange?.(newValue, eventDetails);
	};

	return <ShadCNSelect {...props} onValueChange={handleChange} value={value} />;
}

export { Select };
export type { SelectProps };
