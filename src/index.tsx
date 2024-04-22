// state
import "#/utils/globalLegendPersistSettings";
import getDatabase from "./state/storage/Database";

// react
import { configureStore } from "@reduxjs/toolkit";
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import type { ThunkDispatch } from "./state/reducers/modsOptimizer";

// styles
import "./index.css";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "./i18n";

import registerServiceWorker from "./registerServiceWorker";

// reducers
import modsOptimizer from "./state/reducers/modsOptimizer";

// state
import { dialog$ } from "./modules/dialog/state/dialog";
import { profilesManagement$ } from "./modules/profilesManagement/state/profilesManagement";
import { ui$ } from "./modules/ui/state/ui";

// modules
import { Storage } from "./state/modules/storage";

// components
import { Spinner } from "./components/Spinner/Spinner";

// containers
import { App } from "./containers/App/App";

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
      dialog$.showError(
        <div>`Unable to load database (${error.message})`</div>,
        "This may be caused by a bug in Firefox in Private Browsing mode or with history turned off",
        "If using Firefox, please switch to normal browsing mode. If you are still having issues, please ask for help in the discord server below.",
      );
    } else {
      dialog$.showError(
        <div>`Unable to load database (${error ?? ""})`</div>,
        "Unknown cause",
        "You found a unknown bug, please report in the discord server so we can improve with your solution or find one.",
      );
    }
  }
);

const rootNode = document.getElementById('root')!;
document.body.classList.add(ui$.theme.get(), "bg-white", "dark:bg-slate-950", "text-slate-500", "dark:text-slate-400");
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
