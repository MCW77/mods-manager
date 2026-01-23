// react
import { observer, useValue } from "@legendapp/state/react";
import type { ComponentProps } from "react";
import type { Observable } from "@legendapp/state";

// components
import { ClearableSelect as ShadCNClearableSelect } from "#/components/custom/ClearableSelect";

type BaseProps = ComponentProps<typeof ShadCNClearableSelect>;

interface ReactiveClearableSelectProps
	extends Omit<BaseProps, "value" | "onChange"> {
	$value: Observable<string | undefined>;
	onChange?: (value: string | undefined) => void;
}

export const ClearableSelect = observer(
	({ $value, onChange, ...props }: ReactiveClearableSelectProps) => {
		let obsValue = useValue($value);
		if (obsValue === undefined) obsValue = "";

		const handleChange = (newValue: string | undefined) => {
			$value.set(newValue);
			onChange?.(newValue);
		};

		return (
			<ShadCNClearableSelect
				{...props}
				value={obsValue}
				onChange={handleChange}
			/>
		);
	},
);
