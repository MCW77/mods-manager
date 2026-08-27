// state
import { For, Switch, useObservable, useValue } from "@legendapp/state/react";
import type { ObservableObject } from "@legendapp/state";
import { statistics$ } from "../state/statistics";

// domain
import type { Combination } from "#/domain/Combination";

// components
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { Label } from "#ui/label";

interface FarmEntryProps {
	entry$: ObservableObject<{
		combination: Combination;
		count: number;
	}>;
}
function FarmEntry({ entry$ }: FarmEntryProps) {
	const entry = useValue(entry$);
	const displayPromaries =
		entry.combination.primaryStats === undefined ||
		entry.combination.primaryStats.length === 0
			? ""
			: entry.combination.primaryStats.length === 1
				? `with ${entry.combination.primaryStats[0]} primary`
				: `with ${entry.combination.primaryStats.join(", ")} primaries`;
	return (
		<div className="flex gap-4">
			<div className={"flex gap-2"}>
				<Label>
					`{entry.combination.pips}-dot-{entry.combination.slot}{" "}
					{displayPromaries}`
				</Label>
				<div className="font-bold">{entry.count}</div>
			</div>
		</div>
	);
}

function DefenseSection() {
	const isEmpty$ = useObservable(
		() => statistics$.modsToFarmOfModset["Defense %"].get().size === 0,
	);

	return (
		<Card className="w-fit">
			<CardHeader>
				<div>
					<CardTitle>Defense</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<Switch value={isEmpty$}>
					{{
						default: () => {
							return (
								<div className="flex flex-col gap-2">
									<For each={statistics$.modsToFarmOfModset["Defense %"]}>
										{(entry) => <FarmEntry entry$={entry} />}
									</For>
								</div>
							);
						},
						true: () => (
							<div className="text-sm text-gray-500">
								No defense mods to farm
							</div>
						),
					}}
				</Switch>
			</CardContent>
		</Card>
	);
}

function HealthSection() {
	const isEmpty$ = useObservable(
		() => statistics$.modsToFarmOfModset["Health %"].get().size === 0,
	);

	return (
		<Card className="w-fit">
			<CardHeader>
				<div>
					<CardTitle>Health</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<Switch value={isEmpty$}>
					{{
						default: () => {
							return (
								<div className="flex flex-col gap-2">
									<For each={statistics$.modsToFarmOfModset["Health %"]}>
										{(entry) => <FarmEntry entry$={entry} />}
									</For>
								</div>
							);
						},
						true: () => (
							<div className="text-sm text-gray-500">
								No health mods to farm
							</div>
						),
					}}
				</Switch>
			</CardContent>
		</Card>
	);
}

function PotencySection() {
	const isEmpty$ = useObservable(
		() => statistics$.modsToFarmOfModset["Potency %"].get().size === 0,
	);

	return (
		<Card className="w-fit">
			<CardHeader>
				<div>
					<CardTitle>Potency</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<Switch value={isEmpty$}>
					{{
						default: () => {
							return (
								<div className="flex flex-col gap-2">
									<For each={statistics$.modsToFarmOfModset["Potency %"]}>
										{(entry) => <FarmEntry entry$={entry} />}
									</For>
								</div>
							);
						},
						true: () => (
							<div className="text-sm text-gray-500">
								No potency mods to farm
							</div>
						),
					}}
				</Switch>
			</CardContent>
		</Card>
	);
}

function TenacitySection() {
	const isEmpty$ = useObservable(
		() => statistics$.modsToFarmOfModset["Tenacity %"].get().size === 0,
	);

	return (
		<Card className="w-fit">
			<CardHeader>
				<div>
					<CardTitle>Tenacity</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<Switch value={isEmpty$}>
					{{
						default: () => {
							return (
								<div className="flex flex-col gap-2">
									<For each={statistics$.modsToFarmOfModset["Tenacity %"]}>
										{(entry) => <FarmEntry entry$={entry} />}
									</For>
								</div>
							);
						},
						true: () => (
							<div className="text-sm text-gray-500">
								No tenacity mods to farm
							</div>
						),
					}}
				</Switch>
			</CardContent>
		</Card>
	);
}

function ModsToFarm() {
	const _modsToFarm = useValue(statistics$.modsToFarm);

	return (
		<Card className="w-fit">
			<CardHeader>
				<div>
					<CardTitle>Mods to Farm (by modset)</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4">
					<HealthSection />
					<DefenseSection />
					<PotencySection />
					<TenacitySection />
				</div>
			</CardContent>
		</Card>
	);
}

export { ModsToFarm };
