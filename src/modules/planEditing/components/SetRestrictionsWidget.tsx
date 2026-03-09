// state
import { useValue } from "@legendapp/state/react";

import { target$ } from "#/modules/planEditing/state/planEditing";

// domain
import setBonuses from "#/constants/setbonuses";

import type { GIMOSetStatNames } from "#/domain/GIMOStatNames";
import type SetBonus from "#/domain/SetBonus";

// components
import { Input } from "#/components/reactive/Input";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

interface SelectedSetOccurrence {
	setName: GIMOSetStatNames;
	occurrence: number;
}

interface SetBonusButtonProps {
	emptySlots: number;
	setBonus: SetBonus;
}

interface SelectedSetButtonProps {
	setName: GIMOSetStatNames;
}

const setBonusGroups = [2, 4].map((modsRequired) => ({
	modsRequired,
	setBonuses: Object.values(setBonuses).filter(
		(setBonus) => setBonus.numberOfModsRequired === modsRequired,
	),
}));

function getSetBonusIconPath(setName: GIMOSetStatNames) {
	return `/img/icon_buff_${setName.replace(/\s|%/g, "").toLowerCase()}.webp`;
}

function getSelectedSetOccurrences(
	setRestrictions: Partial<Record<GIMOSetStatNames, number>>,
) {
	const selectedSets: SelectedSetOccurrence[] = [];

	for (const [setName, count] of Object.entries(setRestrictions)) {
		for (let occurrence = 1; occurrence <= count; occurrence++) {
			selectedSets.push({
				setName: setName as GIMOSetStatNames,
				occurrence,
			});
		}
	}

	return selectedSets;
}

function getEmptySlots(selectedSets: SelectedSetOccurrence[]) {
	const usedSlots = selectedSets.reduce(
		(totalSlots, { setName }) =>
			totalSlots + setBonuses[setName].numberOfModsRequired / 2,
		0,
	);

	return 3 - usedSlots;
}

function SetBonusButton({ emptySlots, setBonus }: SetBonusButtonProps) {
	const isDisabled = setBonus.numberOfModsRequired > 2 * emptySlots;

	return (
		<Button
			aria-label={`Add ${setBonus.name} set bonus restriction`}
			className={"h-auto w-auto p-0"}
			disabled={isDisabled}
			onClick={() => target$.addSetBonus(setBonus.name)}
			type={"button"}
			variant={"ghost"}
		>
			<img alt={setBonus.name} src={getSetBonusIconPath(setBonus.name)} />
		</Button>
	);
}

function SelectedSetButton({ setName }: SelectedSetButtonProps) {
	return (
		<Button
			aria-label={`Remove ${setName} set bonus restriction`}
			className={"h-auto w-auto p-0"}
			onClick={() => target$.removeSetBonus(setName)}
			type={"button"}
			variant={"ghost"}
		>
			<img alt={setName} src={getSetBonusIconPath(setName)} />
		</Button>
	);
}

function SetRestrictionsWidget() {
	const { emptySlots, selectedSets } = useValue(() => {
		const nextSelectedSets = getSelectedSetOccurrences(
			target$.target.setRestrictions.get(),
		);

		return {
			emptySlots: getEmptySlots(nextSelectedSets),
			selectedSets: nextSelectedSets,
		};
	});

	return (
		<div>
			<h4>Restrict Set Bonuses:</h4>
			<div className={"flex flex-col gap-4"}>
				<div className={"flex gap-2"}>
					<Label htmlFor={"use-full-sets"}>Don't break mod sets</Label>
					<Input
						className={"w-auto h-auto"}
						id={"use-full-sets"}
						type={"checkbox"}
						$value={target$.target.useOnlyFullSets}
					/>
				</div>
				<p className={""}>
					Click on a set bonus to add it to or remove it from the selected sets.
				</p>
				<div className={"flex flex-col gap-4"}>
					{setBonusGroups.map((group) => (
						<div className="flex flex-row gap-4" key={group.modsRequired}>
							{group.setBonuses.map((setBonus) => (
								<SetBonusButton
									emptySlots={emptySlots}
									key={setBonus.name}
									setBonus={setBonus}
								/>
							))}
						</div>
					))}
				</div>
				<div className={"selected-sets"}>
					<p>Selected Sets:</p>
					<div className="flex gap-2 min-h-[5rem]">
						{selectedSets.map(({ occurrence, setName }) => (
							<SelectedSetButton
								key={`${setName}-${occurrence}`}
								setName={setName}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export { SetRestrictionsWidget };
