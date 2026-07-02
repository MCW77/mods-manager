// state
import "#/utils/globalLegendPersistSettings";

// react
import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

// styles
import "./index.css";
import "virtual:uno.css";
import "./i18n";

// containers
const App = lazy(() => import("./containers/App/App"));

if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_REACT_SCAN === "true") {
	void import("react-scan").then(({ scan }) => {
		scan({
			enabled: true,
		});
	});
}

const rootNode = document.getElementById("root");

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
