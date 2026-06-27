// state
import { beginBatch, endBatch, type ObservableParam } from "@legendapp/state";

// react
import type { ComponentProps } from "react";
import { useValue } from "@legendapp/state/react";

// components
import { ToggleGroup as ShadCNToggleGroup } from "#ui/toggle-group";
import type { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";

type ObservableValueParam<T, V> = T extends false
	? ObservableParam<V | undefined>
	: ObservableParam<V[] | undefined>;

interface ToggleGroupProps<T, V extends string>
	extends Omit<
		ComponentProps<typeof ShadCNToggleGroup>,
		"value" | "onValueChange" | "multiple"
	> {
	multiple?: T;
	$value: ObservableValueParam<T, V>;
	onValueChange?: (
		value: string[],
		eventDetails: ToggleGroupPrimitive.ChangeEventDetails,
	) => void;
}

function ToggleGroup<V extends string, T extends boolean = false>({
	$value,
	onValueChange,
	multiple,
	...props
}: ToggleGroupProps<T, V>) {
	const value: string[] = useValue(() => {
		const rawValue = $value.get();
		const result = (
			rawValue === undefined
				? []
				: multiple === false
					? [rawValue]
					: (rawValue as string[])
		) satisfies V[];
		return result;
	});

	const handleChange = (
		newValue: string[],
		eventDetails: ToggleGroupPrimitive.ChangeEventDetails,
	) => {
		if (onValueChange !== undefined) {
			onValueChange?.(newValue, eventDetails);
		} else {
			beginBatch();
			if (newValue.length === 0) $value.set(undefined);
			if (multiple === false) $value.set(newValue[0]);
			else $value.set(newValue);
			endBatch();
		}
	};

	return (
		<ShadCNToggleGroup
			{...props}
			multiple={multiple}
			value={value}
			onValueChange={handleChange}
		/>
	);
}

export { ToggleGroup };
