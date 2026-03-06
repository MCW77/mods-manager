import type { ShortCharacterTemplates } from "#/modules/templates/domain/CharacterTemplates";

const defaultTemplates = [
	{
		id: "Forest Moon",
		category: "Assault Battle",
		selectedCharacters: [
			{
				id: "MAGNAGUARD",
				target: {
					id: "Forest Moon",
					health: 50,
					prot: 100,
					arm: 5,
					res: 5,
				},
			},
			{
				id: "GRANDADMIRALTHRAWN",
				target: {
					id: "Forest Moon",
					health: 5,
					prot: 5,
					spd: 100,
					ten: 5,
				},
			},
			{
				id: "BB8",
				target: {
					id: "Forest Moon",
					health: 5,
					prot: 5,
					spd: 100,
				},
			},
			{
				id: "B1BATTLEDROIDV2",
				target: {
					id: "Default",
					spd: 100,
					pot: 25,
					phys: 75,
				},
			},
			{
				id: "B2SUPERBATTLEDROID",
				target: {
					id: "Forest Moon",
					health: 50,
					prot: 50,
					pot: 50,
				},
			},
		],
	},
	{
		id: "Ground War",
		category: "Assault Battle",
		selectedCharacters: [
			{
				id: "GENERALSKYWALKER",
				target: {
					id: "Default",
					desc: "Defense",
					health: 10,
					prot: 25,
					spd: 100,
					pot: 20,
					phys: 10,
					arm: 10,
					res: 10,
				},
			},
			{
				id: "AHSOKATANO",
				target: {
					id: "Ground War",
					spd: 100,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "GRANDMASTERYODA",
				target: {
					id: "Default",
					desc: "Speedy",
					spd: 100,
					cd: 50,
					pot: 25,
					spec: 80,
					cc: 25,
				},
			},
			{
				id: "SHAAKTI",
				target: {
					id: "Default",
					health: 25,
					prot: 25,
					spd: 100,
				},
			},
			{
				id: "HERMITYODA",
				target: {
					id: "Speed",
					spd: 100,
				},
			},
		],
	},
	{
		id: "Places of Power",
		category: "Assault Battle",
		selectedCharacters: [
			{
				id: "EMPERORPALPATINE",
				target: {
					id: "Default",
					spd: 100,
					pot: 25,
					spec: 50,
				},
			},
			{
				id: "BASTILASHANDARK",
				target: {
					id: "Places of Power",
					spd: 100,
					spec: 5,
				},
			},
			{
				id: "DARTHREVAN",
				target: {
					id: "Default",
					spd: 100,
					cd: 50,
					pot: 10,
					spec: 15,
					cc: 10,
				},
			},
			{
				id: "DARTHNIHILUS",
				target: {
					id: "Default",
					health: 10,
					spd: 100,
					pot: 25,
				},
			},
			{
				id: "DARTHMALAK",
				target: {
					id: "Default",
					health: 15,
					prot: 25,
					spd: 100,
					cd: 10,
					pot: 10,
					phys: 10,
					cc: 10,
				},
			},
		],
	},
	{
		id: "Secrets and Shadows",
		category: "Assault Battle",
		selectedCharacters: [
			{
				id: "DAKA",
				target: {
					id: "Secrets and Shadows",
					desc: "Healthy",
					health: 50,
					spd: 50,
				},
			},
			{
				id: "MOTHERTALZIN",
				target: {
					id: "Default",
					spd: 100,
					pot: 50,
					spec: 25,
					cc: 10,
				},
			},
			{
				id: "ASAJVENTRESS",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 10,
					spec: 10,
					cc: 20,
				},
			},
			{
				id: "TALIA",
				target: {
					id: "Default",
					spd: 100,
					pot: 20,
					phys: 50,
				},
			},
			{
				id: "NIGHTSISTERZOMBIE",
				target: {
					id: "Strong Zombie",
					health: 20,
					prot: 20,
					spd: 100,
					ten: 25,
				},
			},
		],
	},
	{
		id: "C3PO",
		category: "Unlock",
		selectedCharacters: [
			{
				id: "CHIEFCHIRPA",
				target: {
					id: "Speed",
					spd: 100,
				},
			},
			{
				id: "EWOKELDER",
				target: {
					id: "Default",
					health: 25,
					spd: 100,
					ten: 20,
				},
			},
			{
				id: "WICKET",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "LOGRAY",
				target: {
					id: "Default",
					spd: 100,
					pot: 25,
					ten: 20,
				},
			},
			{
				id: "PAPLOO",
				target: {
					id: "Fast Tank",
					health: 25,
					prot: 25,
					spd: 100,
					ten: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
		],
	},
	{
		id: "GAS Phase 2",
		category: "Unlock",
		selectedCharacters: [
			{
				id: "C3POLEGENDARY",
				target: {
					id: "Default",
					desc: "Speedy debuffer",
					spd: 100,
					pot: 25,
				},
			},
			{
				id: "PADMEAMIDALA",
				target: {
					id: "Default",
					health: 35,
					spd: 100,
					cd: 25,
					pot: 15,
					phys: 10,
					cc: 10,
				},
			},
			{
				id: "AHSOKATANO",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "SHAAKTI",
				target: {
					id: "Default",
					health: 25,
					prot: 25,
					spd: 100,
				},
			},
			{
				id: "GENERALKENOBI",
				target: {
					id: "Default",
					desc: "Speedy Tank",
					health: 25,
					prot: 50,
					spd: 100,
					ten: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
		],
	},
	{
		id: "GAS Phase 4",
		category: "Unlock",
		selectedCharacters: [
			{
				id: "B1BATTLEDROIDV2",
				target: {
					id: "Default",
					spd: 100,
					pot: 25,
					phys: 75,
				},
			},
			{
				id: "DROIDEKA",
				target: {
					id: "GAS Phase 4",
					spd: 100,
					phys: 50,
					cc: 25,
				},
			},
			{
				id: "B2SUPERBATTLEDROID",
				target: {
					id: "Default",
					desc: "Survival",
					health: 50,
					prot: 50,
					pot: 50,
					ten: 25,
					acc: 50,
				},
			},
			{
				id: "MAGNAGUARD",
				target: {
					id: "GAS Phase 4",
					desc: "Survival",
					health: 20,
					prot: 20,
					ten: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
			{
				id: "ASAJVENTRESS",
				target: {
					id: "GAS Phase 4",
					spd: 20,
					cd: 100,
					phys: 20,
					cc: 20,
				},
			},
		],
	},
	{
		id: "Malak (DS)",
		category: "Unlock",
		selectedCharacters: [
			{
				id: "DARTHREVAN",
				target: {
					id: "Default",
					spd: 100,
					cd: 50,
					pot: 10,
					spec: 15,
					cc: 10,
				},
			},
			{
				id: "BASTILASHANDARK",
				target: {
					id: "Malak (DS)",
					spd: 100,
					spec: 5,
				},
			},
			{
				id: "HK47",
				target: {
					id: "Default",
					spd: 100,
					cd: 75,
					phys: 50,
					cc: 25,
				},
			},
			{
				id: "CARTHONASI",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "CANDEROUSORDO",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
		],
	},
	{
		id: "Malak (LS)",
		category: "Unlock",
		selectedCharacters: [
			{
				id: "JEDIKNIGHTREVAN",
				target: {
					id: "Default",
					spd: 100,
					cd: 50,
					spec: 10,
				},
			},
			{
				id: "BASTILASHAN",
				target: {
					id: "JKR Lead",
					spd: 100,
					spec: 50,
				},
			},
			{
				id: "JOLEEBINDO",
				target: {
					id: "Health and Speed",
					health: 100,
					spd: 75,
				},
			},
			{
				id: "ZAALBAR",
				target: {
					id: "Default",
					health: 50,
					prot: 50,
					spd: 25,
					pot: 25,
					ten: 50,
					ca: 50,
				},
			},
			{
				id: "MISSIONVAO",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 75,
					cc: 50,
				},
			},
		],
	},
	{
		id: "Padme (Droids)",
		category: "Unlock",
		selectedCharacters: [
			{
				id: "GRIEVOUS",
				target: {
					id: "Default",
					health: 100,
					spd: 80,
					cd: 80,
				},
			},
			{
				id: "B1BATTLEDROIDV2",
				target: {
					id: "Default",
					spd: 100,
					pot: 25,
					phys: 75,
				},
			},
			{
				id: "DROIDEKA",
				target: {
					id: "Default",
					health: 5,
					prot: 5,
					spd: 50,
					ten: 10,
					phys: 100,
					cc: 25,
					arm: 20,
					res: 20,
				},
			},
			{
				id: "MAGNAGUARD",
				target: {
					id: "Balanced",
					health: 20,
					prot: 20,
					spd: 100,
					cd: 25,
					pot: 50,
					ten: 25,
					phys: 25,
					cc: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
			{
				id: "B2SUPERBATTLEDROID",
				target: {
					id: "Default",
					desc: "Survival",
					health: 50,
					prot: 50,
					pot: 50,
					ten: 25,
					acc: 50,
				},
			},
		],
	},
	{
		id: "Padme (Geonosians)",
		category: "Unlock",
		selectedCharacters: [
			{
				id: "GEONOSIANBROODALPHA",
				target: {
					id: "Default",
					desc: "Tanky",
					health: 20,
					prot: 20,
					spd: 100,
					ten: 20,
				},
			},
			{
				id: "GEONOSIANSPY",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "GEONOSIANSOLDIER",
				target: {
					id: "Default",
					spd: 80,
					cd: 90,
					phys: 50,
					cc: 100,
				},
			},
			{
				id: "SUNFAC",
				target: {
					id: "Default",
					desc: "Tanky",
					health: 40,
					prot: 40,
					spd: 100,
					pot: 25,
					ten: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
			{
				id: "POGGLETHELESSER",
				target: {
					id: "Default",
					desc: "Speedy debuffer",
					spd: 100,
					pot: 25,
				},
			},
		],
	},
	{
		id: "Padme (Mixed)",
		category: "Unlock",
		selectedCharacters: [
			{
				id: "GRIEVOUS",
				target: {
					id: "Default",
					health: 100,
					spd: 80,
					cd: 80,
				},
			},
			{
				id: "ASAJVENTRESS",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 10,
					spec: 10,
					cc: 20,
				},
			},
			{
				id: "COUNTDOOKU",
				target: {
					id: "Default",
					spd: 100,
					pot: 50,
					ten: 50,
					phys: 25,
				},
			},
			{
				id: "MAGNAGUARD",
				target: {
					id: "Balanced",
					health: 20,
					prot: 20,
					spd: 100,
					cd: 25,
					pot: 50,
					ten: 25,
					phys: 25,
					cc: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
			{
				id: "B2SUPERBATTLEDROID",
				target: {
					id: "Default",
					desc: "Survival",
					health: 50,
					prot: 50,
					pot: 50,
					ten: 25,
					acc: 50,
				},
			},
		],
	},
	{
		id: "Leia Organa - Tier 2",
		category: "GL unlock",
		selectedCharacters: [
			{
				id: "HOTHLEIA",
				target: {
					id: "Leia Organa - Tier 2",
					spd: 100,
					cd: 50,
					pot: 70,
					ten: 30,
					phys: 25,
					cc: 30,
					primaryRes: {
						arrow: "Critical Avoidance %",
						triangle: "Critical Damage %",
						cross: "Potency %",
					},
					setRes: {
						"Potency %": 2,
						"Health %": 1,
					},
				},
			},
			{
				id: "HOTHHAN",
				target: {
					id: "Leia Organa - Tier 2",
					health: 20,
					spd: 100,
					pot: 25,
					ten: 30,
					primaryRes: {
						arrow: "Critical Avoidance %",
						triangle: "Health %",
						circle: "Health %",
						cross: "Health %",
					},
					setRes: {
						"Health %": 3,
					},
				},
			},
		],
	},
	{
		id: "ABC",
		category: "Raid - HAAT",
		selectedCharacters: [
			{
				id: "BB8",
				target: {
					id: "ABC",
					desc: "Speed",
					spd: 100,
				},
			},
			{
				id: "GRANDADMIRALTHRAWN",
				target: {
					id: "Default",
					health: 5,
					prot: 5,
					spd: 100,
					ten: 5,
				},
			},
			{
				id: "COMMANDERLUKESKYWALKER",
				target: {
					id: "Raids",
					spd: 100,
					pot: 25,
					phys: 25,
				},
			},
			{
				id: "YOUNGHAN",
				target: {
					id: "HAAT",
					spd: 80,
					cd: 100,
					phys: 50,
				},
			},
			{
				id: "ADMIRALACKBAR",
				target: {
					id: "Speed",
					spd: 100,
				},
			},
		],
	},
	{
		id: "RJT w/ Finn",
		category: "Raid - HAAT",
		selectedCharacters: [
			{
				id: "BB8",
				target: {
					id: "Speed",
					spd: 100,
				},
			},
			{
				id: "REYJEDITRAINING",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 20,
					phys: 20,
					cc: 50,
				},
			},
			{
				id: "C3POLEGENDARY",
				target: {
					id: "Speed",
					spd: 100,
				},
			},
			{
				id: "FINN",
				target: {
					id: "Default",
					spd: 10,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "R2D2_LEGENDARY",
				target: {
					id: "Default",
					health: 5,
					prot: 5,
					spd: 100,
					pot: 25,
					ten: 10,
					cc: 25,
				},
			},
		],
	},
	{
		id: "RJT w/ RT",
		category: "Raid - HAAT",
		selectedCharacters: [
			{
				id: "BB8",
				target: {
					id: "Speed",
					spd: 100,
				},
			},
			{
				id: "REYJEDITRAINING",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 20,
					phys: 20,
					cc: 50,
				},
			},
			{
				id: "C3POLEGENDARY",
				target: {
					id: "Speed",
					spd: 100,
				},
			},
			{
				id: "RESISTANCETROOPER",
				target: {
					id: "Default",
					spd: 10,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 100,
				},
			},
			{
				id: "R2D2_LEGENDARY",
				target: {
					id: "Default",
					health: 5,
					prot: 5,
					spd: 100,
					pot: 25,
					ten: 10,
					cc: 25,
				},
			},
		],
	},
	{
		id: "Wampanader",
		category: "Raid - HAAT",
		selectedCharacters: [
			{
				id: "BB8",
				target: {
					id: "Speed",
					spd: 100,
				},
			},
			{
				id: "GRANDADMIRALTHRAWN",
				target: {
					id: "Default",
					health: 5,
					prot: 5,
					spd: 100,
					ten: 5,
				},
			},
			{
				id: "WAMPA",
				target: {
					id: "Raids",
					health: 10,
					spd: 80,
					cd: 100,
					pot: 10,
					phys: 50,
				},
			},
			{
				id: "VADER",
				target: {
					id: "Raids",
					spd: 100,
					cd: 50,
					pot: 25,
					phys: 25,
					cc: 25,
				},
			},
			{
				id: "COMMANDERLUKESKYWALKER",
				target: {
					id: "Raids",
					spd: 100,
					pot: 25,
					phys: 25,
				},
			},
		],
	},
	{
		id: "Cad T6 (Fatal based)",
		category: "Raid - Krayt Dragon",
		selectedCharacters: [
			{
				id: "CADBANE",
				target: {
					id: "Cad T6 (Fatal based)",
					desc: "Krayt",
					spd: 100,
					setRes: {
						"Speed %": 1,
					},
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 310,
							maximum: 325,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
					],
				},
			},
			{
				id: "BOUSHH",
				target: {
					id: "Krayt",
					spd: 100,
					spec: 100,
					setRes: {
						"Offense %": 1,
					},
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 311,
							maximum: 100000000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
						{
							id: "SpecialDamage-1",
							stat: "Special Damage",
							type: "+",
							minimum: 15000,
							maximum: 100000000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
					],
				},
			},
			{
				id: "KRRSANTAN",
				target: {
					id: "Krayt",
					spd: 45,
					pot: 30,
					phys: 32,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 289,
							maximum: 100000000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
						{
							id: "Potency-1",
							stat: "Potency",
							type: "+",
							minimum: 100,
							maximum: 100000000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
					],
				},
			},
			{
				id: "BOBAFETT",
				target: {
					id: "Krayt",
					spd: 100,
					phys: 95,
					primaryRes: {
						arrow: "Offense %",
						triangle: "Critical Damage %",
						cross: "Offense %",
					},
					setRes: {
						"Critical Damage %": 1,
						"Health %": 1,
					},
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 266,
							maximum: 100000000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
					],
				},
			},
			{
				id: "GREEDO",
				target: {
					id: "Krayt",
					primaryRes: {
						cross: "Potency %",
					},
					setRes: {
						"Potency %": 2,
					},
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 224,
							maximum: 224,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
						{
							id: "Potency-1",
							stat: "Potency",
							type: "+",
							minimum: 97,
							maximum: 100000000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
					],
				},
			},
		],
	},
	{
		id: "Naboo-QA",
		category: "Raid - Naboo",
		selectedCharacters: [
			{
				id: "QUEENAMIDALA",
				target: {
					id: "Naboo-QA",
					desc: "Naboo Raid with Queen Amidala, Padawan Obi-Wan and Master Qui-Gon",
					spd: 100,
					pot: 9,
					phys: 54,
					minDots: 6,
					setRes: {
						"Offense %": 1,
						"Health %": 1,
					},
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 342,
							maximum: 344,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
					],
					fullSets: true,
				},
			},
			{
				id: "MASTERQUIGON",
				target: {
					id: "Naboo-QA",
					desc: "Naboo Raid with Queen Amidala, Padawan Obi-Wan and Master Qui-Gon",
					spd: 37,
					phys: 100,
					minDots: 6,
					setRes: {
						"Offense %": 1,
					},
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: -30,
							maximum: -20,
							relativeCharacterId: "QUEENAMIDALA",
							optimizeForTarget: true,
						},
					],
					fullSets: true,
				},
			},
			{
				id: "PADAWANOBIWAN",
				target: {
					id: "Naboo-QA",
					desc: "Naboo Raid with Queen Amidala, Padawan Obi-Wan and Master Qui-Gon",
					spd: 100,
					pot: 9,
					phys: 54,
					minDots: 6,
					primaryRes: {
						triangle: "Critical Damage %",
					},
					setRes: {
						"Offense %": 1,
						"Critical Chance %": 1,
					},
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: -3,
							maximum: -1,
							relativeCharacterId: "MASTERQUIGON",
							optimizeForTarget: true,
						},
					],
					fullSets: true,
				},
			},
		],
	},
	{
		id: "Naboo-Maul/Sidious/Nute",
		category: "Raid - Naboo",
		selectedCharacters: [
			{
				id: "MAUL",
				target: {
					id: "Naboo-Maul/Sidious/Nute",
					desc: "Naboo Raid with Darth Maul, Darth Sidious and Nute Gunray",
					spd: 30,
					cd: 20,
					phys: 32,
					cc: 56,
					minDots: 6,
					primaryRes: {
						arrow: "Offense %",
						triangle: "Critical Damage %",
						cross: "Offense %",
					},
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 260,
							maximum: 260,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
						{
							id: "Physical Damage-1",
							stat: "Physical Damage",
							type: "+",
							minimum: 9000,
							maximum: 9100,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
						{
							id: "Physical Critical Chance-1",
							stat: "Physical Critical Chance",
							type: "+",
							minimum: 120,
							maximum: 125,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
					],
					fullSets: true,
				},
			},
			{
				id: "DARTHSIDIOUS",
				target: {
					id: "Naboo-Maul/Sidious/Nute",
					desc: "Naboo Raid with Darth Maul, Darth Sidious and Nute Gunray",
					health: 10,
					prot: 6,
					spd: 68,
					cd: 52,
					pot: 25,
					phys: 10,
					cc: 4,
					minDots: 6,
					primaryRes: {
						triangle: "Critical Damage %",
					},
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 304,
							maximum: 304,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
						{
							id: "Physical Damage-1",
							stat: "Physical Damage",
							type: "+",
							minimum: 8500,
							maximum: 8600,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
						{
							id: "Physical Critical Chance-1",
							stat: "Physical Critical Chance",
							type: "+",
							minimum: 90,
							maximum: 93,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
						{
							id: "Potency-1",
							stat: "Potency",
							type: "+",
							minimum: 90,
							maximum: 93,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
					],
					fullSets: true,
				},
			},
			{
				id: "NUTEGUNRAY",
				target: {
					id: "Naboo-Maul/Sidious/Nute",
					desc: "Naboo Raid with Darth Maul, Darth Sidious and Nute Gunray",
					spd: 100,
					pot: 16,
					minDots: 6,
					targetStats: [
						{
							id: "Potency-1",
							stat: "Potency",
							type: "+",
							minimum: 100,
							maximum: 105,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
					],
					fullSets: true,
				},
			},
		],
	},
	{
		id: "Naboo-KB (R8)",
		category: "Raid - Naboo",
		selectedCharacters: [
			{
				id: "KELLERANBEQ",
				target: {
					id: "Naboo-KB (R8)",
					desc: "Naboo Raid with Kelleran Beq, Ki-Adi-Mundi, Mace Windu, Grand Master Yoda and Shaak Ti",
					health: 10,
					prot: 63,
					spd: 100,
					minDots: 6,
					primaryRes: {
						arrow: "Protection %",
						triangle: "Protection %",
						circle: "Protection %",
						cross: "Protection %",
					},
					targetStats: [
						{
							id: "Protection1-1",
							stat: "Protection",
							type: "+",
							minimum: 140000,
							maximum: 150000,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 330,
							maximum: 350,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
					],
					fullSets: true,
				},
			},
			{
				id: "SHAAKTI",
				target: {
					id: "Naboo-KB (R8)",
					desc: "Naboo Raid with Kelleran Beq, Ki-Adi-Mundi, Mace Windu, Grand Master Yoda and Shaak Ti",
					health: 28,
					spd: 100,
					minDots: 6,
					fullSets: true,
				},
			},
			{
				id: "GRANDMASTERYODA",
				target: {
					id: "Naboo-KB (R8)",
					desc: "Naboo Raid with Kelleran Beq, Ki-Adi-Mundi, Mace Windu, Grand Master Yoda and Shaak Ti",
					health: 51,
					spd: 100,
					cc: 4,
					minDots: 6,
					setRes: {
						"Health %": 3,
					},
					fullSets: true,
				},
			},
			{
				id: "KIADIMUNDI",
				target: {
					id: "Naboo-KB (R8)",
					desc: "Naboo Raid with Kelleran Beq, Ki-Adi-Mundi, Mace Windu, Grand Master Yoda and Shaak Ti",
					spd: 26,
					cd: 100,
					phys: 66,
					minDots: 6,
					primaryRes: {
						arrow: "Offense %",
						triangle: "Offense %",
						cross: "Offense %",
					},
					targetStats: [
						{
							id: "PhysicalDamage-1",
							stat: "Physical Damage",
							type: "+",
							minimum: 12700,
							maximum: 12800,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 280,
							maximum: 285,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
					],
					fullSets: true,
				},
			},
			{
				id: "MACEWINDU",
				target: {
					id: "Naboo-KB (R8)",
					desc: "Naboo Raid with Kelleran Beq, Ki-Adi-Mundi, Mace Windu, Grand Master Yoda and Shaak Ti",
					health: 21,
					spd: 53,
					pot: 15,
					phys: 100,
					minDots: 6,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 270,
							maximum: 275,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
					],
					fullSets: true,
				},
			},
		],
	},
	{
		id: "50 Shards of KAM",
		category: "TB - LS Geonosis",
		selectedCharacters: [
			{
				id: "CT210408",
				target: {
					id: "50 KAM",
					spd: 40,
					cd: 100,
					phys: 100,
					cc: 25,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 180,
							maximum: 200,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
						{
							id: "PhysicalDamage-1",
							stat: "Physical Damage",
							type: "+",
							minimum: 7500,
							maximum: 100000000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
						{
							id: "SpecialDamage-1",
							stat: "Special Damage",
							type: "+",
							minimum: 11000,
							maximum: 100000000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
					],
				},
			},
			{
				id: "SHAAKTI",
				target: {
					id: "50 KAM",
					health: 25,
					spd: 100,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 315,
							maximum: 340,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
						{
							id: "Health-1",
							stat: "Health",
							type: "+",
							minimum: 80000,
							maximum: 100000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
					],
				},
			},
			{
				id: "CT7567",
				target: {
					id: "50 KAM",
					health: 10,
					spd: 100,
					phys: 30,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 300,
							maximum: 315,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
						{
							id: "Health-1",
							stat: "Health",
							type: "+",
							minimum: 60000,
							maximum: 70000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
					],
				},
			},
			{
				id: "ARCTROOPER501ST",
				target: {
					id: "50 KAM",
					spd: 100,
					phys: 60,
					cc: 10,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 280,
							maximum: 310,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
						{
							id: "PhysicalDamage-1",
							stat: "Physical Damage",
							type: "+",
							minimum: 10000,
							maximum: 100000000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
					],
				},
			},
			{
				id: "CT5555",
				target: {
					id: "50 KAM",
					health: 30,
					spd: 50,
					phys: 25,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 215,
							maximum: 240,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
						{
							id: "Health-1",
							stat: "Health",
							type: "+",
							minimum: 95000,
							maximum: 100000000,
							relativeCharacterId: "null",
							optimizeForTarget: false,
						},
					],
				},
			},
		],
	},
	{
		id: "KAM Mission",
		category: "TB - LS Geonosis",
		selectedCharacters: [
			{
				id: "SHAAKTI",
				target: {
					id: "Default",
					health: 25,
					prot: 25,
					spd: 100,
				},
			},
			{
				id: "CT7567",
				target: {
					id: "Default",
					health: 10,
					spd: 100,
					pot: 10,
					ten: 20,
				},
			},
			{
				id: "ARCTROOPER501ST",
				target: {
					id: "Default",
					spd: 80,
					cd: 25,
					phys: 100,
					cc: 10,
				},
			},
			{
				id: "CT210408",
				target: {
					id: "Default",
					spd: 50,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "CT5555",
				target: {
					id: "Default",
					health: 30,
					prot: 30,
					spd: 50,
					pot: 15,
					phys: 25,
				},
			},
		],
	},
	{
		id: "Bounty Hunters, Bossk Lead",
		category: "PvP",
		selectedCharacters: [
			{
				id: "BOSSK",
				target: {
					id: "Leader",
					health: 10,
					prot: 10,
					spd: 100,
					pot: 10,
					ten: 25,
				},
			},
			{
				id: "BOBAFETT",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "DENGAR",
				target: {
					id: "Default",
					spd: 100,
					pot: 50,
					phys: 25,
					cc: 75,
				},
			},
			{
				id: "ZAMWESELL",
				target: {
					id: "Default",
					spd: 100,
					cd: 40,
					pot: 50,
					phys: 25,
					cc: 40,
				},
			},
			{
				id: "CADBANE",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
		],
	},
	{
		id: "Bounty Hunters, Jango Lead",
		category: "PvP",
		selectedCharacters: [
			{
				id: "BOSSK",
				target: {
					id: "Non-leader",
					health: 10,
					spd: 100,
					pot: 10,
					ten: 25,
				},
			},
			{
				id: "JANGOFETT",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "BOBAFETT",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "DENGAR",
				target: {
					id: "Default",
					spd: 100,
					pot: 50,
					phys: 25,
					cc: 75,
				},
			},
			{
				id: "ZAMWESELL",
				target: {
					id: "Default",
					spd: 100,
					cd: 40,
					pot: 50,
					phys: 25,
					cc: 40,
				},
			},
		],
	},
	{
		id: "CLS Rebels",
		category: "PvP",
		selectedCharacters: [
			{
				id: "COMMANDERLUKESKYWALKER",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 25,
					cc: 50,
				},
			},
			{
				id: "CHEWBACCALEGENDARY",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "R2D2_LEGENDARY",
				target: {
					id: "Default",
					health: 5,
					prot: 5,
					spd: 100,
					pot: 25,
					ten: 10,
					cc: 25,
				},
			},
			{
				id: "HANSOLO",
				target: {
					id: "Fast Han",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "C3POLEGENDARY",
				target: {
					id: "Speedy debuffer",
					spd: 100,
					pot: 25,
				},
			},
		],
	},
	{
		id: "CLS w/ Chaze",
		category: "PvP",
		selectedCharacters: [
			{
				id: "COMMANDERLUKESKYWALKER",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 25,
					cc: 50,
				},
			},
			{
				id: "CHEWBACCALEGENDARY",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "HANSOLO",
				target: {
					id: "Fast Han",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "CHIRRUTIMWE",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					ten: 20,
					phys: 25,
					cc: 50,
				},
			},
			{
				id: "BAZEMALBUS",
				target: {
					id: "Slow Tank",
					health: 50,
					prot: 50,
					pot: 10,
					ten: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
		],
	},
	{
		id: "Carth Scoundrels",
		category: "PvP",
		selectedCharacters: [
			{
				id: "CARTHONASI",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "CANDEROUSORDO",
				target: {
					id: "PvE",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "MISSIONVAO",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 75,
					cc: 50,
				},
			},
			{
				id: "ZAALBAR",
				target: {
					id: "Default",
					health: 50,
					prot: 50,
					spd: 25,
					pot: 25,
					ten: 50,
					ca: 50,
				},
			},
			{
				id: "JUHANI",
				target: {
					id: "Tank",
					health: 50,
					prot: 25,
					spd: 100,
					pot: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
		],
	},
	{
		id: "DR w/ GMY",
		category: "PvP",
		selectedCharacters: [
			{
				id: "GRANDMASTERYODA",
				target: {
					id: "Speedy",
					spd: 100,
					cd: 50,
					pot: 25,
					spec: 80,
					cc: 25,
				},
			},
			{
				id: "DARTHREVAN",
				target: {
					id: "Default",
					spd: 100,
					cd: 50,
					pot: 10,
					spec: 15,
					cc: 10,
				},
			},
			{
				id: "BASTILASHANDARK",
				target: {
					id: "7-star",
					spd: 100,
					spec: 5,
				},
			},
			{
				id: "HK47",
				target: {
					id: "Default",
					spd: 100,
					cd: 75,
					phys: 50,
					cc: 25,
				},
			},
			{
				id: "SITHTROOPER",
				target: {
					id: "DR Lead",
					health: 25,
					prot: 50,
					spd: 15,
					ten: 15,
				},
			},
		],
	},
	{
		id: "DR w/ Malak",
		category: "PvP",
		selectedCharacters: [
			{
				id: "DARTHREVAN",
				target: {
					id: "Default",
					spd: 100,
					cd: 50,
					pot: 10,
					spec: 15,
					cc: 10,
				},
			},
			{
				id: "BASTILASHANDARK",
				target: {
					id: "7-star",
					spd: 100,
					spec: 5,
				},
			},
			{
				id: "DARTHMALAK",
				target: {
					id: "Default",
					health: 15,
					prot: 25,
					spd: 100,
					cd: 10,
					pot: 10,
					phys: 10,
					cc: 10,
				},
			},
			{
				id: "HK47",
				target: {
					id: "Default",
					spd: 100,
					cd: 75,
					phys: 50,
					cc: 25,
				},
			},
			{
				id: "SITHTROOPER",
				target: {
					id: "DR Lead",
					health: 25,
					prot: 50,
					spd: 15,
					ten: 15,
				},
			},
		],
	},
	{
		id: "DR w/o Malak",
		category: "PvP",
		selectedCharacters: [
			{
				id: "DARTHREVAN",
				target: {
					id: "Default",
					spd: 100,
					cd: 50,
					pot: 10,
					spec: 15,
					cc: 10,
				},
			},
			{
				id: "BASTILASHANDARK",
				target: {
					id: "7-star",
					spd: 100,
					spec: 5,
				},
			},
			{
				id: "SITHMARAUDER",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "HK47",
				target: {
					id: "Default",
					spd: 100,
					cd: 75,
					phys: 50,
					cc: 25,
				},
			},
			{
				id: "SITHTROOPER",
				target: {
					id: "DR Lead",
					health: 25,
					prot: 50,
					spd: 15,
					ten: 15,
				},
			},
		],
	},
	{
		id: "EP-led Empire",
		category: "PvP",
		selectedCharacters: [
			{
				id: "VADER",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "SHORETROOPER",
				target: {
					id: "Speedy Tank",
					health: 50,
					prot: 50,
					spd: 100,
					ten: 25,
				},
			},
			{
				id: "EMPERORPALPATINE",
				target: {
					id: "Default",
					spd: 100,
					pot: 25,
					spec: 50,
				},
			},
			{
				id: "TIEFIGHTERPILOT",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "GRANDMOFFTARKIN",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 15,
					spec: 15,
					cc: 50,
				},
			},
		],
	},
	{
		id: "Ewoks",
		category: "PvP",
		selectedCharacters: [
			{
				id: "WICKET",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "CHIEFCHIRPA",
				target: {
					id: "Speed",
					spd: 100,
				},
			},
			{
				id: "EWOKELDER",
				target: {
					id: "Default",
					health: 25,
					spd: 100,
					ten: 20,
				},
			},
			{
				id: "LOGRAY",
				target: {
					id: "Default",
					spd: 100,
					pot: 25,
					ten: 20,
				},
			},
			{
				id: "PAPLOO",
				target: {
					id: "Fast Tank",
					health: 25,
					prot: 25,
					spd: 100,
					ten: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
		],
	},
	{
		id: "GAS 501st",
		category: "PvP",
		selectedCharacters: [
			{
				id: "CT7567",
				target: {
					id: "Default",
					health: 10,
					spd: 100,
					pot: 10,
					ten: 20,
				},
			},
			{
				id: "GENERALSKYWALKER",
				target: {
					id: "PvP - Defense",
					health: 10,
					prot: 25,
					spd: 100,
					pot: 20,
					phys: 10,
					arm: 10,
					res: 10,
				},
			},
			{
				id: "ARCTROOPER501ST",
				target: {
					id: "Default",
					spd: 80,
					cd: 25,
					phys: 100,
					cc: 10,
				},
			},
			{
				id: "CT210408",
				target: {
					id: "Default",
					spd: 50,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "CT5555",
				target: {
					id: "Default",
					health: 30,
					prot: 30,
					spd: 50,
					pot: 15,
					phys: 25,
				},
			},
		],
	},
	{
		id: "GG Lead",
		category: "PvP",
		selectedCharacters: [
			{
				id: "GRIEVOUS",
				target: {
					id: "Default",
					health: 100,
					spd: 80,
					cd: 80,
				},
			},
			{
				id: "B1BATTLEDROIDV2",
				target: {
					id: "Default",
					spd: 100,
					pot: 25,
					phys: 75,
				},
			},
			{
				id: "DROIDEKA",
				target: {
					id: "Default",
					health: 5,
					prot: 5,
					spd: 50,
					ten: 10,
					phys: 100,
					cc: 25,
					arm: 20,
					res: 20,
				},
			},
			{
				id: "B2SUPERBATTLEDROID",
				target: {
					id: "Survival",
					health: 50,
					prot: 50,
					pot: 50,
					ten: 25,
					acc: 50,
				},
			},
			{
				id: "MAGNAGUARD",
				target: {
					id: "Balanced",
					health: 20,
					prot: 20,
					spd: 100,
					cd: 25,
					pot: 50,
					ten: 25,
					phys: 25,
					cc: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
		],
	},
	{
		id: "GG Nuke",
		category: "PvP",
		selectedCharacters: [
			{
				id: "GRIEVOUS",
				target: {
					id: "Nuke",
					health: 100,
					cd: 80,
					primaryRes: {
						triangle: "Critical Damage %",
					},
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 210,
							maximum: 220,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
					],
				},
			},
			{
				id: "T3_M4",
				target: {
					id: "Nuke",
					health: 10,
					prot: 50,
					spd: 100,
					pot: 25,
					ten: 10,
					cc: 10,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 1,
							maximum: 5,
							relativeCharacterId: "GRIEVOUS",
							optimizeForTarget: true,
						},
					],
				},
			},
			{
				id: "IG88",
				target: {
					id: "Nuke",
					spd: 100,
					cd: 25,
					pot: 50,
					phys: 25,
					cc: 75,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 1,
							maximum: 5,
							relativeCharacterId: "T3_M4",
							optimizeForTarget: true,
						},
					],
				},
			},
			{
				id: "IMPERIALPROBEDROID",
				target: {
					id: "Nuke",
					health: 50,
					prot: 50,
					spd: 100,
					pot: 25,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 1,
							maximum: 5,
							relativeCharacterId: "IG88",
							optimizeForTarget: true,
						},
					],
				},
			},
			{
				id: "BB8",
				target: {
					id: "Tanky",
					health: 5,
					prot: 25,
					spd: 100,
					ten: 10,
				},
			},
		],
	},
	{
		id: "Geonosians",
		category: "PvP",
		selectedCharacters: [
			{
				id: "GEONOSIANBROODALPHA",
				target: {
					id: "Tanky",
					health: 20,
					prot: 20,
					spd: 100,
					ten: 20,
				},
			},
			{
				id: "GEONOSIANSPY",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "GEONOSIANSOLDIER",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "SUNFAC",
				target: {
					id: "Tanky",
					health: 40,
					prot: 40,
					spd: 100,
					pot: 25,
					ten: 25,
					arm: 12.5,
					res: 12.5,
				},
			},
			{
				id: "POGGLETHELESSER",
				target: {
					id: "PvE",
					spd: 100,
					pot: 25,
				},
			},
		],
	},
	{
		id: "Imperial Troopers",
		category: "PvP",
		selectedCharacters: [
			{
				id: "COLONELSTARCK",
				target: {
					id: "Default",
					spd: 100,
					cd: 10,
					pot: 5,
					phys: 5,
					cc: 5,
				},
			},
			{
				id: "VEERS",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					pot: 25,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "RANGETROOPER",
				target: {
					id: "Default",
					spd: 100,
					cd: 100,
					phys: 50,
					cc: 50,
				},
			},
			{
				id: "DEATHTROOPER",
				target: {
					id: "Damage",
					spd: 80,
					cd: 100,
					pot: 25,
					phys: 25,
					cc: 25,
				},
			},
			{
				id: "SNOWTROOPER",
				target: {
					id: "Default",
					cd: 100,
					phys: 50,
					cc: 25,
				},
			},
		],
	},
	{
		id: "JKA Nuke",
		category: "PvP",
		selectedCharacters: [
			{
				id: "CT7567",
				target: {
					id: "Default",
					health: 10,
					spd: 100,
					pot: 10,
					ten: 20,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "+",
							minimum: 282,
							maximum: 300,
							relativeCharacterId: "null",
							optimizeForTarget: true,
						},
					],
				},
			},
			{
				id: "ANAKINKNIGHT",
				target: {
					id: "Nuke",
					cd: 100,
					pot: 20,
					phys: 40,
					cc: 25,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "*",
							minimum: 88,
							maximum: 90,
							relativeCharacterId: "CT7567",
							optimizeForTarget: true,
						},
					],
				},
			},
			{
				id: "SHAAKTI",
				target: {
					id: "Nuke",
					health: 25,
					prot: 25,
					spd: 50,
					targetStats: [
						{
							id: "Speed-1",
							stat: "Speed",
							type: "*",
							minimum: 85,
							maximum: 86,
							relativeCharacterId: "CT7567",
							optimizeForTarget: true,
						},
					],
				},
			},
			{
				id: "CT5555",
				target: {
					id: "Default",
					health: 30,
					prot: 30,
					spd: 50,
					pot: 15,
					phys: 25,
				},
			},
			{
				id: "CT210408",
				target: {
					id: "Nuke",
					spd: 50,
					cd: 100,
					phys: 75,
					cc: 25,
				},
			},
		],
	},
	{
		id: "JKR",
		category: "PvP",
		selectedCharacters: [
			{
				id: "JEDIKNIGHTREVAN",
				target: {
					id: "Default",
					spd: 100,
					cd: 50,
					spec: 10,
				},
			},
			{
				id: "GRANDMASTERYODA",
				target: {
					id: "Offense",
					spd: 50,
					cd: 100,
					spec: 100,
					cc: 25,
				},
			},
			{
				id: "BASTILASHAN",
				target: {
					id: "JKR Lead",
					spd: 100,
					spec: 50,
				},
			},
			{
				id: "JOLEEBINDO",
				target: {
					id: "Healer",
					health: 30,
					spd: 100,
					ten: 50,
				},
			},
			{
				id: "GENERALKENOBI",
				target: {
					id: "Balanced",
					health: 50,
					prot: 100,
					spd: 50,
					ten: 50,
					arm: 25,
					res: 25,
				},
			},
		],
	},
	{
		id: "JKR w/ HY",
		category: "PvP",
		selectedCharacters: [
			{
				id: "JEDIKNIGHTREVAN",
				target: {
					id: "Default",
					spd: 100,
					cd: 50,
					spec: 10,
				},
			},
			{
				id: "HERMITYODA",
				target: {
					id: "Speed",
					spd: 100,
				},
			},
		],
	},
] as const satisfies ShortCharacterTemplates;

export { defaultTemplates };
