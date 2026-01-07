import { linked, type ObservableParam } from "@legendapp/state";

export const booleanAsString = (bool$: ObservableParam<boolean | undefined>) =>
	linked({
		get: () => {
			if (bool$.peek() === undefined) {
				return undefined;
			}
			return bool$.get() ? "true" : "false";
		},
		set: ({ value }) => {
			if (value === undefined) {
				bool$?.set(undefined);
				return;
			}
			bool$?.set(value === "true");
		},
	});
