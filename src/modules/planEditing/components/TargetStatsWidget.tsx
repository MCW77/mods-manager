// react
import { lazy, useMemo } from "react";
import { Computed, For, reactiveObserver, Show, use$ } from "@legendapp/state/react";

// utils
import { objectEntries } from "#/utils/objectEntries";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const characters$ = stateLoader$.characters$;

import { target$ } from "../state/planEditing";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

// components
const TargetStatWidget = lazy(() => import("./TargetStatWidget"));
import { Button } from "#ui/button";
import { Card } from "#ui/card";

const TargetStatsWidget: React.FC = reactiveObserver(() => {
	const baseCharacterById = use$(characters$.baseCharacterById);
	const hasTargetStats = use$(() => target$.target.targetStats.length > 0);

	const groups = useMemo(() => {
		const baseCharactersLabelValue = Object.values(baseCharacterById)
			.map(
				(bc) =>
					({
						label: bc.name,
						value: bc.id,
					}) as { label: string; value: CharacterNames | "null" },
			)
			.sort((a, b) => a.label.localeCompare(b.label));
		baseCharactersLabelValue.unshift({ label: "None", value: "null" });
		const charactersGroupedByFirstLetter = Object.groupBy(
			baseCharactersLabelValue,
			(bc) => {
				if (bc.label === "None" || bc.label.length === 0) return "#";
				if (bc.label[0] >= "0" && bc.label[0] <= "9") return "#";
				return bc.label[0] ?? "#";
			},
		);
		const result = objectEntries(charactersGroupedByFirstLetter).map(
			(group) => {
				return {
					label: group[0],
					items: group[1] ?? [],
				};
			},
		);
		return result;
	}, [baseCharacterById]);

	return (
		<div>
			<Computed>
				<div className="flex flex-wrap gap-2">
					<Card className={"flex items-center justify-center aspect-square"}>
						<Button
							type={"button"}
							size={"lg"}
							variant={"outline"}
							onClick={() => {
								target$.addTargetStat();
							}}
						>
							+
						</Button>
					</Card>
					<Show if={hasTargetStats}>
						<For each={target$.target.targetStats}>
							{(targetStat$) => (
								<TargetStatWidget
									target$={target$}
									id={targetStat$.peek().id}
									key={targetStat$.id.peek()}
									baseCharacters={groups}
								/>
							)}
						</For>
					</Show>
				</div>
			</Computed>
		</div>
	);
});

TargetStatsWidget.displayName = "TargetStatsWidget";

export default TargetStatsWidget;
