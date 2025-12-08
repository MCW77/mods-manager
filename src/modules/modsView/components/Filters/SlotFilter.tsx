// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, useValue } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const modsView$ = stateLoader$.modsView$;

// domain
import {
	type SlotSettingsSlots,
	slotSettingsSlots,
	type TriState,
} from "../../domain/ModsViewOptions.js";

// components
const SetAllButtonGroup = lazy(() => import("../SetAllButtonGroup.jsx"));
import { Button } from "#ui/button.jsx";
import { Label } from "#ui/label.jsx";

const imageOffsets: Record<SlotSettingsSlots, Record<TriState, string>> = {
	square: {
		"-1": "bg-[position:0em_-2.5em]",
		"0": "bg-[position:0em_0em]",
		"1": "bg-[position:0em_0em]",
	},
	arrow: {
		"-1": "bg-[position:-2.5em_-2.5em]",
		"0": "bg-[position:-2.5em_0em]",
		"1": "bg-[position:-2.5em_0em]",
	},
	diamond: {
		"-1": "bg-[position:-5em_-2.5em]",
		"0": "bg-[position:-5em_0em]",
		"1": "bg-[position:-5em_0em]",
	},
	triangle: {
		"-1": "bg-[position:-7.5em_-2.5em]",
		"0": "bg-[position:-7.5em_0em]",
		"1": "bg-[position:-7.5em_0em]",
	},
	circle: {
		"-1": "bg-[position:-10em_-2.5em]",
		"0": "bg-[position:-10em_0em]",
		"1": "bg-[position:-10em_0em]",
	},
	cross: {
		"-1": "bg-[position:-12.5em_-2.5em]",
		"0": "bg-[position:-12.5em_0em]",
		"1": "bg-[position:-12.5em_0em]",
	},
};

function SlotButton({ slot }: { slot: SlotSettingsSlots }) {
	const slotState = useValue(() => {
		const activeFilter = modsView$.activeFilter.get();
		return activeFilter.slot[slot];
	});
	const value = slotState || 0;
	const slotCSS = `size-[2.9em] pt-0 pr-[.2em] pb-[.2em] pl-.5 bg-origin-content bg-clip-content bg-[url('/img/empty-mod-shapes.webp')] bg-[length:15em_5em] ${imageOffsets[slot][value]} bg-no-repeat`;
	const stateCSS = value === 0 ? "opacity-50" : "opacity-100";
	const className = `${slotCSS} ${stateCSS}`;

	return (
		<Button
			className={className}
			variant={"ghost"}
			onClick={() => modsView$.cycleState("slot", slot.toString())}
		>
			{" "}
		</Button>
	);
}

const SlotFilter = () => {
	const [t] = useTranslation("explore-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"slot-filter1"}>
				{t("filter.SlotHeadline")}
			</Label>
			<div
				id={"slot-filter1"}
				className="flex flex-row flex-wrap justify-center"
			>
				{slotSettingsSlots.map((slot: SlotSettingsSlots) => {
					const inputName = `slot-filter-${slot}`;

					return (
						<Memo key={inputName}>{() => <SlotButton slot={slot} />}</Memo>
					);
				})}
			</div>
			<SetAllButtonGroup filterKey="slot" />
		</div>
	);
};

SlotFilter.displayName = "SlotFilter";

export default SlotFilter;
