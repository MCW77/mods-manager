// state
console.log("index 1");
import "#/utils/globalLegendPersistSettings";
console.log("index 2");
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");
console.log("index 3");

// react
import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { observer, Show } from "@legendapp/state/react";
console.log("index 4");

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
const App = lazy(() => import("./containers/App/App"));

const rootNode = document.getElementById("root");
console.dir(rootNode);
document.body.classList.add(
	ui$.theme.get(),
	"bg-white",
	"dark:bg-slate-950",
	"text-slate-500",
	"dark:text-slate-400",
);

const RootComponent = observer(() => {
	return (
		<Show
			if={stateLoader$.isDone}
			else={() => (
				<div className={"bg-black"}>
					Root
					<Spinner isVisible={true} />
				</div>
			)}
		>
			{() => (
				<Suspense
					fallback={
						<div className={"bg-black"}>
							Lazy
							<Spinner isVisible={true} />
						</div>
					}
				>
					<App />
				</Suspense>
			)}
		</Show>
	);
});

if (rootNode !== null) {
	const root = createRoot(rootNode);
	console.log("rendering root");
	root.render(
		<React.StrictMode>
			<Suspense>
				<App />
			</Suspense>
		</React.StrictMode>,
	);
}
registerServiceWorker();
