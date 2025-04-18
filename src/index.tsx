// state
import "#/utils/globalLegendPersistSettings";
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

// react
import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { observer, Show } from "@legendapp/state/react";

// styles
import "./index.css";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "./selected-styles.css";
import "./i18n";

// state
import { ui$ } from "./modules/ui/state/ui";

// components
import { Spinner } from "./components/Spinner/Spinner";

// containers
const App = lazy(() => import("./containers/App/App"));

const rootNode = document.getElementById("root");
document.body.classList.add(ui$.theme.get());

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
	root.render(
		<React.StrictMode>
			<Suspense>
				<App />
			</Suspense>
		</React.StrictMode>,
	);
}
