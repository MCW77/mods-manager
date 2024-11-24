// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import type { LevelSettings } from "../../domain/ModsViewOptions";

// components
import { SetAllButtonGroup } from "../SetAllButtonGroup";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const LevelFilter = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
		const levelConfig: LevelSettings = modsView$.activeFilter.level.get();

		return (
			<div className={"w-24 flex flex-col gap-2 items-center"}>
				<Label className="p-r-2" htmlFor={"level-filter1"}>
					Level
				</Label>
				<div
					id={"level-filter1"}
					className="flex flex-row gap-1 justify-center flex-wrap"
				>
					{Object.keys(levelConfig).map((level: keyof LevelSettings) => {
						const inputName = `level-filter-${level}`;
						const value = levelConfig[level] || 0;
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
								onClick={() => modsView$.cycleState("level", level.toString())}
							>
								{level}
							</Button>
						);
					})}
				</div>
				<SetAllButtonGroup filterKey="level" />
			</div>
		);
	}),
);

LevelFilter.displayName = "LevelFilter";

export { LevelFilter };
