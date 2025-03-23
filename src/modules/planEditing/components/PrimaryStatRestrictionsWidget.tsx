// state
import { reactive, reactiveObserver, use$ } from "@legendapp/state/react";

import { target$ } from "#/modules/planEditing/state/planEditing";

// components
import { ToggleGroup, ToggleGroupItem } from "#ui/toggle-group";
import type { GIMOPrimaryStatNames } from "#/domain/GIMOStatNames";

const ReactiveToggleGroup = reactive(ToggleGroup);

const PrimaryStatRestrictionsWidget: React.FC = reactiveObserver(() => {
	const arrowsPrimaryStatRestrictions = use$(
		() => target$.target.primaryStatRestrictions.arrow.get() ?? "",
	);
	const trianglesPrimaryStatRestrictions = use$(
		() => target$.target.primaryStatRestrictions.triangle.get() ?? "",
	);
	const crossesPrimaryStatRestrictions = use$(
		() => target$.target.primaryStatRestrictions.cross.get() ?? "",
	);
	const circlesPrimaryStatRestrictions = use$(
		() => target$.target.primaryStatRestrictions.circle.get() ?? "",
	);

	return (
		<div className="grid gap-4">
			<div className={""}>
				<h1>Restrict Primary Stats:</h1>
			</div>
			<div className={"flex flex-col gap-4 p-2"}>
				<div>
					<div
						className={`
          w-[4em] h-[4em]
          bg-[url(/img/mod-shape-atlas.webp)]
          bg-[length:48em_20em] [background-position-x:-4em]
        `}
					/>
					<ReactiveToggleGroup
						className={
							"h-6 gap-1 border-1 border-gray-300 dark:border-gray-700 rounded-2xl"
						}
						orientation={"horizontal"}
						type={"single"}
						$value={arrowsPrimaryStatRestrictions}
						onValueChange={(value) => {
							if (value === "")
								target$.target.primaryStatRestrictions.arrow.delete();
							else
								target$.target.primaryStatRestrictions.arrow.set(
									value as GIMOPrimaryStatNames,
								);
						}}
					>
						<ToggleGroupItem className={"h-6"} value={"Protection %"}>
							Protection
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Health %"}>
							Health
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Offense %"}>
							Offense
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Defense %"}>
							Defense
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Speed"}>
							Speed
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Accuracy %"}>
							Accuracy
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Critical Avoidance %"}>
							Critical Avoidance
						</ToggleGroupItem>
					</ReactiveToggleGroup>
				</div>
				<div>
					<div
						className={`
          w-[4em] h-[4em]
          bg-[url(/img/mod-shape-atlas.webp)]
          bg-[length:48em_20em] [background-position-x:-12em]
        `}
					/>
					<ReactiveToggleGroup
						className={
							"h-6 gap-1 border-1 border-gray-300 dark:border-gray-700 rounded-2xl"
						}
						orientation={"horizontal"}
						size={"sm"}
						type={"single"}
						$value={trianglesPrimaryStatRestrictions}
						onValueChange={(value) => {
							if (value === "")
								target$.target.primaryStatRestrictions.triangle.delete();
							else
								target$.target.primaryStatRestrictions.triangle.set(
									value as GIMOPrimaryStatNames,
								);
						}}
					>
						<ToggleGroupItem className={"h-6"} value={"Protection %"}>
							Protection
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Health %"}>
							Health
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Offense %"}>
							Offense
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Defense %"}>
							Defense
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Critical Chance %"}>
							Critical Chance
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Critical Damage %"}>
							Critical Damage
						</ToggleGroupItem>
					</ReactiveToggleGroup>
				</div>
				<div>
					<div
						className={`
            left-[17px]
            w-[4em] h-[4em]
            bg-[url(/img/mod-shape-atlas.webp)]
            bg-[length:48em_20em]
            [background-position-x:-20em]
          `}
					/>
					<ReactiveToggleGroup
						className={
							"h-4 gap-0 border-1 border-gray-300 dark:border-gray-700 rounded-2xl"
						}
						orientation={"horizontal"}
						size={"sm"}
						type={"single"}
						$value={crossesPrimaryStatRestrictions}
						onValueChange={(value) => {
							if (value === "")
								target$.target.primaryStatRestrictions.cross.delete();
							else
								target$.target.primaryStatRestrictions.cross.set(
									value as GIMOPrimaryStatNames,
								);
						}}
					>
						<ToggleGroupItem className={"h-6"} value={"Protection %"}>
							Protection
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Health %"}>
							Health
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Offense %"}>
							Offense
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Defense %"}>
							Defense
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Potency %"}>
							Potency
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Tenacity %"}>
							Tenacity
						</ToggleGroupItem>
					</ReactiveToggleGroup>
				</div>
				<div>
					<div
						className={`
            left-[17px]
            w-[4em] h-[4em]
            bg-[url(/img/mod-shape-atlas.webp)]
            bg-[length:48em_20em]
            [background-position-x:-16em]
          `}
					/>
					<ReactiveToggleGroup
						className={
							"h-4 gap-0 border-1 border-gray-300 dark:border-gray-700 rounded-2xl"
						}
						orientation={"horizontal"}
						size={"sm"}
						type={"single"}
						$value={circlesPrimaryStatRestrictions}
						onValueChange={(value) => {
							if (value === "")
								target$.target.primaryStatRestrictions.circle.delete();
							else
								target$.target.primaryStatRestrictions.circle.set(
									value as GIMOPrimaryStatNames,
								);
						}}
					>
						<ToggleGroupItem className={"h-6"} value={"Protection %"}>
							Protection
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Health %"}>
							Health
						</ToggleGroupItem>
					</ReactiveToggleGroup>
				</div>
			</div>
		</div>
	);
});

PrimaryStatRestrictionsWidget.displayName = "PrimaryStatRestrictionsWidget";

export { PrimaryStatRestrictionsWidget };
