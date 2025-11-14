// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "@legendapp/state/react";

// utils
import { readFile } from "#/utils/readFile.js";

// state
const { appState$ } = await import("#/modules/appState/state/appState.js");

import { dialog$ } from "#/modules/dialog/state/dialog.js";

// components
import {
	faFileImport,
	faPowerOff,
	faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AccountsManager = lazy(
	() => import("#/components/AccountsManager/AccountsManager.jsx"),
);
import { FileInput } from "#/components/FileInput/FileInput.jsx";
const HotutilsSettingsForm = lazy(
	() => import("#/modules/hotUtils/components/HotutilsSettingsForm.jsx"),
);
import { UISettingsForm } from "#/modules/ui/components/UISettingsForm.jsx";

import { Button } from "#ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card.jsx";
import { Separator } from "#ui/separator.jsx";

const GeneralSettingsView: React.FC = observer(() => {
	const [t] = useTranslation("settings-ui");

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
						onClick={() => appState$.reset()}
					>
						{t("general.backup.ResetProceed")}
					</Button>
				</div>
			</div>
		);
	};

	const global =
		"grid gap-3 md:grid-cols-[1fr[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;

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
							id={"backup-import"}
							accept=".json"
							icon={faFileImport}
							label={t("general.backup.Restore")}
							handler={(file) =>
								readFile(
									file,
									(textInFile) => appState$.loadBackup(textInFile),
									(error) => dialog$.showError(error.message),
								)
							}
						/>
						<Button className={""} onClick={() => appState$.saveBackup()}>
							<FontAwesomeIcon icon={faSave} title={t("general.backup.Save")} />
							<span className={"p-l-2"}>{t("general.backup.Save")}</span>
						</Button>
					</div>
					<Separator className={"h-26"} orientation={"vertical"} />
					<Button
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

GeneralSettingsView.displayName = "GeneralSettingsView";

export default GeneralSettingsView;
