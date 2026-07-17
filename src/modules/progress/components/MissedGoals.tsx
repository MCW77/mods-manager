// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const roster$ = stateLoader$.roster$;

//domain
import type { BaseCharacter } from "#/modules/characters/domain/BaseCharacter";
import type { FlatCharacterModding } from "#/modules/compilations/domain/CharacterModdings";

import { createCharacter } from "#/domain/Character";

// component
import CharacterAvatar from "#/components/CharacterAvatar/CharacterAvatar";
import { ScrollArea } from "#/components/custom/ScrollArea";

import { Button } from "#ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#ui/dialog";

type MissedGoalsProps = {
	flatCharacterModdings: FlatCharacterModding[];
	baseCharacterById: Record<string, BaseCharacter>;
};
function MissedGoals({
	baseCharacterById,
	flatCharacterModdings,
}: MissedGoalsProps) {
	return (
		<>
			<DialogHeader>
				<DialogTitle>
					Important messages regarding your selected targets
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>
			<div className={"grid"}>
				<div className="flex-none grid w-full grid-cols-[1fr_1fr] border-b">
					<div className="grid gap-1 p-4">
						<div className="text-sm font-medium tracking-wide">Character</div>
					</div>
					<div className="grid gap-1 p-4">
						<div className="text-sm font-medium tracking-wide">Messages</div>
					</div>
				</div>
				<ScrollArea className="max-h-[60vh]">
					<div className="grid w-full grid-cols-[1fr_1fr]">
						{flatCharacterModdings.map(
							({ characterId: id, target, messages, missedGoals }, index) => {
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
									roster$.activeCharacterById[id].peek() ||
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
										{baseCharacterById[id] ? baseCharacterById[id].name : id}
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
													{`Missed goal stat for ${missedGoal.stat}. Value of ${
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
			<DialogFooter className="sm:justify-center">
				<DialogClose render={<Button variant="outline">Close</Button>} />
			</DialogFooter>
		</>
	);
}

export { MissedGoals };
