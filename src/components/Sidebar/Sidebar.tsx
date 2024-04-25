// react
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// styles
import "./Sidebar.css";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// modules
import { App } from "../../state/modules/app";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type * as UITypes from "../types";

type ComponentProps = {
	content: UITypes.DOMContent;
};

const Sidebar = React.memo(({ content }: ComponentProps) => {
	const dispatch = useDispatch();
	const showSidebar = useSelector(App.selectors.selectShowSidebar);

	return (
		<div className={`sidebar-wrapper ${showSidebar ? "show" : "hide"}`}>
			<div
				className={`sidebar ${showSidebar ? "show" : "hide"}`}
				key={"sidebar"}
			>
				{content}
			</div>
			<span
				className={`toggle-sidebar ${showSidebar ? "hide" : "show"}`}
				onClick={() => dispatch(App.actions.toggleSidebar())}
				onKeyUp={(e) =>
					e.key === "Enter" && dispatch(App.actions.toggleSidebar())
				}
			>
				<FontAwesomeIcon icon={faArrowLeft} title={"Go back"} />
			</span>
		</div>
	);
});

Sidebar.displayName = "Sidebar";

export { Sidebar };
