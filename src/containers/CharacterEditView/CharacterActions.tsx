// react
import { useDispatch } from "react-redux";

// state
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

import { characters$ } from "#/modules/characters/state/characters";
import { dialog$ } from "#/modules/dialog/state/dialog";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { lockedStatus$ } from "#/modules/lockedStatus/state/lockedStatus";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { review$ } from "#/modules/review/state/review";

// modules
import { Optimize } from "#/state/modules/optimize";

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

import { OptimizerProgress } from "#/modules/progress/components/OptimizerProgress";

import { HelpLink } from "#/modules/help/components/HelpLink";
import { SettingsLink } from "#/modules/settings/components/SettingsLink";

import { Button } from "#ui/button";

const CharacterActions = () => {
	const dispatch: ThunkDispatch = useDispatch();
	const baseCharactersById = characters$.baseCharactersById.get();
	const selectedCharacters = profilesManagement$.activeProfile.selectedCharacters.get();
	const modAssignments = profilesManagement$.activeProfile.modAssignments.get();

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
										<li key={id}>{baseCharactersById[id]?.name ?? id}</li>
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
						review$.modListFilter.view.set("sets");
						review$.modListFilter.sort.set("assignedCharacter");
						optimizerView$.view.set("review");
					}}
				>
					Review recommendations
				</Button>
			) : null}
			<Button
				type="button"
				size="icon"
				onClick={() => {
					lockedStatus$.lockAll();
				}}
			>
				<FontAwesomeIcon icon={faLock} title="Lock All" />
			</Button>
			<Button
				type="button"
				size="icon"
				onClick={() => {
					lockedStatus$.unlockAll();
				}}
			>
				<FontAwesomeIcon icon={faUnlock} title="Unlock All" />
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
