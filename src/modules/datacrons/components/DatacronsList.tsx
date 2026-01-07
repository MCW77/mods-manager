// react
import { For, useValue } from "@legendapp/state/react";
import type { Observable } from "@legendapp/state";

// domain
import type { Datacron, Affix } from "../domain/Datacrons";

// state
import { datacrons$ } from "../state/datacrons";

// components
import { Input } from "#/components/reactive/Input";
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { ScrollArea } from "#ui/scroll-area";
import { DatacronImage } from "./DatacronImage";
import { DatacronStats } from "./DatacronStats";
import { DatacronAbilities } from "./DatacronAbilities";
import { Label } from "#/components/ui/label";

interface DatacronItemProps {
	item$: Observable<string>;
}
function DatacronItem({ item$ }: DatacronItemProps) {
	const id = useValue(item$);
	const datacron$ = datacrons$.datacronByIdForActiveAllycode[id];
	const datacron = useValue(datacron$);

	const setName =
		useValue(datacrons$.availableDatacronSets.get().get(datacron?.setId ?? -1))
			?.name || "";
	const className = useValue(() =>
		datacrons$.showShortDescription.get() ? "min-w-[49%] flex-1" : "w-full",
	);

	if (!datacron) return null;

	return (
		<Card key={datacron.id} className={className}>
			<CardHeader>
				<CardTitle className="flex flex-row items-center gap-4">
					<div className="font-semibold whitespace-nowrap">
						Set {datacron.setId} - {setName}
					</div>
					<div className="font-semibold">Tier {datacron.affix.length}</div>
					{datacron.focused && <span className="text-sm italic">Focused</span>}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex gap-8">
					<div className="flex flex-col">
						<DatacronImage datacron$={datacron$ as Observable<Datacron>} />
						<div>
							<Label>Name:</Label>
							<Input $value={datacron$.name} />
						</div>
					</div>
					<DatacronStats affixes$={datacron$.affix as Observable<Affix[]>} />
					<DatacronAbilities
						affixes$={datacron$.affix as Observable<Affix[]>}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
function DatacronsList() {
	const datacronsList$ = datacrons$.filteredDatacronsIdsForActiveAllycode;
	const datacronsList = useValue(datacronsList$);
	if (!datacronsList) return null;

	return (
		<ScrollArea className="flex-1 min-h-0 w-full px-6">
			<div className={"flex flex-row flex-wrap gap-4"}>
				<For each={datacronsList$} item={DatacronItem} optimized />
			</div>
		</ScrollArea>
	);
}
export default DatacronsList;
