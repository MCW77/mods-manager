import { it } from "vitest";

// react
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

// containers
const App = lazy(() => import("#/containers/App/App"));

it("renders without crashing", () => {
	const div = document.createElement("div");
	const root = createRoot(div);
	root.render(
		<Suspense fallback={null}>
			<App />
		</Suspense>,
	);
	root.unmount();
});
