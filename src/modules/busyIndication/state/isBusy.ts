import { observable } from "@legendapp/state";

export const isBusy$ = observable(false);

isBusy$.onChange((isBusy) => {
	console.log("isBusy changed", isBusy);
});
