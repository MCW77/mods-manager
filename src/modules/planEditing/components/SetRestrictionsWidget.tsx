// state
import { reactive, reactiveObserver, Show, use$ } from "@legendapp/state/react";
import { computed } from "@legendapp/state";

import { target$ } from "#/modules/planEditing/state/planEditing";

// domain
import setBonuses from "#/constants/setbonuses";

import type SetBonus from "#/domain/SetBonus";
import type { GIMOSetStatNames } from "#/domain/GIMOStatNames";

// components
import { Input } from "#ui/input";
import { Label } from "#ui/label";

const ReactiveInput = reactive(Input);

interface SetItem {
	setName: GIMOSetStatNames;
	key: string;
}

const SetRestrictionsWidget: React.FC = reactiveObserver(() => {
	const setRestrictions = use$(target$.target.setRestrictions);

	const selectedSets$ = computed(() => {
		const selectedSets: SetItem[] = [];
		for (const [setName, count] of Object.entries(setRestrictions)) {
			for (let i = 0; i < count; i++) {
				selectedSets.push({
					setName: setName as GIMOSetStatNames,
					key: `${setName}${i}`,
				});
			}
		}
		return selectedSets;
	});
	selectedSets$.onChange((value) =>
		console.log("selectedSets: ", value ?? typeof value),
	);

	const emptySlots$ = computed(
		() =>
			3 -
			selectedSets$
				.get()
				.reduce(
					(acc, setData) =>
						acc + setBonuses[setData.setName].numberOfModsRequired / 2,
					0,
				),
	);
	const emptySlots = use$(emptySlots$);
	const selectedSets = use$(selectedSets$);

	const setBonusToFormDisplay = (setBonus: SetBonus, index: number) => {
		const className =
			setBonus.numberOfModsRequired > 2 * emptySlots$.get() ? "disabled" : "";
		const setBonusName = setBonus.name.replace(/\s|%/g, "").toLowerCase();
		return (
			<img
				src={`/img/icon_buff_${setBonusName}.webp`}
				alt={setBonus.name}
				key={index}
				className={className}
				onClick={() => target$.addSetBonus(setBonus.name)}
				onKeyUp={(e) => e.key === "Enter" && target$.addSetBonus(setBonus.name)}
			/>
		);
	};

	const setBonusGroups = [
		Object.values(setBonuses).filter(
			(setBonus) => setBonus.numberOfModsRequired === 2,
		),
		Object.values(setBonuses).filter(
			(setBonus) => setBonus.numberOfModsRequired === 4,
		),
	];
	const setBonusGroupsDisplay = setBonusGroups.map((setBonuses) =>
		setBonuses.map(setBonusToFormDisplay),
	);
	const setBonusDisplay = setBonusGroupsDisplay.map((groupDisplay, index) => (
		<div className="flex flex-row gap-4" key={`group-${index + 1}`}>
			{groupDisplay}
		</div>
	));

	return (
		<div className={""}>
			<h4>Restrict Set Bonuses:</h4>
			<div className={"flex flex-col gap-4"}>
				<div className={"flex gap-2"}>
					<Label htmlFor={"use-full-sets"}>Don't break mod sets</Label>
					<ReactiveInput
						className={"w-auto h-auto"}
						id={"use-full-sets"}
						type={"checkbox"}
						$checked={target$.target.useOnlyFullSets}
						onChange={(e) =>
							target$.target.useOnlyFullSets.set(e.target.checked)
						}
					/>
				</div>
				<p className={""}>
					Click on a set bonus to add it to or remove it from the selected sets.
				</p>
				<div className={"flex flex-col gap-4"}>{setBonusDisplay}</div>
				<div className={"selected-sets"}>
					<p>Selected Sets:</p>
					<div className="flex gap-2 min-h-[5rem]">
						{selectedSets.map(({ setName, key }, index) => (
							<img
								src={`/img/icon_buff_${setName
									.replace(/\s|%/g, "")
									.toLowerCase()}.webp`}
								alt={setName}
								key={key}
								onClick={() => target$.removeSetBonus(setName)}
								onKeyUp={(e) =>
									e.key === "Enter" && target$.removeSetBonus(setName)
								}
							/>
						))}
						<Show if={() => emptySlots > 0}>
							<span className={"empty-set"} />
						</Show>
						<Show if={() => emptySlots > 1}>
							<span className={"empty-set"} />
						</Show>
						<Show if={() => emptySlots === 3}>
							<span className={"empty-set"} />
						</Show>
					</div>
				</div>
			</div>
		</div>
	);
});

SetRestrictionsWidget.displayName = "SetRestrictionsWidget";

export { SetRestrictionsWidget };
