// react
import { useDispatch, useSelector } from "react-redux";

// state
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";
import { Data } from "#/state/modules/data";
import { Optimize } from "#/state/modules/optimize";
import { Review } from "#/state/modules/review";
import { Storage } from "#/state/modules/storage";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

// component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowsRotate,
	faGears,
	faLock,
	faUnlock,
} from "@fortawesome/free-solid-svg-icons";

import { ResetAllCharacterTargetsModal } from "./ResetAllCharacterTargetsModal";

import { OptimizerProgress } from "#/components/OptimizerProgress/OptimizerProgress";

import { HelpLink } from "#/modules/help/components/HelpLink";
import { SettingsLink } from "#/modules/settings/components/SettingsLink";

import { Button } from "#ui/button";

const CharacterActions = () => {
	const dispatch: ThunkDispatch = useDispatch();
	const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);
	const selectedCharacters = useSelector(
		CharacterEdit.selectors.selectSelectedCharactersInActiveProfile,
	);
	const modAssignments = useSelector(
		Storage.selectors.selectModAssignmentsInActiveProfile,
	);

	return (
		<div className={"flex gap-2"}>
			<Button
				type="button"
				onClick={() => {
					incrementalOptimization$.indicesByProfile[
						profilesManagement$.profiles.activeAllycode.get()
					].set(null);

					type IndexOfCharacters = { [id in CharacterNames]: number };
					const minCharacterIndices: IndexOfCharacters =
						selectedCharacters.reduce(
							(indices, { id }, charIndex) => {
								indices[id] = charIndex;
								return indices;
							},
							{ [selectedCharacters[0].id]: 0 },
						) as IndexOfCharacters;

					const invalidTargets = selectedCharacters
						.filter(({ target }, index) =>
							target.targetStats.find(
								(targetStat) =>
									targetStat.relativeCharacterId !== "null" &&
									minCharacterIndices[targetStat.relativeCharacterId] > index,
							),
						)
						.map(({ id }) => id);

					if (invalidTargets.length > 0) {
						dialog$.showError(
							"Didn't optimize your selected charcters!",
							<div>
								<p>You have invalid targets set!</p>,
								<p>
									For relative targets, the character compared to MUST be
									earlier in the selected characters list. The following
									characters don't follow this rule:
								</p>
								,
								<ul>
									{invalidTargets.map((id) => (
										<li key={id}>{baseCharacters[id]?.name ?? id}</li>
									))}
								</ul>
							</div>,
							"Just move the characters to the correct order and try again!",
						);
					} else {
						dialog$.show(<OptimizerProgress />, true);
						isBusy$.set(true);
						dispatch(Optimize.thunks.optimizeMods());
					}
				}}
				disabled={selectedCharacters.length === 0}
			>
				<span className="fa-layers">
					<FontAwesomeIcon
						icon={faArrowsRotate}
						title="Optimize"
						transform="grow-8"
					/>
					<FontAwesomeIcon icon={faGears} size="xs" transform="shrink-6" />
				</span>
			</Button>
			{modAssignments.length > 0 ? (
				<Button
					type={"button"}
					onClick={() => {
						dispatch(
							Review.thunks.updateModListFilter({
								view: "sets",
								sort: "assignedCharacter",
							}),
						);
						optimizerView$.view.set("review");
					}}
				>
					Review recommendations
				</Button>
			) : null}
			<Button
				type="button"
				size="icon"
				onClick={() => dispatch(CharacterEdit.thunks.lockAllCharacters())}
			>
				<FontAwesomeIcon icon={faLock} title="Lock All" />
			</Button>
			<Button
				type="button"
				size="icon"
				onClick={() => dispatch(CharacterEdit.thunks.unlockAllCharacters())}
			>
				<FontAwesomeIcon icon={faUnlock} title="Unlock All" />
			</Button>
			<Button
				type="button"
				onClick={() => dialog$.show(<ResetAllCharacterTargetsModal />)}
			>
				Reset all targets
			</Button>
			<HelpLink
				title="Global Settings Helppage"
				section="optimizer"
				topic={1}
			/>
			<SettingsLink title="Global Settings" section="optimizer" />
		</div>
	);
};

CharacterActions.displayName = "CharacterActions";

export { CharacterActions };
