// react
import { useState } from "react";
import { useTranslation } from "react-i18next";

// styles
import "./FlexSidebar.css";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";

interface FlexSidebarProps {
	isCollapsed?: boolean;
	mainContent: JSX.Element | JSX.Element[];
	sidebarContent: JSX.Element | JSX.Element[];
}

const FlexSidebar = ({
	isCollapsed = false,
	mainContent,
	sidebarContent,
}: FlexSidebarProps) => {
	const [t, i18n] = useTranslation("global-ui");
	const [isCollapsed2, setCollapsed] = useState(isCollapsed);

	return (
		<div
			className={`flexsidebar-container flex relative duration-1000 ease ${isCollapsed2 ? "collapsed" : ""}`}
		>
			<Button
				variant="ghost"
				size="default"
				className={`block absolute top-4em m-0 bg-background border-1px border-solid border-border will-change[transform_left] transition-[transform,left] duration-1000 ease  z-1 ${isCollapsed2 ? "show left-0 rotate-180" : "hide left-28vw"}`}
				onClick={() => {
					setCollapsed(!isCollapsed2);
				}}
				onKeyUp={(e) => {
					if (e.key === "Enter") {
						setCollapsed(!isCollapsed2);
					}
				}}
			>
				<FontAwesomeIcon
					icon={faAngleLeft}
					title={`${
						isCollapsed2
							? t("sidebar.Toggle-show", "show sidebar")
							: t("sidebar.Toggle-collapse", "hide sidebar")
					}`}
				/>
			</Button>
			<div
				className={`relative ${isCollapsed2 ? "flex-[0.0000001_1_0]" : "flex-[0.0000001_0_30vw]"} h-full overflow-x-hidden overflow-y-auto transition-[flex] duration-1000 ease will-change-[flex]`}
			>
				{sidebarContent}
			</div>
			<div
				className={`flexsidebar-maincontent flex p-l-1.5em will-change-flex ${isCollapsed2 ? "flex-[0.000001_0_100vw)]" : "flex-[0.000001_1_calc(70vw_-_2em)]"}`}
			>
				{mainContent}
			</div>
		</div>
	);
};

FlexSidebar.displayName = "FlexSidebar";

interface FlexSidebarSidebarContentProps {
	sidebarContent: JSX.Element | JSX.Element[];
}

const FlexSidebarSidebarContent = ({
	sidebarContent,
}: FlexSidebarSidebarContentProps) => {
	return (
		<div className="absolute inset-0 m-l-1 overflow-hidden rounded-lg border-1 border-solid border-[#888]">
			{sidebarContent}
		</div>
	);
};

FlexSidebarSidebarContent.displayName = "FlexSidebarSidebarContent";

export { FlexSidebar };
