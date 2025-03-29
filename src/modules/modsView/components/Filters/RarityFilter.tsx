// react
import { useTranslation } from "react-i18next";

// state
import { Memo, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import {
	type RaritySettingsRarities,
	raritySettingsRarities,
} from "../../domain/ModsViewOptions";

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const RarityFilter = () => {
	const [t] = useTranslation("global-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"rarity-filter1"}>
				Rarity
			</Label>
			<div
				id={"rarity-filter1"}
				className="flex flex-col gap-2 justify-center flex-wrap"
			>
				{raritySettingsRarities.map((rarity: RaritySettingsRarities) => {
					const inputName = `rarity-filter-${rarity}`;

					return (
						<Memo key={inputName}>
							{() => {
								const rarityState = use$(() => {
									const activeFilter = modsView$.activeFilter.get();
									return activeFilter.rarity[rarity];
								});
								const value = rarityState || 0;
								const className =
									value === 1
										? "border-inset bg-[#000040]/100"
										: value === -1
											? "border-inset bg-[#400000]/100 border-[#800000]/100 text-red-500"
											: "text-slate-400";

								return (
									<Button
										className={className}
										size="xs"
										variant={"outline"}
										onClick={() =>
											modsView$.cycleState("rarity", rarity.toString())
										}
									>
										{"•".repeat(Number(rarity))}
									</Button>
								);
							}}
						</Memo>
					);
				})}
			</div>
		</div>
	);
};

RarityFilter.displayName = "RarityFilter";

export default RarityFilter;
