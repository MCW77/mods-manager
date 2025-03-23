// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import {
	type LevelSettingsStringLevels,
	levelSettingsStringLevels,
} from "../../domain/ModsViewOptions";

// components
const SetAllButtonGroup = lazy(() => import("../SetAllButtonGroup"));
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const LevelFilter = () => {
	const [t] = useTranslation("global-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"level-filter1"}>
				Level
			</Label>
			<div
				id={"level-filter1"}
				className="flex flex-row gap-1 justify-center flex-wrap"
			>
				{levelSettingsStringLevels.map((level: LevelSettingsStringLevels) => {
					const inputName = `level-filter-${level}`;

					return (
						<Memo key={inputName}>
							{() => {
								const levelState = use$(modsView$.activeFilter.level[level]);
								const value = levelState || 0;
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
											modsView$.cycleState("level", level.toString())
										}
									>
										{level}
									</Button>
								);
							}}
						</Memo>
					);
				})}
			</div>
			<SetAllButtonGroup filterKey="level" />
		</div>
	);
};

LevelFilter.displayName = "LevelFilter";

export default LevelFilter;
