// state
import type { Observable } from "@legendapp/state";
import { For, useValue, useObservable } from "@legendapp/state/react";

// domain
import type { Affix } from "../domain/Datacrons";
import { findAffix } from "../utils/findAffix";
import { datacrons$ } from "../state/datacrons";

interface AbilityItemProps {
	id: string;
	item$: Observable<{ affix: Affix; index: number }>;
}
function AbilityItem({ id, item$ }: AbilityItemProps) {
	const item = useValue(item$);
	const showShortDescription = useValue(datacrons$.showShortDescription);

	const url = item.affix.scopeIcon.includes("charui")
		? `https://swgoh-images.s3.us-east-2.amazonaws.com/toon-portraits/${item.affix.scopeIcon}.png`
		: `/img/${item.affix.scopeIcon}.webp`;

	const affixData = findAffix(item.affix);
	let text = "Unknown Affix";
	if (affixData) {
		text = (
			showShortDescription ? affixData.shortText : affixData.fullText
		).replace(/\\n/g, "\n");
	}

	return (
		<div key={id} className="">
			<img src={url} alt="ability icon" className="inline size-[24px] mr-2" />
			<span className="whitespace-pre-wrap">{text}</span>
		</div>
	);
}

interface DatacronAbilitiesProps {
	affixes$: Observable<Affix[]>;
}

function DatacronAbilities({ affixes$ }: DatacronAbilitiesProps) {
	const abilities$ = useObservable(() => {
		const affixes = affixes$.get();
		if (affixes === undefined) return new Map();
		const abilities = new Map<string, { affix: Affix; index: number }>();
		for (const [index, affix] of affixes.entries()) {
			if ((index + 1) % 3 === 0) {
				abilities.set(affix.abilityId, {
					affix,
					index,
				});
			}
		}
		return abilities;
	});

	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-lg font-semibold">Abilities:</h3>
			<div className="flex flex-col gap-4">
				<For each={abilities$} item={AbilityItem} />
			</div>
		</div>
	);
}

export { DatacronAbilities };
