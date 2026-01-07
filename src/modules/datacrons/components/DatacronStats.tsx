// state
import type { Observable } from "@legendapp/state";
import { For, useObservable, useValue } from "@legendapp/state/react";

// domain
import type { Affix } from "../domain/Datacrons";
import {
	statIdToDisplayscaledscaledValue,
	statIdToString,
	type StatId,
} from "../../hotUtils/domain/StatIDs";

interface StatItemProps {
	id: StatId;
	item$: Observable<number>;
}

function StatItem({ id, item$ }: StatItemProps) {
	const value = useValue(item$);
	const statName = statIdToString(id);
	const statValue = statIdToDisplayscaledscaledValue(id, value);
	return (
		<div className="flex justify-between gap-2">
			<span className="whitespace-nowrap">{`${statName}: `}</span>
			<span>{statValue}</span>
		</div>
	);
}
interface DatacronStatsProps {
	affixes$: Observable<Affix[]>;
}

function aggregateStatAffixes(affixes: Affix[]): Map<StatId, number> {
	const ret = new Map<StatId, number>();

	for (const affix of affixes) {
		if (affix.statType === 0) continue;
		ret.set(affix.statType, (ret.get(affix.statType) || 0) + affix.statValue);
	}

	return ret;
}

function DatacronStats({ affixes$ }: DatacronStatsProps) {
	const affixes = useValue(affixes$);
	const aggregatedStats = aggregateStatAffixes(affixes);
	const aggregatedStats$ = useObservable(aggregatedStats);

	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-lg font-semibold">Stats:</h3>
			<div className="flex flex-col gap-2 justify-between">
				<For each={aggregatedStats$} item={StatItem} />
			</div>
		</div>
	);
}

export { DatacronStats };
