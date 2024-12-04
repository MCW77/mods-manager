import { observable } from "@legendapp/state";

const errorMessage$ = observable({
	message: "" as React.ReactNode,
	reason: "" as React.ReactNode,
	solution: "" as React.ReactNode,
});

export { errorMessage$ };
