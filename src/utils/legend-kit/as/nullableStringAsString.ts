import { linked, type ObservableParam } from "@legendapp/state";

export const nullableStringAsString = (
	text$: ObservableParam<string | undefined | null>,
) =>
	linked({
		get: () => {
			if (text$.peek() === undefined) {
				return "undefined";
			}
			if (text$.peek() === null) {
				return "null";
			}
			return text$.get();
		},
		set: ({ value }) => {
			if (value === "undefined") {
				text$?.set(undefined);
				return;
			}
			if (value === "null") {
				text$?.set(null);
				return;
			}
			text$?.set(value);
		},
	});
