// state
import "#/utils/globalLegendPersistSettings";

// react
import { scan } from "react-scan";
import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

// styles
import "./index.css";
import "virtual:uno.css";
import "./i18n";

// state
import { ui$ } from "./modules/ui/state/ui";

// containers
const App = lazy(() => import("./containers/App/App"));

scan({
	enabled: true,
});

const rootNode = document.getElementById("root");
document.documentElement.classList.add(ui$.theme.get());

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
