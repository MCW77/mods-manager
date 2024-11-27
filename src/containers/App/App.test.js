// react
import React, { lazy } from "react";
import ReactDOM from "react-dom";

// containers
const App = lazy(() => import("./App"));

it("renders without crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});
