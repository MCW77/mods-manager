// react
import * as React from 'react';

// state
import { observable } from "@legendapp/state";

// components
import * as UITypes from '#/components/types';

export const dialog$ = observable({
  content: <></> as UITypes.DOMContent,
  modal: false,
  open: false,
  show: (content: UITypes.DOMContent, modal: boolean = false) => {
    if (dialog$.open.peek() === false) {
      dialog$.content.set(content);
      dialog$.modal.set(modal);
      dialog$.open.set(true);
      return ;
    }
    const dispose = dialog$.open.onChange(({value}) => {
      if (value === false) {
        dialog$.content.set(content);
        dialog$.modal.set(modal);
        dialog$.open.set(true);
        dispose();
      }
    })
  },
  hide: () => {
    dialog$.open.set(false);
  },
});