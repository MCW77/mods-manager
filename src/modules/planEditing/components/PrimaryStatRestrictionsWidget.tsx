// state
import { reactive, reactiveObserver } from "@legendapp/state/react";
import { target$ } from "#/modules/planEditing/state/planEditing";

// domain
import type { PrimaryStats } from "#/domain/Stats";

// components
import { ToggleGroup, ToggleGroupItem } from "#ui/toggle-group";

const ReactiveToggleGroup = reactive(ToggleGroup);

const PrimaryStatRestrictionsWidget: React.FC = reactiveObserver(() => {
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
          bg-[url(/img/mod-shape-atlas.png)]
          bg-[length:48em_20em] [background-position-x:-4em]
        `}
					/>
					<ReactiveToggleGroup
						className={
							"h-6 gap-1 border-1 border-gray-300 dark:border-gray-700 rounded-2xl"
						}
						orientation={"horizontal"}
						type={"single"}
						$value={() =>
							target$.target.primaryStatRestrictions.arrow.get() ?? ""
						}
						onValueChange={(value) => {
							if (value === "")
								target$.target.primaryStatRestrictions.arrow.delete();
							else
								target$.target.primaryStatRestrictions.arrow.set(
									value as PrimaryStats.GIMOStatNames,
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
          bg-[url(/img/mod-shape-atlas.png)]
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
						$value={() =>
							target$.target.primaryStatRestrictions.triangle.get() ?? ""
						}
						onValueChange={(value) => {
							if (value === "")
								target$.target.primaryStatRestrictions.triangle.delete();
							else
								target$.target.primaryStatRestrictions.triangle.set(
									value as PrimaryStats.GIMOStatNames,
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
            bg-[url(/img/mod-shape-atlas.png)]
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
						$value={() =>
							target$.target.primaryStatRestrictions.cross.get() ?? ""
						}
						onValueChange={(value) => {
							if (value === "")
								target$.target.primaryStatRestrictions.cross.delete();
							else
								target$.target.primaryStatRestrictions.cross.set(
									value as PrimaryStats.GIMOStatNames,
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
            bg-[url(/img/mod-shape-atlas.png)]
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
						$value={() =>
							target$.target.primaryStatRestrictions.circle.get() ?? ""
						}
						onValueChange={(value) => {
							if (value === "")
								target$.target.primaryStatRestrictions.circle.delete();
							else
								target$.target.primaryStatRestrictions.circle.set(
									value as PrimaryStats.GIMOStatNames,
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
