// state
import "#/utils/globalLegendPersistSettings";

// react
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";

// styles
import "./index.css";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "./i18n";

import registerServiceWorker from "./registerServiceWorker";

// state
import { ui$ } from "./modules/ui/state/ui";

// components
import { Spinner } from "./components/Spinner/Spinner";

// containers
import { App } from "./containers/App/App";

const rootNode = document.getElementById("root");
document.body.classList.add(
	ui$.theme.get(),
	"bg-white",
	"dark:bg-slate-950",
	"text-slate-500",
	"dark:text-slate-400",
);
if (rootNode !== null) {
	const root = createRoot(rootNode);
	root.render(
		<React.StrictMode>
			<Suspense fallback={<Spinner isVisible={true} />}>
				<App />
			</Suspense>
		</React.StrictMode>,
	);
}
registerServiceWorker();
