// react
import { observer, reactive } from "@legendapp/state/react";

// state
import { dialog$ } from "../state/dialog";

// components
import * as DialogPrimitive from "#/components/Dialogs/Dialog/Dialog";

const ReactiveDialog = reactive(DialogPrimitive.Dialog);

export const Dialog = observer(() => (
	<ReactiveDialog
		$modal={dialog$.modal}
		$open={dialog$.open}
		onOpenChange={(open) => dialog$.open.set(open)}
	>
		<DialogPrimitive.DialogContent>
			{dialog$.content.get()}
		</DialogPrimitive.DialogContent>
	</ReactiveDialog>
));
