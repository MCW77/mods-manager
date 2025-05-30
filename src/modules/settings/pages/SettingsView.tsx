// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { observer, use$ } from "@legendapp/state/react";

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
const GeneralSettingsView = lazy(
	() => import("#/modules/settings/components/GeneralSettingsView"),
);
import { OptimizerSettingsView } from "#/modules/settings/components/OptimizerSettingsView";

const SettingsView: React.FC = observer(() => {
	const [t, i18n] = useTranslation("settings-ui");
	const previousSection = use$(ui$.previousSection);

	const renderSection = (sectionName: SettingsSections) => {
		const section = use$(settings$.section);

		return (
			<div
				className={`${sectionName} m-[0.2em] p-[0.4em] border-1 border-solid ${
					sectionName === section ? "border-yellow-400" : "border-white"
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
		const section = use$(settings$.section);

		return match(section)
			.with("general", () => <GeneralSettingsView />)
			.with("optimizer", () => <OptimizerSettingsView />)
			.otherwise(() => {
				return <div id={`settings-${section}`} />;
			});
	};

	return (
		<div className={"Settings-page flex flex-col grow-1"} key={"settings"}>
			<nav className="sections flex flex-wrap justify-evenly">
				{previousSection !== "settings" && (
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

export default SettingsView;
