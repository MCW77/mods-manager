// react
import { useTranslation } from "react-i18next";

// state
import { beginBatch, endBatch } from "@legendapp/state";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
import { dialog$ } from "#/modules/dialog/state/dialog";

// domain
import type { Mod } from "#/domain/Mod";

// components
import { Button } from "#ui/button";

type ComponentProps = {
	groupedMods: Mod[][];
};

const DeleteModsModal = ({ groupedMods }: ComponentProps) => {
	const [t] = useTranslation("explore-ui");

	return (
		<div>
			<h2>{t("DeleteButton")}</h2>
			<p>
				{t("DeleteAlt1")}
				<br />
				{t("DeleteAlt2")}
			</p>
			<div className={"actions flex gap-2 justify-center p-t-2"}>
				<Button
					type={"button"}
					onClick={() => {
						dialog$.hide();
					}}
				>
					No
				</Button>
				<Button
					type={"button"}
					variant={"destructive"}
					onClick={() => {
						beginBatch();
						for (const mods of groupedMods) {
							profilesManagement$.deleteMods(mods);
						}
						endBatch();
						dialog$.hide();
					}}
				>
					Yes, Delete Mods
				</Button>
			</div>
		</div>
	);
};

DeleteModsModal.displayName = "DeleteModsModal";

export default DeleteModsModal;
