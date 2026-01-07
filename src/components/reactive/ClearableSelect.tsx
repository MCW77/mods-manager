// react
import { observer } from "@legendapp/state/react";
import type { ComponentProps } from "react";
import type { Observable } from "@legendapp/state";

// components
import { ClearableSelect as ShadCNClearableSelect } from "#/components/custom/ClearableSelect";

type BaseProps = ComponentProps<typeof ShadCNClearableSelect>;

interface ReactiveClearableSelectProps
	extends Omit<BaseProps, "value" | "onChange"> {
	$value?: Observable<string | undefined>;
	value?: string | undefined;
	onChange?: (value: string | undefined) => void;
}

export const ClearableSelect = observer(
	({ $value, value, onChange, ...props }: ReactiveClearableSelectProps) => {
		const obsValue = $value?.get();

		const handleChange = (newValue: string | undefined) => {
			if ($value) {
				$value.set(newValue);
			}
			onChange?.(newValue);
		};

		return (
			<ShadCNClearableSelect
				{...props}
				value={$value ? (obsValue ?? "") : value}
				onChange={handleChange}
			/>
		);
	},
);
