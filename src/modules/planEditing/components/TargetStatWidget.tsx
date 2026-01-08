// react
import type React from "react";
import {
	Memo,
	Switch,
	observer,
	reactive,
	useValue,
	useObservable,
} from "@legendapp/state/react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const characters$ = stateLoader$.characters$;

// domain
import type { PlanEditing } from "../domain/PlanEditing";
import { type TargetStatsNames, targetStatsNames } from "#/domain/TargetStat";

// components
import {
	type Group,
	ReactiveMultiColumnSelect,
} from "#/components/ReactiveMultiColumnSelect";
import { Input } from "#/components/reactive/Input";
import { Button } from "#ui/button";
import { Card } from "#ui/card";
import { Label } from "#ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { Switch as ShadSwitch } from "#ui/switch";
import { ToggleGroup, ToggleGroupItem } from "#ui/toggle-group";

const ReactiveSelect = reactive(Select);
const ReactiveSwitch = reactive(ShadSwitch);
const ReactiveToggleGroup = reactive(ToggleGroup);

type ComponentProps = {
	target$: PlanEditing;
	id: string;
	baseCharacters: Group[];
};

const TargetStatWidget: React.FC<ComponentProps> = observer(
	({ target$, id, baseCharacters }: ComponentProps) => {
		const targetStat$ = target$.target.targetStats.find(
			(ts) => ts.peek().id === id,
		) as NonNullable<ReturnType<typeof target$.target.targetStats.find>>;

		const type = useValue(targetStat$.type);

		const baseCharacterById$ = characters$.baseCharacterById;
		const relativeCharacterName$ = useObservable(() => {
			const relativeCharacterId = targetStat$.relativeCharacterId.get();
			if (relativeCharacterId === "null") return "";
			return baseCharacterById$[relativeCharacterId].name.get();
		});

		return (
			<Card className={"flex flex-col flex-gap-2 w-fit"}>
				<div className="flex justify-between py-4 px-6">
					<div className="flex justify-center p-2 ml-auto mr-auto">
						<Label className="p-r-2" htmlFor={`optimize-for-target${id}`}>
							Report Only
						</Label>
						<ReactiveSwitch
							$checked={targetStat$.optimizeForTarget}
							$disabled={() => targetStat$.stat.get() === "Health+Protection"}
							onCheckedChange={(checked) => {
								targetStat$.optimizeForTarget.set(checked);
							}}
							id={`optimize-for-target${id}`}
						/>
						<Label className="p-l-2" htmlFor={`optimize-for-target${id}`}>
							Optimize
						</Label>
					</div>
					<div className={"flex justify-end items-center"}>
						<Button
							className={"justify-self-stretch"}
							size={"xs"}
							type={"button"}
							variant={"destructive"}
							onClick={() => target$.removeTargetStatById(id)}
						>
							-
						</Button>
					</div>
				</div>
				<Switch value={targetStat$.relativeCharacterId}>
					{{
						null: () => (
							<Label>
								The <Memo>{targetStat$.stat}</Memo> must be between{" "}
								<Memo>{targetStat$.minimum}</Memo> and{" "}
								<Memo>{targetStat$.maximum}</Memo>
							</Label>
						),
						default: () => (
							<Switch value={targetStat$.type}>
								{{
									"+": () => (
										<div className={"flex flex-col flex-gap-1"}>
											<Label>
												The <Memo>{targetStat$.stat}</Memo> must be between{" "}
											</Label>
											<Label>
												<Memo>
													{() =>
														Intl.NumberFormat("en-US", {
															signDisplay: "exceptZero",
														}).format(targetStat$.minimum.get())
													}
												</Memo>
												{" and "}
												<Memo>
													{() =>
														Intl.NumberFormat("en-US", {
															signDisplay: "exceptZero",
														}).format(targetStat$.maximum.get())
													}
												</Memo>
												{" compared to the "}
												<Memo>{targetStat$.stat}</Memo>
												{" of "}
												<Memo>{relativeCharacterName$}</Memo>
											</Label>
										</div>
									),
									"*": () => (
										<div className={"flex flex-col flex-gap-1"}>
											<Label>
												{"The "}
												<Memo>{targetStat$.stat}</Memo>
												{" must be between"}
											</Label>
											<Label>
												<Memo>{targetStat$.minimum}</Memo>
												{"% and "}
												<Memo>{targetStat$.maximum}</Memo>
												{"% of the "}
												<Memo>{targetStat$.stat}</Memo>
												{" of "}
												<Memo>{relativeCharacterName$}</Memo>
											</Label>
										</div>
									),
								}}
							</Switch>
						),
					}}
				</Switch>
				<div className={"flex gap-4 justify-start items-center p-2"}>
					<div className="flex flex-col items-start gap-1">
						<Label className="p-r-2" htmlFor={`target-stat${id}`}>
							Stat:
						</Label>
						<ReactiveSelect
							$value={targetStat$.stat}
							onValueChange={(value) => {
								if (value === "Health+Protection") {
									targetStat$.optimizeForTarget.set(false);
								}
								targetStat$.stat.set(value as TargetStatsNames);
							}}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent position={"popper"}>
								<SelectGroup>
									{targetStatsNames.map((stat) => (
										<SelectItem key={stat} value={stat}>
											{stat}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</ReactiveSelect>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="p-r-2" htmlFor={`target-stat-min${id}`}>
							Minimum:
						</Label>
						<Input
							className={"w-24"}
							id={`target-stat-min${id}`}
							min={type === "*" ? 0 : undefined}
							type={"number"}
							$value={targetStat$.minimum}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="p-r-2" htmlFor={`target-stat-max${id}`}>
							Maximum:
						</Label>
						<Input
							className={"w-24"}
							id={`target-stat-max${id}`}
							min={type === "*" ? 0 : undefined}
							step={"any"}
							type={"number"}
							$value={targetStat$.maximum}
						/>
					</div>
				</div>
				<div className={"flex gap-4 justify-start items-start p-2"}>
					<div className="flex flex-col items-start gap-1 isolate">
						<Label
							className="p-r-2"
							htmlFor={`target-stat-relative-character${id}`}
						>
							Compare to:
						</Label>
						<ReactiveMultiColumnSelect
							groups={baseCharacters}
							selectedValue$={targetStat$.relativeCharacterId}
						/>
					</div>
					<div className="flex flex-col items-start justify-center gap-1">
						<Label className="p-r-2" htmlFor={`target-stat-type${id}`}>
							Using:
						</Label>
						<ReactiveToggleGroup
							className={
								"h-4 gap-0 border-1 border-gray-300 dark:border-gray-700 rounded-2xl"
							}
							orientation={"horizontal"}
							size={"sm"}
							type={"single"}
							variant={"outline"}
							$value={targetStat$.type}
							onValueChange={(value: "+" | "*") => {
								targetStat$.type.set(value);
								if (value === "*") {
									if (targetStat$.minimum.get() < 0) {
										targetStat$.minimum.set(0);
									}
									if (targetStat$.maximum.get() < 0) {
										targetStat$.maximum.set(0);
									}
								}
							}}
						>
							<ToggleGroupItem className={"h-4"} value={"+"}>
								+
							</ToggleGroupItem>
							<ToggleGroupItem className={"h-4"} value={"*"}>
								*
							</ToggleGroupItem>
						</ReactiveToggleGroup>
					</div>
				</div>
			</Card>
		);
	},
);

TargetStatWidget.displayName = "TargetStatWidget";

export default TargetStatWidget;
