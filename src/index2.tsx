// react
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";

import { AppDispatch, store } from './app/store';

// styles
import './i18n';
import './index.css';

import registerServiceWorker from './registerServiceWorker';

// state
import getDatabase from "./state/storage/Database";

import { dialog$ } from './modules/dialog/state/dialog';

// modules
import { Storage } from './state/modules/storage';

// components
import { Spinner } from './components/Spinner/Spinner';

// containers
import { App } from './app/App';


// Instantiate the database
getDatabase(
  (db) => {
    const dispatch: AppDispatch = store.dispatch;
    dispatch(
      Storage.thunks.databaseReady(store.getState().profiles.allyCode)
    );
  },
  (error: DOMException | null) => {
    if (error instanceof DOMException) {
      dialog$.showError(
        [
          <p key={1}>Unable to load database. This may be caused by a bug in Firefox in Private Browsing mode or
          with history turned off. If using Firefox, please switch to normal browsing mode. If you are still having
            issues, please ask for help in the discord server below.</p>,
          <p key={2}>Grandivory's mods optimizer is tested to work in <strong>Firefox, Chrome, and Safari on desktop
            only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
            using one of the supported browsers before asking for help.</p>,
          <p key={3}>Error Message: {error.message}</p>,
        ]
      ));
    } else {
      dialog$.showError(
        [
          <p key={1}>
            Unable to load database: {error} Please fix the problem and try again, or ask for help in the
            discord server below.
          </p>,
          <p key={2}>Grandivory's mods optimizer is tested to work in <strong>Firefox, Chrome, and Safari on desktop
            only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
            using one of the supported browsers before asking for help.</p>
        ]
      ));
    }
  }
);

const rootNode = document.getElementById('root')!;
rootNode.classList.add(store.getState().ui.theme);
const root = createRoot(rootNode);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Spinner isVisible={true}/>}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>
);
registerServiceWorker();
