// react
import { reactive, use$ } from "@legendapp/state/react";

// state
import { dialog$ } from "../state/dialog";

// components
import * as DialogPrimitive from "#/components/Dialogs/Dialog/Dialog";

const ReactiveDialog = reactive(DialogPrimitive.Dialog);

export const Dialog = () => {
	const content = use$(dialog$.content);

	return (
		<ReactiveDialog
			$modal={dialog$.modal}
			$open={dialog$.open}
			onOpenChange={(open) => dialog$.open.set(open)}
		>
			<DialogPrimitive.DialogContent>
				<DialogPrimitive.DialogTitle />
				<DialogPrimitive.DialogDescription />
				{content}
			</DialogPrimitive.DialogContent>
		</ReactiveDialog>
	);
};
