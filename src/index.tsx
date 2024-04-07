// state
import "#/utils/globalLegendPersistSettings";
import getDatabase from "./state/storage/Database";

// react
import { configureStore } from '@reduxjs/toolkit';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { ThunkDispatch } from "./state/reducers/modsOptimizer";

// styles
import './index.css';
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css';
import './i18n';

import registerServiceWorker from './registerServiceWorker';

// reducers
import modsOptimizer from "./state/reducers/modsOptimizer";

// state
import { profilesManagement$ } from "./modules/profilesManagement/state/profilesManagement";

// modules
import { App as AppModule } from './state/modules/app';
import { Storage } from './state/modules/storage';

// components
import { Spinner } from './components/Spinner/Spinner';

// containers
import { App } from './containers/App/App';

const store = configureStore({
  reducer: modsOptimizer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    })
});

// Instantiate the database
getDatabase(
  (db) => {
    const dispatch: ThunkDispatch = store.dispatch;
    dispatch(
      Storage.thunks.databaseReady(profilesManagement$.profiles.activeAllycode.get())
    );
  },
  (error: DOMException | null) => {
    if (error instanceof DOMException) {
      store.dispatch(AppModule.actions.showError(
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
      store.dispatch(AppModule.actions.showError(
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
document.body.classList.add(store.getState().theme, "bg-white", "dark:bg-slate-950", "text-slate-500", "dark:text-slate-400");
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
