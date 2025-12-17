// react
import React from "react";

// components
import * as DialogPrimitive from "#/components/custom/dialog";

const Dialog = DialogPrimitive.Dialog;

const DialogTrigger = DialogPrimitive.DialogTrigger;

const DialogPortal = DialogPrimitive.DialogPortal;

const DialogOverlay = DialogPrimitive.DialogOverlay;

const DialogClose = DialogPrimitive.DialogClose;

const DialogHeader = DialogPrimitive.DialogHeader;

const DialogFooter = DialogPrimitive.DialogFooter;

const DialogTitle = DialogPrimitive.DialogTitle;

const DialogDescription = DialogPrimitive.DialogDescription;

const DialogContent = React.forwardRef<
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

export {
	Dialog,
	DialogPortal,
	DialogOverlay,
	DialogTrigger,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
};
