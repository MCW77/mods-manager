// react
import { useTranslation } from "react-i18next";

// state
import { beginBatch, endBatch } from "@legendapp/state";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const mods$ = stateLoader$.mods$;

// domain
import type { Mod } from "#/domain/Mod";

// components
import { Button } from "#ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#ui/dialog";

type ComponentProps = {
	groupedMods: Mod[][];
};

const DeleteModsModal = ({ groupedMods }: ComponentProps) => {
	const [t] = useTranslation("explore-ui");

	return (
		<>
			<DialogHeader>
				<DialogTitle>{t("DeleteButton")}</DialogTitle>
				<DialogDescription className={"text-balance"}>
					{t("DeleteAlt1")}
				</DialogDescription>
			</DialogHeader>
			<p className="text-balance">{t("DeleteAlt2")}</p>
			<DialogFooter className="sm:justify-center pb-1">
				<div className="flex flex-row gap-2 items-center justify-center">
					<DialogClose render={<Button type={"button"}>No</Button>} />
					<DialogClose
						render={
							<Button
								type={"button"}
								variant={"destructive"}
								onClick={() => {
									beginBatch();
									for (const mods of groupedMods) {
										mods$.deleteMods(mods);
									}
									endBatch();
								}}
							>
								Yes, Delete Mods
							</Button>
						}
					/>
				</div>
			</DialogFooter>
		</>
	);
};

DeleteModsModal.displayName = "DeleteModsModal";

export default DeleteModsModal;
