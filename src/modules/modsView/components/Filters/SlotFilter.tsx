// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import type { SlotSettings, TriState } from "../../domain/ModsViewOptions";

// components
import { SetAllButtonGroup } from "../SetAllButtonGroup";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const imageOffsets: Record<keyof SlotSettings, Record<TriState, string>> = {
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

const SlotFilter = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
		const slotConfig: SlotSettings = modsView$.activeFilter.slot.get();

		return (
			<div className={"w-24 flex flex-col gap-2 items-center"}>
				<Label className="p-r-2" htmlFor={"slot-filter1"}>
					Slot
				</Label>
				<div
					id={"slot-filter1"}
					className="flex flex-row flex-wrap justify-center"
				>
					{Object.keys(slotConfig).map((slot: keyof SlotSettings) => {
						const inputName = `slot-filter-${slot}`;
						const value = slotConfig[slot] || 0;
						const slotCSS = `w-[2.9em] h-[2.9em] p-[.2em] bg-origin-content bg-clip-content bg-[url('/img/empty-mod-shapes.webp')] bg-[length:15em_5em] ${imageOffsets[slot][value]} bg-no-repeat`;
						const stateCSS = value === 0 ? "opacity-50" : "opacity-100";
						const className = `${slotCSS} ${stateCSS}`;

						return (
							<Button
								className={className}
								key={inputName}
								variant={"ghost"}
								onClick={() => modsView$.cycleState("slot", slot.toString())}
							>
								{" "}
							</Button>
						);
					})}
				</div>
				<SetAllButtonGroup filterKey="slot" />
			</div>
		);
	}),
);

SlotFilter.displayName = "SlotFilter";

export { SlotFilter };
