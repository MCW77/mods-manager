import { linked, type ObservableParam } from "@legendapp/state";

export function asArray<T>(value$: ObservableParam<T | undefined>) {
	return linked({
		get: () => {
			const value = value$.peek();
			if (value === undefined) {
				return [undefined] as T[];
			}
			return [value] as T[];
		},
		set: ({ value }) => {
			if (value === undefined || value.length === 0 || value[0] === undefined) {
				value$?.set(undefined);
				return;
			}
			value$?.set(value[0]);
		},
	});
}
