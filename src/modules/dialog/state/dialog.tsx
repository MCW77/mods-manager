// react
import type * as React from "react";

// state
import { type ObservableObject, observable } from "@legendapp/state";

// components
import { ErrorMessage } from "../components/ErrorMessage";
import { toast } from "sonner";

type Dialog = {
	content: React.ReactNode;
	error: React.ReactNode;
	reason: React.ReactNode;
	solution: React.ReactNode;
	isError: boolean;
	modal: boolean;
	open: boolean;
	show: (content: React.ReactNode, modal?: boolean) => void;
	showError: (
		error: React.ReactNode,
		reason?: React.ReactNode,
		solution?: React.ReactNode,
	) => void;
	showFlash: (
		title: React.ReactNode,
		description?: string,
		actionLabel?: string,
		actionHandler?: () => void,
		type?: string,
	) => void;
	hide: () => void;
};

export const dialog$: ObservableObject<Dialog> = observable({
	content: "" as React.ReactNode,
	error: "" as React.ReactNode,
	reason: "" as React.ReactNode,
	solution: "" as React.ReactNode,
	isError: false,
	modal: false,
	open: false,
	show: (content: React.ReactNode, modal = false) => {
		if (dialog$.open.peek() === false) {
			dialog$.content.set(content);
			dialog$.modal.set(modal);
			dialog$.open.set(true);
			return;
		}
		const dispose = dialog$.open.onChange(({ value }) => {
			if (value === false) {
				dialog$.content.set(content);
				dialog$.modal.set(modal);
				dialog$.open.set(false);
				dispose();
			}
		});
	},
	showError(
		error: React.ReactNode,
		reason: React.ReactNode = "",
		solution: React.ReactNode = "",
	) {
		dialog$.isError.set(true);
		if (dialog$.open.peek() === false) {
			dialog$.error.set(error);
			dialog$.reason.set(reason);
			dialog$.solution.set(solution);
			dialog$.content.set(<ErrorMessage />);
			dialog$.modal.set(false);
			dialog$.open.set(true);
			return;
		}
		const dispose = dialog$.open.onChange(({ value }) => {
			if (value === false) {
				dialog$.error.set("");
				dialog$.reason.set("");
				dialog$.solution.set("");
				dialog$.modal.set(false);
				dialog$.content.set(null);
				dialog$.open.set(false);
				dialog$.isError.set(false);
				dispose();
			}
		});
	},
	showFlash: (
		title: React.ReactNode,
		description = "",
		actionLabel = "",
		actionHandler: () => void = () => {},
		type = "",
	) => {
		let options = {};
		if (actionLabel !== "") {
			options = {
				action: {
					label: actionLabel,
					onClick: actionHandler,
				},
				description: description,
			}
		} else {
			options = {
				description: description,
			}
		}

		switch (type) {
			case "error":
				toast.error(title, options);
				break;
			case "warning":
				toast.warning(title, options);
				break;
			case "info":
				toast.info(title, options);
				break;
			case "success":
				toast.success(title, options);
				break;
			default:
				toast(title, options);
		}
	},
	hide: () => {
		dialog$.open.set(false);
	},
});
