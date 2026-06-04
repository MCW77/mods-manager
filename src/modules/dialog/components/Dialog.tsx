// react
import { reactive, useValue } from "@legendapp/state/react";

// state
import { dialog$ } from "../state/dialog";

// components
import * as DialogPrimitive from "#ui/dialog";

const ReactiveDialog = reactive(DialogPrimitive.Dialog);

export const Dialog = () => {
	const content = useValue(dialog$.content);
	const contentStyle = useValue(dialog$.contentStyle);

	return (
		<ReactiveDialog
			$modal={dialog$.modal}
			$open={dialog$.open}
			onOpenChange={(open) => dialog$.open.set(open)}
		>
			<DialogPrimitive.DialogContent
				showCloseButton={false}
				className={contentStyle}
			>
				{content}
			</DialogPrimitive.DialogContent>
		</ReactiveDialog>
	);
};
