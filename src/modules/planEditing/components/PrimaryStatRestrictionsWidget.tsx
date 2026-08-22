// react
import { useTranslation } from "react-i18next";

// state
import { reactiveObserver } from "@legendapp/state/react";

import { target$ } from "#/modules/planEditing/state/planEditing";

// domain
import type {
	ArrowPrimaryStats,
	CirclePrimaryStats,
	CrossPrimaryStats,
	TrianglePrimaryStats,
} from "#/domain/GIMOStatNames";

// components
import { ToggleGroupItem } from "#ui/toggle-group";
import { ToggleGroup as ReactiveToggleGroup } from "#/components/reactive/ToggleGroup";

const PrimaryStatRestrictionsWidget: React.FC = reactiveObserver(() => {
	const [t] = useTranslation("domain");
	const [tOptimize] = useTranslation("optimize-ui");

	return (
		<div className="grid gap-4">
			<div className={""}>
				<h1>{tOptimize("target.sections.primaries.Heading")}</h1>
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
						multiple={true}
						$value={target$.target.primaryStatRestrictions.arrow}
						onValueChange={(value) => {
							if (value === undefined)
								target$.target.primaryStatRestrictions.arrow.delete();
							else
								target$.target.primaryStatRestrictions.arrow.set(
									value as ArrowPrimaryStats,
								);
						}}
					>
						<ToggleGroupItem className={"h-6"} value={"Protection %"}>
							{t("stats.Protection")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Health %"}>
							{t("stats.Health")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Offense %"}>
							{t("stats.Offense")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Defense %"}>
							{t("stats.Defense")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Speed"}>
							{t("stats.Speed")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Accuracy %"}>
							{t("stats.Accuracy")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Critical Avoidance %"}>
							{t("stats.Critical Avoidance")}
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
						multiple={true}
						$value={target$.target.primaryStatRestrictions.triangle}
						onValueChange={(value) => {
							if (value === undefined)
								target$.target.primaryStatRestrictions.triangle.delete();
							else
								target$.target.primaryStatRestrictions.triangle.set(
									value as TrianglePrimaryStats,
								);
						}}
					>
						<ToggleGroupItem className={"h-6"} value={"Protection %"}>
							{t("stats.Protection")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Health %"}>
							{t("stats.Health")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Offense %"}>
							{t("stats.Offense")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Defense %"}>
							{t("stats.Defense")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Critical Chance %"}>
							{t("stats.Critical Chance")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Critical Damage %"}>
							{t("stats.Critical Damage")}
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
						multiple={true}
						$value={target$.target.primaryStatRestrictions.cross}
						onValueChange={(value) => {
							if (value === undefined)
								target$.target.primaryStatRestrictions.cross.delete();
							else
								target$.target.primaryStatRestrictions.cross.set(
									value as CrossPrimaryStats,
								);
						}}
					>
						<ToggleGroupItem className={"h-6"} value={"Protection %"}>
							{t("stats.Protection")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Health %"}>
							{t("stats.Health")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Offense %"}>
							{t("stats.Offense")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Defense %"}>
							{t("stats.Defense")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Potency %"}>
							{t("stats.Potency")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Tenacity %"}>
							{t("stats.Tenacity")}
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
						multiple={true}
						$value={target$.target.primaryStatRestrictions.circle}
						onValueChange={(value) => {
							if (value === undefined)
								target$.target.primaryStatRestrictions.circle.delete();
							else
								target$.target.primaryStatRestrictions.circle.set(
									value as CirclePrimaryStats,
								);
						}}
					>
						<ToggleGroupItem className={"h-6"} value={"Protection %"}>
							{t("stats.Protection")}
						</ToggleGroupItem>
						<ToggleGroupItem className={"h-6"} value={"Health %"}>
							{t("stats.Health")}
						</ToggleGroupItem>
					</ReactiveToggleGroup>
				</div>
			</div>
		</div>
	);
});

PrimaryStatRestrictionsWidget.displayName = "PrimaryStatRestrictionsWidget";

export { PrimaryStatRestrictionsWidget };
