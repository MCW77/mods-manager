import { linked, type ObservableParam } from "@legendapp/state";

export const numberAsNumberArray = (
	num$: ObservableParam<number | undefined>,
) =>
	linked({
		get: () => {
			const num = num$.peek();
			if (num === undefined) {
				return [Number.NaN];
			}
			return [num$.get()] as number[];
		},
		set: ({ value }) => {
			if (value === undefined || value.length === 0 || value[0] === undefined) {
				num$?.set(Number.NaN);
				return;
			}
			num$?.set(value[0]);
		},
	});
