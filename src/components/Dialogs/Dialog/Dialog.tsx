// react
import React from "react";

// components
import * as DialogPrimitive from "#ui/dialog.jsx";

export const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.DialogContent>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.DialogContent>
>(({ children, ...props }, forwardedRef) => (
	<DialogPrimitive.DialogPortal>
		<DialogPrimitive.DialogOverlay />
		<DialogPrimitive.DialogContent {...props} ref={forwardedRef}>
			{children}
		</DialogPrimitive.DialogContent>
	</DialogPrimitive.DialogPortal>
));

export const Dialog = DialogPrimitive.Dialog;
export const DialogClose = DialogPrimitive.DialogClose;
export const DialogTitle = DialogPrimitive.DialogTitle;
export const DialogDescription = DialogPrimitive.DialogDescription;
