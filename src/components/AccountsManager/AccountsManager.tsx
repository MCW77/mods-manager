// react
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// styles
import { faFileImport, faTrashCan } from "@fortawesome/free-solid-svg-icons";

// utils
import formatAllyCode from "#/utils/formatAllyCode";
import { readFile } from "#/utils/readFile";

// state
import { dialog$ } from "#/modules/dialog/state/dialog";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// modules
import { App } from "#/state/modules/app";

//components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FileInput } from "#/components/FileInput/FileInput";
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { RadioGroup, RadioGroupItem } from "#ui/radio-group";

const AccountsManager = React.memo(() => {
	const dispatch: ThunkDispatch = useDispatch();
	const playerProfiles = profilesManagement$.profiles.playernameByAllycode.get()
	const [selectedProfile, setSelectedProfile] = useState(
		Object.keys(playerProfiles)[0] ?? "",
	);
	const [t, i18n] = useTranslation("settings-ui");

	/**
	 * Renders the "Are you sure?" modal for deleting an ally code
	 */
	const deleteAllyCodeModal = () => {
		return (
			<div>
				<h2>
					{t("general.accounts.Delete")}{" "}
					<strong>{formatAllyCode(selectedProfile)}</strong>?
				</h2>
				<p>{t("general.accounts.DeletionConfirmation")}</p>
				<p>
					{t("general.accounts.DeletionExplanation1")}{" "}
					{t("general.accounts.DeletionExplanation2")}
				</p>

				<div className={"flex gap-2 justify-center p-1"}>
					<Button
						type={"button"}
						onClick={() => dialog$.hide()}
					>
						{t("general.accounts.Cancel")}
					</Button>
					<Button
						type={"button"}
						variant={"destructive"}
						className={""}
						onClick={() => {
							dialog$.hide();
							dispatch(App.thunks.deleteProfile(selectedProfile));
						}}
					>
						{t("general.accounts.Proceed")}
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className={"flex gap-2 flex-col items-center"}>
			<div className="flex gap-2 items-center">
				<FileInput
					accept={".json"}
					className={"w-max text-balance"}
					label={t("general.accounts.Import")}
					icon={faFileImport}
					handler={(file) =>
						readFile(
							file,
							(textInFile) =>
								dispatch(App.thunks.importC3POProfile(textInFile)),
							(error) => dialog$.showError(error.message),
						)
					}
				/>
				<Button
					className={"w-max text-balance"}
					disabled={selectedProfile === ""}
					type={"button"}
					variant={"destructive"}
					onClick={() => dialog$.show(deleteAllyCodeModal())}
				>
					<FontAwesomeIcon
						className="m-r-2"
						icon={faTrashCan}
						title={`${t("general.accounts.Delete")}`}
					/>
					{`${t("general.accounts.Delete")} ${formatAllyCode(selectedProfile)}`}
				</Button>
			</div>
			<div className={"accounts"}>
				<Label className={"p-l-6"}>{t("general.accounts.Profile")}</Label>
				<RadioGroup
					defaultValue={Object.entries(playerProfiles)[0][0]}
					onValueChange={(value: string) => setSelectedProfile(value)}
				>
					{Object.entries(playerProfiles).map((profile, index) => (
						<div className="flex items-center space-x-2" key={profile[0]}>
							<RadioGroupItem value={profile[0]} id={`profile-${index}`} />
							<Label htmlFor={`profile-${index}`}>{`${formatAllyCode(
								profile[0],
							)} - ${profile[1]}`}</Label>
						</div>
					))}
				</RadioGroup>
			</div>
		</div>
	);
});

AccountsManager.displayName = "AccountsManager";

export { AccountsManager };
