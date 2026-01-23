import { linked, type ObservableParam } from "@legendapp/state";

export const nullableStringAsString = (
	text$: ObservableParam<string | undefined | null>,
) =>
	linked({
		get: () => {
			const text = text$.get();
			if (text === undefined) {
				return "";
			}
			if (text === null) {
				return "";
			}
			return text;
		},
		set: ({ value }) => {
			if (value === undefined) {
				text$?.set(undefined);
				return;
			}
			if (value === null) {
				text$?.set(null);
				return;
			}
			text$?.set(value);
		},
	});
