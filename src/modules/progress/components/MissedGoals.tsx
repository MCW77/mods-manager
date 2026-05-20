// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;

//domain
import type { BaseCharacter } from "#/modules/characters/domain/BaseCharacter";
import type { FlatCharacterModding } from "#/modules/compilations/domain/CharacterModdings";

import { createCharacter } from "#/domain/Character";

// component
import CharacterAvatar from "#/components/CharacterAvatar/CharacterAvatar";
import { DialogClose } from "#/components/custom/dialog";
import { ScrollArea } from "#/components/custom/ScrollArea";

import { Button } from "#ui/button";

type MissedGoalsProps = {
	flatCharacterModdings: FlatCharacterModding[];
	baseCharacterById: Record<string, BaseCharacter>;
};
function MissedGoals({
	baseCharacterById,
	flatCharacterModdings,
}: MissedGoalsProps) {
	return (
		<div className="h-[70vh]">
			<div className={"flex flex-col flex-gap-2 min-h-0 h-full"}>
				<h3 className={"text-center flex-none"}>
					Important messages regarding your selected targets
				</h3>
				<div className="flex flex-col min-h-0 h-full items-center justify-center px-4 md:px-6">
					<div className="flex flex-col h-full min-h-0 w-full max-w-4xl border rounded-lg">
						<div className="flex-none grid w-full grid-cols-[1fr_1fr] border-b">
							<div className="grid gap-1 p-4">
								<div className="text-sm font-medium tracking-wide">
									Character
								</div>
							</div>
							<div className="grid gap-1 p-4">
								<div className="text-sm font-medium tracking-wide">
									Messages
								</div>
							</div>
						</div>
						<ScrollArea className="flex-auto min-h-0">
							<div className="grid w-full grid-cols-[1fr_1fr]">
								{flatCharacterModdings.map(
									(
										{ characterId: id, target, messages, missedGoals },
										index,
									) => {
										const tempStats = {
											Health: 0,
											Protection: 0,
											Speed: 0,
											"Critical Damage %": 0,
											"Potency %": 0,
											"Tenacity %": 0,
											"Physical Damage": 0,
											"Special Damage": 0,
											Armor: 0,
											Resistance: 0,
											"Accuracy %": 0,
											"Critical Avoidance %": 0,
											"Physical Critical Chance %": 0,
											"Special Critical Chance %": 0,
										};
										const character =
											profilesManagement$.activeProfile.characterById[
												id
											].peek() ||
											createCharacter(
												id,
												{
													level: 0,
													stars: 0,
													gearLevel: 0,
													gearPieces: [],
													galacticPower: 0,
													baseStats: tempStats,
													equippedStats: tempStats,
													relicTier: 0,
												},
												[],
												[],
												[],
											);

										return index % 2 === 0 ? (
											<div key={`${id}-Avatar`} className="grid gap-1 p-4">
												<CharacterAvatar
													character={character}
													displayBadges={false}
													displayStars={false}
												/>
												<br />
												{baseCharacterById[id]
													? baseCharacterById[id].name
													: id}
											</div>
										) : (
											<div key={`${id}-Messages`} className="grid gap-1 p-4">
												<h4>{target.id}:</h4>
												<ul>
													{messages?.map((message) => (
														<li key={message}>{message}</li>
													))}
												</ul>
												<ul className={"text-red-600"}>
													{missedGoals.map(([missedGoal, value]) => (
														<li key={missedGoal.id}>
															{`Missed goal stat for ${
																missedGoal.stat
															}. Value of ${
																value % 1 ? value.toFixed(2) : value
															} was not between ${
																missedGoal.minimum
															} and ${missedGoal.maximum}.`}
														</li>
													))}
												</ul>
											</div>
										);
									},
								)}
							</div>
						</ScrollArea>
					</div>
				</div>
				<div className={"flex flex-none justify-center"}>
					<DialogClose asChild>
						<Button>Close</Button>
					</DialogClose>
				</div>
			</div>
		</div>
	);
}

export { MissedGoals };
