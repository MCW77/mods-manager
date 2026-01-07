const statIds = {
	None: 0,
	Health: 1,
	Strength: 2,
	Agility: 3,
	Intelligence: 4,
	Speed: 5,
	PhysicalDamage: 6,
	SpecialDamage: 7,
	UnitDefense: 8,
	UnitResistance: 9,
	ArmorPenetration: 10,
	ResistancePenetration: 11,
	DodgeRating: 12,
	DeflectionRating: 13,
	UnitPhysicalCriticalChance: 14,
	UnitSpecialCriticalChance: 15,
	CriticalDamage: 16,
	Potency: 17,
	Tenacity: 18,
	Dodgepercentadditive: 19,
	Deflectionpercentadditive: 20,
	Attackcriticalpercentadditive: 21,
	Abilitycriticalpercentadditive: 22,
	Armorpercentadditive: 23,
	Suppressionpercentadditive: 24,
	ArmorPenetrationPct: 25,
	ResistancePenetrationPct: 26,
	HealthSteal: 27,
	Protection: 28,
	Shieldpenetration: 29,
	Healthregen: 30,
	PhysicalDamagePct: 31,
	SpecialDamagePct: 32,
	Dodgenegatepercentadditive: 33,
	Deflectionnegatepercentadditive: 34,
	Attackcriticalnegatepercentadditive: 35,
	Abilitycriticalnegatepercentadditive: 36,
	UnitPhysicalAccuracy: 37,
	UnitSpecialAccuracy: 38,
	UnitPhysicalCriticalAvoidance: 39,
	UnitSpecialCriticalAvoidance: 40,
	Offense: 41,
	Defense: 42,
	DefensePenetration: 43,
	Evasionrating: 44,
	Criticalrating: 45,
	Evasionnegaterating: 46,
	Criticalnegaterating: 47,
	OffensePct: 48,
	DefensePct: 49,
	Defensepenetrationpercentadditive: 50,
	Evasionpercentadditive: 51,
	Accuracy: 52,
	CriticalChance: 53,
	CriticalAvoidance: 54,
	HealthPct: 55,
	ProtectionPct: 56,
	Speedpercentadditive: 57,
	Counterattackrating: 58,
	Taunt: 59,
	Defensepenetrationtargetpercentadditive: 60,
	Mastery: 61,
} as const;

type StatId = (typeof statIds)[keyof typeof statIds];

function statIdToString(stat: StatId, showPcts?: boolean): string {
	switch (stat) {
		case statIds.None:
			return "";
		case statIds.Health:
			return "Health";
		case statIds.UnitDefense:
			return "Defense";
		case statIds.UnitResistance:
			return "Resistance";
		case statIds.UnitPhysicalCriticalChance:
			return "Physical Crit Chance";
		case statIds.UnitSpecialCriticalChance:
			return "Special Crit Chance";
		case statIds.UnitPhysicalCriticalAvoidance:
			return "Crit Avoidance";
		case statIds.UnitSpecialCriticalAvoidance:
			return "Special Crit Avoidance";
		case statIds.UnitPhysicalAccuracy:
			return "Physical Accuracy";
		case statIds.UnitSpecialAccuracy:
			return "Special Accuracy";
		case statIds.HealthPct:
			return showPcts ? "Health %" : "Health";
		case statIds.Speed:
			return "Speed";
		case statIds.PhysicalDamage:
			return "Physical Damage";
		case statIds.SpecialDamage:
			return "Special Damage";
		case statIds.CriticalDamage:
			return "Crit Dmg";
		case statIds.Potency:
			return "Potency";
		case statIds.Tenacity:
			return "Tenacity";
		case statIds.Protection:
			return "Protection";
		case statIds.ProtectionPct:
			return showPcts ? "Protection %" : "Protection";
		case statIds.Offense:
			return "Offense";
		case statIds.OffensePct:
			return showPcts ? "Offense %" : "Offense";
		case statIds.Defense:
			return "Defense";
		case statIds.DefensePct:
			return showPcts ? "Defense %" : "Defense";
		case statIds.Accuracy:
			return "Accuracy";
		case statIds.CriticalChance:
			return "Crit Chance";
		case statIds.CriticalAvoidance:
			return "Crit Avoid";
		case statIds.ArmorPenetration:
			return "Armor Penetration";
		case statIds.DodgeRating:
			return "Dodge";
		case statIds.HealthSteal:
			return "Health Steal";
		case statIds.DefensePenetration:
			return "Defense Penetration";
		case statIds.ResistancePenetration:
			return "Resistance Penetration";
		case statIds.DeflectionRating:
			return "Deflection";
		case statIds.ArmorPenetrationPct:
			return "Armor Penetration";
		case statIds.ResistancePenetrationPct:
			return "Resistance Penetration";
		case statIds.PhysicalDamagePct:
			return "Physical Damage";
		case statIds.SpecialDamagePct:
			return "Special Damage";

		case statIds.Armorpercentadditive:
			return "Defense";
		case statIds.Suppressionpercentadditive:
			return "Resistance";
		case statIds.Attackcriticalpercentadditive:
			return "Crit Chance";
		case statIds.Abilitycriticalpercentadditive:
			return "Special Crit Chance";
		case statIds.Strength:
			return "Strength";
		case statIds.Agility:
			return "Agility";
		case statIds.Intelligence:
			return "Intelligence";
		case statIds.Dodgepercentadditive:
			return "Dodge";
		case statIds.Deflectionpercentadditive:
			return "Deflection";
		case statIds.Shieldpenetration:
			return "Resistance Penetration";
		case statIds.Healthregen:
			return "Health Regen";
		case statIds.Dodgenegatepercentadditive:
			return "Accuracy";
		case statIds.Deflectionnegatepercentadditive:
			return "Special Accuracy";
		case statIds.Attackcriticalnegatepercentadditive:
			return "Crit Avoid";
		case statIds.Abilitycriticalnegatepercentadditive:
			return "Special Crit Avoid";
		case statIds.Evasionrating:
			return "Evade";
		case statIds.Criticalrating:
			return "Crit";
		case statIds.Evasionnegaterating:
			return "Accuracy";
		case statIds.Criticalnegaterating:
			return "Crit Avoid";
		case statIds.Defensepenetrationpercentadditive:
			return "Defense Penetration";
		case statIds.Evasionpercentadditive:
			return "Evade";
		case statIds.Speedpercentadditive:
			return "Speed %";
		case statIds.Counterattackrating:
			return "Counter Chance";
		case statIds.Taunt:
			return "Taunt";
		case statIds.Defensepenetrationtargetpercentadditive:
			return "Defense Penetration";
		case statIds.Mastery:
			return "Mastery";
	}
}

