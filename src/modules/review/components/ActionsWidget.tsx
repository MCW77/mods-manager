// react
import { useId } from "react";
import { useTranslation } from "react-i18next";

// state
import { useValue } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const compilations$ = stateLoader$.compilations$;
const hotutils$ = stateLoader$.hotutils$;
const mods$ = stateLoader$.mods$;

import { dialog$ } from "#/modules/dialog/state/dialog";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// domain
import type { CharacterModdings } from "#/modules/compilations/domain/CharacterModdings";

// components
import CreateProfileModal from "#/modules/hotUtils/components/CreateProfileModal";
import MoveModsModal from "#/modules/modMove/components/MoveModsModal";
import TextualReview from "./TextualReview";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const ActionsWidget = () => {
	const [t] = useTranslation("optimize-ui");
	const actionsId = useId();
	const modById = useValue(() => mods$.activeModById.get());
	const modAssignments = useValue(
		compilations$.defaultCompilation.flatCharacterModdings,
	);
	const hasActiveSession = useValue(hotutils$.hasActiveSession);

	const modAssignments2: CharacterModdings = modAssignments
		.filter((x) => null !== x)
		.map(
			({
				characterId,
				target,
				assignedMods,
				missedGoals,
				currentScore,
				previousScore,
			}) => ({
				characterId,
				target,
				assignedMods: assignedMods
					? assignedMods.map((id) => modById.get(id)).filter((mod) => !!mod)
					: [],
				missedGoals: missedGoals || [],
				currentScore,
				previousScore,
			}),
		) as CharacterModdings;

	const movingModsByAssignedCharacter: CharacterModdings = modAssignments2
		.map(
			({ characterId, target, assignedMods, currentScore, previousScore }) => ({
				characterId,
				target,
				assignedMods: assignedMods.filter(
					(mod) => mod.characterID !== characterId,
				),
				missedGoals: [],
				currentScore,
				previousScore,
			}),
		)
		.filter(({ assignedMods }) => assignedMods.length);

	return (
		<div className="flex flex-wrap gap-4">
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-2">
					<Button
						type={"button"}
						size={"sm"}
						onClick={() =>
							dialog$.show({
								content: (
									<TextualReview
										modAssignments={movingModsByAssignedCharacter}
									/>
								),
							})
						}
					>
						{t("review.actions.ShowSummary")}
					</Button>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="">{t("review.actions.Reason")}</Label>
					<Button
						type={"button"}
						onClick={() => optimizerView$.view.set("basic")}
					>
						{t("review.actions.Back")}
					</Button>
				</div>
			</div>
			<div id={`Hotutils-Actions-${actionsId}`} className="flex flex-col gap-2">
				<Label htmlFor={`Hotutils-Actions-${actionsId}`}>HotUtils</Label>
				<Button
					type={"button"}
					disabled={!hasActiveSession}
					onClick={() => dialog$.show({ content: <CreateProfileModal /> })}
				>
					{t("review.actions.Create")}
				</Button>
				<Button
					type={"button"}
					disabled={!hasActiveSession}
					onClick={() => dialog$.show({ content: <MoveModsModal /> })}
				>
					{t("review.actions.Move")}
				</Button>
			</div>
		</div>
	);
};

ActionsWidget.displayName = "ActionsWidget";

export default ActionsWidget;
