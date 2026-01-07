import Affixes from "../Affixes.json";

// domain
import type { Affix } from "../domain/Datacrons";

interface AffixData {
	abilityId: string;
	targetRule: string;
	statType: number;
	statValueMin: number;
	statValueMax: number;
	minTier: number;
	maxTier: number;
	tag: string[];
	scopeIcon: string;
	description: string;
	name: string;
	fullText: string;
	shortText: string;
	targetCategory: string;
	targetCharacter: string;
}

const affixMap = new Map<string, AffixData>();

for (const items of Object.values(Affixes)) {
	for (const item of items) {
		const key = `${item.targetRule}|${item.abilityId}`;
		// Only keep the first occurrence to match original behavior
		if (!affixMap.has(key)) {
			affixMap.set(key, item as AffixData);
		}
	}
}

export function findAffix(affix: Affix): AffixData | null {
	const key = `${affix.targetRule}|${affix.abilityId}`;
	return affixMap.get(key) || null;
}
