// react
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// styles
import { faFileImport, faTrashCan } from "@fortawesome/free-solid-svg-icons";

// utils
import formatAllycode from "#/utils/formatAllycode";
import { readFile } from "#/utils/readFile";

// state
import { useValue } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
import { dialog$ } from "#/modules/dialog/state/dialog";

//components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FileInput } from "#/components/FileInput/FileInput";
import { Button } from "#ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#ui/dialog";
import { Label } from "#ui/label";
import { RadioGroup, RadioGroupItem } from "#ui/radio-group";

const ProfilesManager = React.memo(() => {
	const playerProfiles = useValue(
		profilesManagement$.profiles.playernameByAllycode,
	);
	const [selectedProfile, setSelectedProfile] = useState(
		Object.keys(playerProfiles)[0] ?? "",
	);
	const [t] = useTranslation("settings-ui");

	/**
	 * Renders the "Are you sure?" modal for deleting an ally code
	 */
	const deleteAllycodeModal = () => {
		return (
			<>
				<DialogHeader>
					<DialogTitle>{t("general.accounts.Delete")}</DialogTitle>
					<DialogDescription>
						{t("general.accounts.DeletionConfirmation")}
					</DialogDescription>
				</DialogHeader>
				<div>
					{t("general.accounts.DeletionExplanation1")}{" "}
					{t("general.accounts.DeletionExplanation2")}
				</div>
				<DialogFooter className="sm:justify-center pb-1">
					<div className="flex flex-row gap-2 items-center justify-center">
						<DialogClose
							render={
								<Button type={"button"}>{t("general.accounts.Cancel")}</Button>
							}
						/>
						<DialogClose
							render={
								<Button
									type={"button"}
									variant={"destructive"}
									className={""}
									onClick={() => {
										profilesManagement$.deleteProfile(selectedProfile);
									}}
								>
									{t("general.accounts.Proceed")}
								</Button>
							}
						/>
					</div>
				</DialogFooter>
			</>
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
					id={"c3po-import"}
					handler={(file) =>
						readFile(
							file,
							(textInFile) => {
								const { error, totalMods: importedModsCount } =
									profilesManagement$.importModsFromC3PO(textInFile);
								if (error !== "") {
									dialog$.showError({ error });
									return;
								}
								if (importedModsCount > 0) {
									dialog$.showFlash(
										<p>
											Successfully imported{" "}
											<span className={"text-mod-gold"}>
												{importedModsCount}
											</span>{" "}
											mods for player{" "}
											<span className={"text-mod-gold"}>
												{profilesManagement$.activeProfile.playerName.peek()}
											</span>
										</p>,
										"",
										"",
										undefined,
										"success",
									);
								}
							},
							(error) => dialog$.showError({ error: error.message }),
						)
					}
				/>
				<Button
					className={"w-max text-balance"}
					disabled={selectedProfile === ""}
					type={"button"}
					variant={"destructive"}
					onClick={() => dialog$.show({ content: deleteAllycodeModal() })}
				>
					<FontAwesomeIcon
						className="m-r-2"
						icon={faTrashCan}
						title={`${t("general.accounts.Delete")}`}
					/>
					{`${t("general.accounts.Delete")} ${formatAllycode(selectedProfile)}`}
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
							<Label htmlFor={`profile-${index}`}>{`${formatAllycode(
								profile[0],
							)} - ${profile[1]}`}</Label>
						</div>
					))}
				</RadioGroup>
			</div>
		</div>
	);
});

ProfilesManager.displayName = "ProfilesManager";

export default ProfilesManager;
