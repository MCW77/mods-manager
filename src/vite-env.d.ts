/// <reference types="vite/client" />

import type { ObservableParam } from "@legendapp/state";
import type { ReactNode } from "react";

declare module "@legendapp/state/react" {
	export const Computed: (props: {
		children: ObservableParam | (() => ReactNode) | ReactNode;
	}) => React.ReactElement;

	export const Memo: (props: {
		children: ObservableParam | (() => ReactNode) | ReactNode;
	}) => React.ReactElement;
}
