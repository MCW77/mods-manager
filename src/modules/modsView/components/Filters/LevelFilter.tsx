// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import { getFilterSelectionStyles } from "../../domain/FilterSelectionStyles";
import {
	type LevelSettingsStringLevels,
	levelSettingsStringLevels,
} from "../../domain/ModsViewOptions";

// components
const SetAllButtonGroup = lazy(() => import("../SetAllButtonGroup"));
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const LevelFilter = () => {
	const [t] = useTranslation("explore-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"level-filter1"}>
				{t("filter.LevelHeadline")}
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
								const levelState = use$(() => {
									const activeFilter = modsView$.activeFilter.get();
									return activeFilter.level[level];
								});
								const value = levelState || 0;
								const className = getFilterSelectionStyles(value);

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
