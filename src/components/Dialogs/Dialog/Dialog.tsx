// react
import React from 'react';

// components
import * as DialogPrimitive from '#ui/dialog';


export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.DialogContent>
>(
  ({ children, ...props }, forwardedRef) => (
    <DialogPrimitive.DialogPortal>
      <DialogPrimitive.DialogOverlay />
      <DialogPrimitive.DialogContent {...props} ref={forwardedRef}>
        {children}
      </DialogPrimitive.DialogContent>
    </DialogPrimitive.DialogPortal>
  )
);

export const Dialog = DialogPrimitive.Dialog;
export const DialogClose = DialogPrimitive.DialogClose;

