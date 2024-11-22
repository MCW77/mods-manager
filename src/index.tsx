// state
import "#/utils/globalLegendPersistSettings";
import { stateLoader$ } from "./modules/stateLoader/stateLoader";

// react
import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { observer, Show } from "@legendapp/state/react";

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
const LazyApp = lazy(() => import("./containers/App/App"));

stateLoader$.initialize();

const rootNode = document.getElementById("root");
document.body.classList.add(
	ui$.theme.get(),
	"bg-white",
	"dark:bg-slate-950",
	"text-slate-500",
	"dark:text-slate-400",
);

const RootComponent = observer(() => {
	return (
		<Show if={stateLoader$.isDone} else={() => <Spinner isVisible={true} />}>
			{() => (
				<Suspense fallback={<Spinner isVisible={true} />}>
					<LazyApp />
				</Suspense>
			)}
		</Show>
	);
});

if (rootNode !== null) {
	const root = createRoot(rootNode);
	root.render(
		<React.StrictMode>
			<RootComponent />
		</React.StrictMode>,
	);
}
registerServiceWorker();
