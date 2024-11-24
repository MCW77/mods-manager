// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const modsView$ = stateLoader$.modsView$;

// domain
import type { SetSettings, TriState } from "../../domain/ModsViewOptions";

// components
import { SetAllButtonGroup } from "../SetAllButtonGroup";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const imageOffsets: Record<keyof SetSettings, Record<TriState, string>> = {
	"Health %": {
		"-1": "bg-[position:0em_-2.5em]",
		"0": "bg-[position:0em_0em]",
		"1": "bg-[position:0em_0em]",
	},
	"Offense %": {
		"-1": "bg-[position:-2.5em_-2.5em]",
		"0": "bg-[position:-2.5em_0em]",
		"1": "bg-[position:-2.5em_0em]",
	},
	"Defense %": {
		"-1": "bg-[position:-5em_-2.5em]",
		"0": "bg-[position:-5em_0em]",
		"1": "bg-[position:-5em_0em]",
	},
	"Speed %": {
		"-1": "bg-[position:-7.5em_-2.5em]",
		"0": "bg-[position:-7.5em_0em]",
		"1": "bg-[position:-7.5em_0em]",
	},
	"Critical Chance %": {
		"-1": "bg-[position:-10em_-2.5em]",
		"0": "bg-[position:-10em_0em]",
		"1": "bg-[position:-10em_0em]",
	},
	"Critical Damage %": {
		"-1": "bg-[position:-12.5em_-2.5em]",
		"0": "bg-[position:-12.5em_0em]",
		"1": "bg-[position:-12.5em_0em]",
	},
	"Potency %": {
		"-1": "bg-[position:-15em_-2.5em]",
		"0": "bg-[position:-15em_0em]",
		"1": "bg-[position:-15em_0em]",
	},
	"Tenacity %": {
		"-1": "bg-[position:-17.5em_-2.5em]",
		"0": "bg-[position:-17.5em_0em]",
		"1": "bg-[position:-17.5em_0em]",
	},
};

const SetFilter = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
		const setConfig: SetSettings = modsView$.activeFilter.modset.get();

		return (
			<div className={"w-24 flex flex-col gap-2 items-center"}>
				<Label className="p-r-2" htmlFor={"set-filter1"}>
					Set
				</Label>
				<div
					id={"set-filter1"}
					className="flex flex-row justify-center flex-wrap"
				>
					{Object.keys(setConfig).map((set: keyof SetSettings) => {
						const inputName = `set-filter-${set}`;
						const value = setConfig[set] || 0;
						const setCSS = `w-[2.9em] h-[2.9em] p-[.2em] bg-origin-content bg-clip-content bg-[url('/img/icon-buffs.webp')] bg-[length:20em_5em] ${imageOffsets[set][value]} bg-no-repeat`;
						const stateCSS = value === 0 ? "opacity-50" : "opacity-100";
						const className = `${setCSS} ${stateCSS}`;

						return (
							<Button
								className={className}
								key={inputName}
								variant={"ghost"}
								onClick={() => modsView$.cycleState("modset", set.toString())}
							>
								{" "}
							</Button>
						);
					})}
				</div>
				<SetAllButtonGroup filterKey="modset" />
			</div>
		);
	}),
);

SetFilter.displayName = "SetFilter";

export { SetFilter };
