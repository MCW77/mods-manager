// react
import type { ComponentProps } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { observer } from "@legendapp/state/react";

// utils
import { saveAs } from "file-saver";
import { readFile } from "#/utils/readFile";

// state
import { about$ } from "#/modules/about/state/about";
import { dialog$ } from "#/modules/dialog/state/dialog";
import { hotutils$ } from "#/modules/hotUtils/state/hotUtils";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { lockedStatus$ } from "#/modules/lockedStatus/state/lockedStatus";
import { modsView$ } from "#/modules/modsView/state/modsView";
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { templates$ } from "#/modules/templates/state/templates";
import { ui$ } from "#/modules/ui/state/ui";

// modules
import { App } from "#/state/modules/app";
import { Storage } from "#/state/modules/storage";

// domain
import type { IUserData } from "#/state/storage/Database";

// components
import {
	faFileImport,
	faPowerOff,
	faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AccountsManager } from "#/components/AccountsManager/AccountsManager";
import { FileInput } from "#/components/FileInput/FileInput";
import { HotutilsSettingsForm } from "#/modules/hotUtils/components/HotutilsSettingsForm";
import { UISettingsForm } from "#/modules/ui/components/UISettingsForm";
import { Button } from "#ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { Separator } from "#ui/separator";

const GeneralSettingsView: React.FC = observer(() => {
	const allycode = profilesManagement$.profiles.activeAllycode.get();
	const version = about$.version.get();
	const dispatch: ThunkDispatch = useDispatch();
	const [t, i18n] = useTranslation("settings-ui");

	/**
	 * Renders the "Are you sure?" modal for resetting the app
	 * @returns JSX Element
	 */
	const resetModal = () => {
		return (
			<div>
				<h2>{t("general.backup.ResetConfirmation")}</h2>
				<p>{t("general.backup.ResetExplanation")}</p>
				<div className={"flex gap-2 justify-center p-1"}>
					<Button type={"button"} onClick={() => dialog$.hide()}>
						{t("general.backup.ResetCancel")}
					</Button>
					<Button
						type={"button"}
						variant={"destructive"}
						onClick={() => {
							dialog$.hide();
							ui$.currentSection.set("help");
							optimizationSettings$.reset();
							incrementalOptimization$.reset();
							lockedStatus$.reset();
							templates$.reset();
							profilesManagement$.reset();
							hotutils$.reset();
							modsView$.reset();
							dispatch(App.thunks.reset());
						}}
					>
						{t("general.backup.ResetProceed")}
					</Button>
				</div>
			</div>
		);
	};

	const global =
		"grid gap-3 md:grid-cols-[1fr[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
	const labelCSS = "grid-col-[labels] grid-row-auto" as const;
	const inputCSS = "grid-col-[controls] grid-row-auto" as const;

	return (
		<div className="grid grid-gap-2 justify-center grid-cols-[repeat(auto-fit,_minmax(min(500px,_100%),_1fr))]">
			<Card className="!bg-opacity-20 m-4">
				<CardHeader>
					<CardTitle>{t("general.display.Title")}</CardTitle>
				</CardHeader>
				<CardContent className={global}>
					<UISettingsForm />
				</CardContent>
			</Card>
			<Card className="!bg-opacity-20 m-4">
				<CardHeader>
					<CardTitle>{t("general.accounts.Title")}</CardTitle>
				</CardHeader>
				<CardContent className={global}>
					<AccountsManager />
				</CardContent>
			</Card>
			<Card className="!bg-opacity-20 m-4">
				<CardHeader>
					<CardTitle>HotUtils</CardTitle>
				</CardHeader>
				<CardContent>
					<HotutilsSettingsForm />
				</CardContent>
			</Card>
			<Card className="!bg-opacity-20 m-4">
				<CardHeader>
					<CardTitle>{t("general.backup.Title")}</CardTitle>
				</CardHeader>
				<CardContent className={"flex gap-6 items-center"}>
					<div className={"flex flex-col gap-2 items-stretch justify-center"}>
						<FileInput
							accept=".json"
							className={""}
							icon={faFileImport}
							label={t("general.backup.Restore")}
							handler={(file) =>
								readFile(
									file,
									(textInFile) =>
										dispatch(App.thunks.restoreProgress(textInFile)),
									(error) => dialog$.showError(error.message),
								)
							}
						/>
						<Button
							className={""}
							onClick={() => {
								dispatch(
									Storage.thunks.exportDatabase((progressData: IUserData) => {
										progressData.version = version;
										progressData.allycode = allycode;
										const progressDataSerialized = JSON.stringify(progressData);
										const userData = new Blob([progressDataSerialized], {
											type: "application/json;charset=utf-8",
										});
										saveAs(
											userData,
											`modsOptimizer-${new Date()
												.toISOString()
												.slice(0, 10)}.json`,
										);
									}),
								);
							}}
						>
							<FontAwesomeIcon icon={faSave} title={t("general.backup.Save")} />
							<span className={"p-l-2"}>{t("general.backup.Save")}</span>
						</Button>
					</div>
					<Separator className={"h-26"} orientation={"vertical"} />
					<Button
						className={inputCSS}
						type={"button"}
						variant={"destructive"}
						onClick={() => dialog$.show(resetModal())}
					>
						<FontAwesomeIcon
							className={"p-r-2"}
							icon={faPowerOff}
							title={t("general.backup.Reset")}
						/>
						{t("general.backup.Reset")}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
});

const FormInput = (props: ComponentProps<"div">) => {
	return (
		<div className="grid-col-[controls] grid-row-auto">{props.children}</div>
	);
};

GeneralSettingsView.displayName = "GeneralSettingsView";

export default GeneralSettingsView;
