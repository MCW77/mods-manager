import { linked, type ObservableParam } from "@legendapp/state";

export const booleanAsString = (
	bool$: ObservableParam<boolean | undefined | null>,
) =>
	linked({
		get: () => {
			if (bool$.peek() === undefined) {
				return "";
			}
			if (bool$.peek() === null) {
				return "";
			}
			return bool$.get() ? "true" : "false";
		},
		set: ({ value }) => {
			if (value === undefined) {
				bool$?.set(undefined);
				return;
			}
			if (value === null) {
				bool$?.set(null);
				return;
			}
			bool$?.set(value === "true");
		},
	});
