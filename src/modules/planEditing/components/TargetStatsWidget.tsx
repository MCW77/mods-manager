// react
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Computed, reactiveObserver } from "@legendapp/state/react";

// state
import { target$ } from "../state/planEditing";

// modules
import { Data } from "#/state/modules/data";

// domain
import type { BaseCharacters } from "#/domain/BaseCharacter";

// components
import { TargetStatWidget } from "./TargetStatWidget";

import { Button } from "#ui/button";
import { Card } from "#ui/card";

const TargetStatsWidget = reactiveObserver(() => {
	const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);

	const baseCharacters2 = useMemo(
		() =>
			(Object.values(baseCharacters).slice(0) as BaseCharacters).sort((a, b) =>
				a.name.localeCompare(b.name),
			),
		[baseCharacters],
	);

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
										baseCharacters={baseCharacters2}
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
