// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import type { RaritySettings } from "../../domain/ModsViewOptions";

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const RarityFilter = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
		const rarityConfig: RaritySettings = modsView$.activeFilter.rarity.get();

		return (
			<div className={"w-24 flex flex-col gap-2 items-center"}>
				<Label className="p-r-2" htmlFor={"rarity-filter1"}>
					Rarity
				</Label>
				<div
					id={"rarity-filter1"}
					className="flex flex-col gap-2 justify-center flex-wrap"
				>
					{Object.keys(rarityConfig).map((rarity: keyof RaritySettings) => {
						const inputName = `rarity-filter-${rarity}`;
						const value = rarityConfig[rarity] || 0;
						const className =
							value === 1
								? "border-inset bg-[#000040]/100"
								: value === -1
									? "border-inset bg-[#400000]/100 border-[#800000]/100 text-red-500"
									: "text-slate-400";

						return (
							<Button
								className={className}
								key={inputName}
								size="xs"
								variant={"outline"}
								onClick={() =>
									modsView$.cycleState("rarity", rarity.toString())
								}
							>
								{"•".repeat(Number(rarity))}
							</Button>
						);
					})}
				</div>
			</div>
		);
	}),
);

RarityFilter.displayName = "RarityFilter";

export default RarityFilter;
