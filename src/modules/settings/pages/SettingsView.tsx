// react
import { useTranslation } from "react-i18next";
import { observer } from "@legendapp/state/react";

// styles
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

// utils
import { match } from "ts-pattern";

// state
import { settings$ } from "../state/settings";
import { ui$ } from "#/modules/ui/state/ui";

// domain
import type { SettingsSections } from "#/modules/settings/domain/SettingsSections";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// containers
import GeneralSettingsView from "#/modules/settings/components/GeneralSettingsView";
import OptimizerSettingsView from "#/modules/settings/components/OptimizerSettingsView";

const SettingsView = observer(() => {
	const [t, i18n] = useTranslation("settings-ui");

	const renderSection = (sectionName: SettingsSections) => {
		return (
			<div
				className={`${sectionName} m-[0.2em] p-[0.4em] border-1 border-solid ${
					sectionName === settings$.section.get()
						? "border-yellow-400"
						: "border-white"
				} rounded-xl bg-transparent`}
				onClick={() => settings$.section.set(sectionName)}
				onKeyUp={(e) => {
					if (e.key === "Enter") {
						settings$.section.set(sectionName);
					}
				}}
			>
				{t(`${sectionName}.Title`)}
			</div>
		);
	};

	const renderTopic = () => {
		return match(settings$.section.get())
			.with("general", () => <GeneralSettingsView />)
			.with("optimizer", () => <OptimizerSettingsView />)
			.otherwise(() => {
				return <div id={`settings-${settings$.section.get()}`} />;
			});
	};

	return (
		<div className={"Settings-page flex flex-col w-full"} key={"settings"}>
			<nav className="sections flex flex-wrap justify-evenly">
				{ui$.previousSection.get() !== "settings" && (
					<div className="returnTo m-[0.2em] p-[0.4em]">
						<FontAwesomeIcon
							icon={faCircleLeft}
							title={"Go back"}
							onClick={() => {
								ui$.goToPreviousSection();
							}}
						/>
					</div>
				)}

				{renderSection("general")}
				{renderSection("explorer")}
				{renderSection("optimizer")}
			</nav>
			<div className={"overflow-y-auto"}>{renderTopic()}</div>
		</div>
	);
});

SettingsView.displayName = "SettingsView";

export { SettingsView };