function statIdToShortString(stat: StatId): string {
	switch (stat) {
		case statIds.None:
			return "";
		case statIds.Health:
			return "Health";
		case statIds.Speed:
			return "Speed";
		case statIds.PhysicalDamage:
			return "Dmg";
		case statIds.SpecialDamage:
			return "SDmg";
		case statIds.UnitDefense:
			return "Def";
		case statIds.UnitResistance:
			return "Res";
		case statIds.ArmorPenetration:
			return "APen";
		case statIds.ResistancePenetration:
			return "RPen";
		case statIds.DodgeRating:
			return "Dodge";
		case statIds.DeflectionRating:
			return "Defl";
		case statIds.UnitPhysicalCriticalChance:
			return "Crit";
		case statIds.UnitSpecialCriticalChance:
			return "SCrit";
		case statIds.CriticalDamage:
			return "CritD";
		case statIds.Potency:
			return "Pot";
		case statIds.Tenacity:
			return "Ten";
		case statIds.ArmorPenetrationPct:
			return "APen";
		case statIds.ResistancePenetrationPct:
			return "RPen";
		case statIds.HealthSteal:
			return "Steal";
		case statIds.Protection:
			return "Prot";
		case statIds.PhysicalDamagePct:
			return "Dmg";
		case statIds.SpecialDamagePct:
			return "SDmg";
		case statIds.UnitPhysicalAccuracy:
			return "Acc";
		case statIds.UnitSpecialAccuracy:
			return "SAcc";
		case statIds.UnitPhysicalCriticalAvoidance:
			return "PCAvoid";
		case statIds.UnitSpecialCriticalAvoidance:
			return "SCAvoid";
		case statIds.Offense:
			return "Off";
		case statIds.Defense:
			return "Def";
		case statIds.DefensePenetration:
			return "DPen";
		case statIds.OffensePct:
			return "Off";
		case statIds.DefensePct:
			return "Def";
		case statIds.Accuracy:
			return "Acc";
		case statIds.CriticalChance:
			return "CChance";
		case statIds.CriticalAvoidance:
			return "CAvoid";
		case statIds.HealthPct:
			return "Health";
		case statIds.ProtectionPct:
			return "Prot";
		case statIds.Armorpercentadditive:
			return "Def";
		case statIds.Suppressionpercentadditive:
			return "Res";
		case statIds.Attackcriticalpercentadditive:
			return "Crit";
		case statIds.Abilitycriticalpercentadditive:
			return "SCrit";
		case statIds.Strength:
			return "Str";
		case statIds.Agility:
			return "Agi";
		case statIds.Intelligence:
			return "Int";
		case statIds.Dodgepercentadditive:
			return "Dodge";
		case statIds.Deflectionpercentadditive:
			return "Defl";
		case statIds.Shieldpenetration:
			return "SPen";
		case statIds.Healthregen:
			return "HRegen";
		case statIds.Dodgenegatepercentadditive:
			return "Acc";
		case statIds.Deflectionnegatepercentadditive:
			return "SAcc";
		case statIds.Attackcriticalnegatepercentadditive:
			return "CAvoid";
		case statIds.Abilitycriticalnegatepercentadditive:
			return "SCAvoid";
		case statIds.Evasionrating:
			return "Evade";
		case statIds.Criticalrating:
			return "Crit";
		case statIds.Evasionnegaterating:
			return "Acc";
		case statIds.Criticalnegaterating:
			return "CAvoid";
		case statIds.Defensepenetrationpercentadditive:
			return "DPen";
		case statIds.Evasionpercentadditive:
			return "Evade";
		case statIds.Speedpercentadditive:
			return "Spd%";
		case statIds.Counterattackrating:
			return "Counter";
		case statIds.Taunt:
			return "Taunt";
		case statIds.Defensepenetrationtargetpercentadditive:
			return "Dpen";
		case statIds.Mastery:
			return "Mastery";
	}
}

