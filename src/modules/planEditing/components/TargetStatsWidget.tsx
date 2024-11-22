// react
import { useMemo } from "react";
import { Computed, reactiveObserver } from "@legendapp/state/react";

// utils
import { objectEntries } from "#/utils/objectEntries";

// state
const { characters$ } = await import("#/modules/characters/state/characters");

import { target$ } from "../state/planEditing";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

// components
import { TargetStatWidget } from "./TargetStatWidget";
import { Button } from "#ui/button";
import { Card } from "#ui/card";

const TargetStatsWidget: React.FC = reactiveObserver(() => {
	const baseCharacterById = characters$.baseCharacterById.get();

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
				{() => (
					<div className="flex flex-wrap gap-2">
						<Card className={"flex items-center justify-center aspect-square"}>
							<Button
								type={"button"}
								size={"lg"}
								variant={"outline"}
								onClick={() => {
									target$.addTargetStat();
									/*
                target$.target.targetStats.set(
                  [...target$.target.targetStats.peek(), createTargetStat('Speed')]
                )
*/
								}}
							>
								+
							</Button>
						</Card>
						{target$.target.targetStats.get() &&
							target$.target.targetStats.map((targetStat$) => {
								return (
									<TargetStatWidget
										target$={target$}
										id={targetStat$.peek().id}
										key={targetStat$.id.peek()}
										baseCharacters={groups}
									/>
								);
							})}
					</div>
				)}
			</Computed>
		</div>
	);
});

TargetStatsWidget.displayName = "TargetStatsWidget";

export { TargetStatsWidget };

/*<Memo key={id}>
                {() =>*/
//}
//                </Memo>
/*
    <For each={targetStats$}>
      {(item as Observable<TargetStat2>) => {
        const id = item.peek()!.id;
        return item.peek() !== undefined ? <TargetStatWidget targetStat$={item} targetStats={targetStats$} id={id} baseCharacters={baseCharacters2}></TargetStatWidget> : <></>
      }}
    </For>
*/
