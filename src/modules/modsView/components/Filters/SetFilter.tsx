// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, useValue } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import {
	type SetSettingsSets,
	setSettingsSets,
	type TriState,
} from "../../domain/ModsViewOptions";

// components
const SetAllButtonGroup = lazy(() => import("../SetAllButtonGroup"));
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const imageOffsets: Record<SetSettingsSets, Record<TriState, string>> = {
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

function SetButton({ set }: { set: SetSettingsSets }) {
	const setState = useValue(() => {
		const activeFilter = modsView$.activeFilter.get();
		return activeFilter.modset[set];
	});
	const value = setState || 0;
	const setCSS = `w-[2.9em] h-[2.9em] pt-0 pr-[.2em] pb-[.2em] pl-.5 bg-origin-content bg-clip-content bg-[url('/img/icon-buffs.webp')] bg-[length:20em_5em] ${imageOffsets[set][value]} bg-no-repeat`;
	const stateCSS = value === 0 ? "opacity-50" : "opacity-100";
	const className = `${setCSS} ${stateCSS}`;

	return (
		<Button
			className={className}
			variant={"ghost"}
			onClick={() => modsView$.cycleState("modset", set.toString())}
		>
			{" "}
		</Button>
	);
}

const SetFilter = () => {
	const [t] = useTranslation("explore-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"set-filter1"}>
				{t("filter.SetHeadline")}
			</Label>
			<div
				id={"set-filter1"}
				className="flex flex-row justify-center flex-wrap"
			>
				{setSettingsSets.map((set: SetSettingsSets) => {
					const inputName = `set-filter-${set}`;

					return <Memo key={inputName}>{() => <SetButton set={set} />}</Memo>;
				})}
			</div>
			<SetAllButtonGroup filterKey="modset" />
		</div>
	);
};

SetFilter.displayName = "SetFilter";

export default SetFilter;