function statIdToDisplayscaledscaledValue(stat: StatId, value: number): string {
	const scaledValue = value / 100000000;
	switch (stat) {
		case statIds.Health:
			return `${(scaledValue / 1000).toFixed(0)}K`;
		case statIds.Speed:
			return scaledValue.toFixed(0);
		case statIds.PhysicalDamage:
			return `${(scaledValue / 1000).toFixed(0)}K`;
		case statIds.SpecialDamage:
			return `${(scaledValue / 1000).toFixed(0)}K`;
		case statIds.UnitDefense:
			return scaledValue.toFixed(0);
		case statIds.UnitResistance:
			return scaledValue.toFixed(0);
		case statIds.ArmorPenetration:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.ResistancePenetration:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.DodgeRating:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.DeflectionRating:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.UnitPhysicalCriticalChance:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.UnitSpecialCriticalChance:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.CriticalDamage:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Potency:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Tenacity:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.ArmorPenetrationPct:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.ResistancePenetrationPct:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.HealthSteal:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Protection:
			return `${(scaledValue / 1000).toFixed(0)}K`;
		case statIds.PhysicalDamagePct:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.SpecialDamagePct:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.UnitPhysicalAccuracy:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.UnitSpecialAccuracy:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.UnitPhysicalCriticalAvoidance:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.UnitSpecialCriticalAvoidance:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Offense:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Defense:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.DefensePenetration:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.OffensePct:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.DefensePct:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Accuracy:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.CriticalChance:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.CriticalAvoidance:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.HealthPct:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.ProtectionPct:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Armorpercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Suppressionpercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Attackcriticalpercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Abilitycriticalpercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Strength:
			return scaledValue.toFixed(0);
		case statIds.Agility:
			return scaledValue.toFixed(0);
		case statIds.Intelligence:
			return scaledValue.toFixed(0);
		case statIds.Dodgepercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Deflectionpercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Shieldpenetration:
			return scaledValue.toFixed(0);
		case statIds.Healthregen:
			return scaledValue.toFixed(0);
		case statIds.Dodgenegatepercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Deflectionnegatepercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Attackcriticalnegatepercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Abilitycriticalnegatepercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Evasionrating:
			return scaledValue.toFixed(0);
		case statIds.Criticalrating:
			return scaledValue.toFixed(0);
		case statIds.Evasionnegaterating:
			return scaledValue.toFixed(0);
		case statIds.Criticalnegaterating:
			return scaledValue.toFixed(0);
		case statIds.Defensepenetrationpercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Evasionpercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Speedpercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Counterattackrating:
			return scaledValue.toFixed(0);
		case statIds.Taunt:
			return scaledValue.toFixed(0);
		case statIds.Defensepenetrationtargetpercentadditive:
			return `${(scaledValue * 100).toFixed(0)}%`;
		case statIds.Mastery:
			return scaledValue.toFixed(0);

		default:
			return scaledValue.toString();
	}
}

export {
	statIds,
	type StatId,
	statIdToString,
	statIdToShortString,
	statIdToDisplayscaledscaledValue,
};
