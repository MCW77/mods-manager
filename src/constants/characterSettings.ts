// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import optimizationStrategy from "#/constants/optimizationStrategy";

import {
	createCharacterSettings,
	DamageType,
	type CharacterSettingsIndexer,
} from "#/domain/CharacterSettings";
import {
	fromShortOptimizationPlan,
	toRenamed,
} from "#/domain/OptimizationPlan";
import { createTargetStat } from "#/domain/TargetStat";

const characterSettings: CharacterSettingsIndexer = {
	"50RT": createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 20,
			prot: 10,
			spd: 100,
			pot: 20,
			arm: 25,
		}),
	]),
	AAYLASECURA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			pot: 75,
			phys: 10,
			cc: 100,
		}),
		fromShortOptimizationPlan({
			id: "hSTR P1 Jedi",
			prot: -5,
			spd: 100,
			cd: 75,
			phys: 50,
		}),
	]),
	ADMINISTRATORLANDO: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 50,
			phys: 25,
			cc: 75,
		}),
	]),
	ADMIRALACKBAR: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Survivability",
				health: 20,
				prot: 20,
				spd: 100,
				ten: 25,
			}),
			optimizationStrategy.Speed,
		],
		["AA", "Snackbar", "ABC"],
	),
	ADMIRALPIETT: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 25,
			pot: 15,
			phys: 10,
			cc: 10,
		}),
	]),
	ADMIRALRADDUS: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				prot: 10,
				spd: 100,
				spec: 10,
			}),
			fromShortOptimizationPlan({
				id: "Protection",
				health: 10,
				prot: 20,
				spd: 100,
				spec: 10,
				minDots: 5,
				primaryRes: {
					triangle: "Protection %",
					cross: "Protection %",
					circle: "Protection %",
				},
			}),
			fromShortOptimizationPlan({
				id: "Health",
				health: 20,
				prot: 10,
				spd: 100,
				spec: 10,
				minDots: 5,
				primaryRes: {
					triangle: "Health %",
					cross: "Health %",
					circle: "Health %",
				},
			}),
		],
		[],
		DamageType.special,
	),
	AHSOKATANO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				spd: 100,
				cd: 50,
				phys: 25,
				cc: 10,
				primaryRes: {
					triangle: "Critical Damage %",
					cross: "Offense %",
					circle: "Health %",
				},
			}),
			fromShortOptimizationPlan({
				id: "Padme Lead",
				health: 10,
				spd: 100,
				cd: 100,
				phys: 50,
				cc: 25,
			}),
			fromShortOptimizationPlan({
				id: "Slow Damage",
				health: 25,
				cd: 100,
				phys: 50,
				cc: 25,
			}),
		],
		["Snips"],
	),
	AMILYNHOLDO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				prot: 10,
				spd: 100,
				pot: 50,
				ten: 25,
				arm: 5,
				res: 5,
			}),
		],
		["Hodor"],
		DamageType.mixed,
	),
	ANAKINKNIGHT: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 75,
				pot: 25,
				phys: 25,
				cc: 80,
			}),
			fromShortOptimizationPlan({
				id: "Padme Lead",
				health: 10,
				spd: 80,
				cd: 100,
				pot: 25,
				phys: 25,
				cc: 40,
			}),
			fromShortOptimizationPlan({
				id: "oQGJ Lead",
				spd: 100,
				cd: 100,
				pot: 10,
				phys: 25,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "Chex Mix",
				spd: 50,
				phys: 100,
				cc: 25,
			}),
			fromShortOptimizationPlan({
				id: "hSTR P1 Jedi",
				prot: -5,
				spd: 20,
				cd: 100,
				phys: 50,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "Slow Damage",
				health: 25,
				cd: 100,
				pot: 25,
				phys: 25,
				cc: 40,
			}),
			fromShortOptimizationPlan({
				id: "Nuke",
				cd: 100,
				pot: 20,
				phys: 40,
				cc: 25,
			}),
		],
		["JKA"],
	),
	APPO: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 20,
			spd: 50,
			phys: 30,
			primaryRes: {
				triangle: "Critical Damage %",
				circle: "Health %",
			},
		}),
	]),
	ARCTROOPER501ST: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			phys: 50,
			cc: 15,
		}),
		fromShortOptimizationPlan({
			id: "KAM",
			health: 10,
			spd: 100,
			phys: 50,
		}),
		fromShortOptimizationPlan({
			id: "KAM/CA",
			health: 10,
			spd: 100,
			phys: 50,
			ca: 100,
		}),
	]),
	ARMORER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			prot: 10,
			spd: 100,
			ten: 5,
		}),
	]),
	ASAJVENTRESS: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				pot: 25,
				phys: 10,
				spec: 10,
				cc: 20,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 4",
				cd: 100,
				phys: 25,
				spec: 25,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 3",
				health: 15,
				spd: 50,
				cd: 100,
				phys: 30,
				spec: 25,
			}),
		],
		["AV", "Zen", "NS", "hSTR NS", "ABC"],
		DamageType.mixed,
	),
	AURRA_SING: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 80,
			pot: 20,
			phys: 50,
			cc: 25,
		}),
		fromShortOptimizationPlan({
			id: "hSTR Phase 3",
			spd: 75,
			cd: 100,
			phys: 50,
			cc: 10,
		}),
	]),
	BADBATCHECHO: createCharacterSettings([
		toRenamed(optimizationStrategy["Speedy debuffer"], "Default"),
	]),
	BADBATCHHUNTER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			pot: 15,
			phys: 25,
		}),
	]),
	BADBATCHOMEGA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 50,
			pot: 25,
			phys: 100,
		}),
	]),
	BADBATCHTECH: createCharacterSettings(
		[toRenamed(optimizationStrategy["Speedy debuffer"], "Default")],
		[],
		DamageType.special,
	),
	BADBATCHWRECKER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			prot: 30,
			spd: 100,
			pot: 15,
		}),
	]),
	BATCHERS3: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 30,
			cc: 10,
			cd: 50,
			phys: 20,
			pot: 10,
			primaryRes: {
				arrow: "Speed",
				triangle: "Critical Damage %",
				cross: "Potency %",
			},
			setRes: {
				"Critical Chance %": 1,
				"Offense %": 1,
			},
		}),
	]),
	B1BATTLEDROIDV2: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			pot: 25,
			phys: 75,
		}),
	]),
	B2SUPERBATTLEDROID: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Survival",
			health: 50,
			prot: 50,
			pot: 50,
			ten: 25,
			acc: 50,
		}),
		fromShortOptimizationPlan({
			id: "Tenacity",
			health: 50,
			prot: 50,
			pot: 50,
			ten: 100,
			ca: 100,
		}),
		fromShortOptimizationPlan({
			id: "Potency",
			health: 50,
			prot: 50,
			pot: 100,
			ten: 50,
			ca: 190,
		}),
	]),
	BARRISSOFFEE: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 70,
			spd: 50,
		}),
		fromShortOptimizationPlan({
			id: "hSTR P1 Jedi",
			health: 75,
			spd: 100,
		}),
	]),
	BASTILASHAN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Leader",
				health: 10,
				spd: 100,
				pot: 50,
				spec: 25,
			}),
			toRenamed(
				optimizationStrategy["Special Damage with Potency"],
				"Non-leader",
			),
			toRenamed(optimizationStrategy["Special Damage"], "JKR Lead"),
			fromShortOptimizationPlan({
				id: "hSTR P2 Jedi",
				spd: 100,
				cd: 50,
				spec: 25,
				cc: 50,
			}),
		],
		[],
		DamageType.special,
	),
	BASTILASHANDARK: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				spd: 100,
			}),
			fromShortOptimizationPlan({
				id: "Offensive",
				spd: 100,
				cd: 50,
				pot: 5,
				spec: 25,
			}),
		],
		[],
		DamageType.special,
	),
	BAYLANSKOLL: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			prot: 20,
			spd: 100,
		}),
	]),
	BAZEMALBUS: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 50,
				spd: 100,
				ten: 25,
				arm: 12.5,
				res: 12.5,
				primaryRes: {
					arrow: "Speed",
					triangle: "Health %",
					circle: "Health %",
					cross: "Health %",
				},
			}),
			fromShortOptimizationPlan({
				id: "Default Slow",
				health: 50,
				spd: 20,
				ten: 25,
				arm: 12.5,
				res: 12.5,
				primaryRes: {
					arrow: "Speed",
					triangle: "Health %",
					circle: "Health %",
					cross: "Health %",
				},
			}),
			fromShortOptimizationPlan({
				id: "Slow Tank",
				health: 50,
				prot: 50,
				pot: 10,
				ten: 25,
				arm: 12.5,
				res: 12.5,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 4",
				health: 10,
				prot: 10,
				spd: -100,
			}),
		],
		["Rogue 1", "Chaze", "Chiggs"],
	),
	BB8: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				prot: 5,
				spd: 100,
				ten: 10,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 1",
				health: 10,
				prot: -5,
				spd: 100,
				phys: 25,
			}),
			optimizationStrategy.Speed,
			fromShortOptimizationPlan({
				id: "Tanky",
				health: 5,
				prot: 25,
				spd: 100,
				ten: 10,
			}),
		],
		["bb8", "Wampanader", "ABC"],
	),
	BENSOLO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				spd: 100,
				pot: 10,
				spec: 70,
			}),
		],
		[],
		DamageType.special,
	),
	BIGGSDARKLIGHTER: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, and Physical Damage"],
				"Default",
			),
		],
		["Wiggs", "Chiggs"],
	),
	BISTAN: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
		],
		["Rogue 1", "SuperStar2D2"],
	),
	BOBAFETT: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 50,
			cd: 100,
			pot: 25,
			phys: 50,
			cc: 50,
		}),
		toRenamed(
			optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
			"Speedy",
		),
		fromShortOptimizationPlan({
			id: "hSTR Phase 2",
			spd: 100,
			cd: 75,
			phys: 25,
			cc: 50,
		}),
		fromShortOptimizationPlan({
			id: "hSTR Phase 3",
			cd: 50,
			phys: 100,
			cc: 25,
		}),
		fromShortOptimizationPlan({
			id: "hSTR Phase 3 Greedo",
			spd: 20,
			phys: 100,
		}),
	]),
	BOBAFETTSCION: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 100,
			pot: 25,
			phys: 50,
			cc: 50,
		}),
	]),
	BODHIROOK: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				prot: 10,
				spd: 100,
				pot: 50,
			}),
		],
		["Rogue 1"],
	),
	BOKATAN: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 100,
			pot: 25,
			phys: 10,
			cc: 50,
		}),
	]),
	BOOMADIER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 50,
			prot: 3,
			spd: 100,
			cd: 9,
			pot: 3,
			ten: 10,
			phys: 25,
			spec: 10,
			arm: 2,
			res: 2,
			acc: 3,
			ca: 3,
		}),
	]),
	BOSSK: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Leader",
			health: 10,
			prot: 10,
			spd: 100,
			pot: 10,
			ten: 25,
		}),
		fromShortOptimizationPlan({
			id: "Non-leader",
			health: 10,
			spd: 100,
			pot: 10,
			ten: 25,
		}),
	]),
	BOSSNASS: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 4,
			prot: 22,
			spd: 100,
			pot: 28,
			ten: 15,
			phys: 2,
			spec: 3,
			cc: 2,
			arm: 2,
			res: 2,
		}),
	]),
	BOUSHH: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				spd: 100,
				pot: 10,
				spec: 20,
				primaryRes: {
					arrow: "Speed",
					triangle: "Critical Damage %",
					cross: "Offense %",
				},
				setRes: {
					"Speed %": 1,
					"Health %": 1,
				},
			}),
		],
		[],
		DamageType.special,
	),
	BT1: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 100,
			pot: 5,
			phys: 80,
			cc: 10,
		}),
		fromShortOptimizationPlan({
			id: "Default w/ Primaries",
			spd: 100,
			cd: 50,
			pot: 5,
			phys: 50,
			cc: 10,
			primaryRes: {
				arrow: "Offense %",
				triangle: "Critical Damage %",
				cross: "Offense %",
			},
		}),
	]),
	C3POCHEWBACCA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 80,
			pot: 10,
			phys: 50,
			cc: 25,
		}),
	]),
	C3POLEGENDARY: createCharacterSettings([
		toRenamed(optimizationStrategy["Speedy debuffer"], "Default"),
		optimizationStrategy.Speed,
		fromShortOptimizationPlan({
			id: "hSTR Phase 1",
			spd: 100,
			pot: 50,
		}),
		fromShortOptimizationPlan({
			id: "Anti-Malak",
			health: 10,
			spd: 25,
			pot: 25,
		}),
	]),
	CADBANE: createCharacterSettings([
		toRenamed(
			optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
			"Default",
		),
	]),
	CALKESTIS: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 40,
			pot: -10,
			ten: 15,
			phys: 10,
			arm: 12.5,
			res: 12.5,
			primaryRes: {
				arrow: "Health %",
				triangle: "Health %",
				cross: "Health %",
				circle: "Health %",
			},
			setRes: {
				"Health %": 2,
				"Defense %": 1,
			},
		}),
	]),
	CANDEROUSORDO: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Maul Lead",
			cd: 50,
			phys: 100,
			cc: 25,
		}),
		optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
	]),
	CAPTAINDROGAN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				spd: 100,
				pot: 10,
				ten: 10,
				spec: 70,
				cc: 20,
				primaryRes: {
					arrow: "Speed",
					triangle: "Offense %",
					cross: "Offense %",
					circle: "Health %",
				},
				setRes: {
					"Offense %": 1,
					"Health %": 1,
				},
			}),
		],
		[],
		DamageType.special,
	),
	CAPTAINENOCH: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			prot: 20,
			spd: 100,
			arm: 10,
			res: 10,
			primaryRes: {
				arrow: "Protection %",
				triangle: "Protection %",
				cross: "Protection %",
				circle: "Protection %",
			},
			setRes: {
				"Speed %": 1,
				"Defense %": 1,
			},
		}),
	]),
	CAPTAINREX: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 20,
			spd: 100,
			pot: 60,
			ten: 10,
			cc: 100,
			primaryRes: {
				arrow: "Speed",
				triangle: "Critical Chance %",
				cross: "Potency %",
				circle: "Health %",
			},
			setRes: {
				"Potency %": 1,
				"Critical Chance %": 1,
				"Health %": 1,
			},
		}),
	]),
	CAPTAINTARPALS: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 50,
			prot: 3,
			spd: 100,
			cd: 9,
			pot: 3,
			ten: 10,
			phys: 25,
			spec: 10,
			arm: 2,
			res: 2,
			acc: 3,
			ca: 3,
		}),
	]),
	CARADUNE: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			spd: 80,
			cd: 100,
			pot: 20,
			phys: 25,
		}),
		fromShortOptimizationPlan({
			id: "Mothma Lead",
			health: 10,
			prot: 10,
			spd: 100,
			pot: 20,
			ten: 20,
			phys: 5,
			arm: 5,
		}),
	]),
	CARTHONASI: createCharacterSettings([
		toRenamed(
			optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
			"Default",
		),
	]),
	CASSIANANDOR: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				prot: 20,
				spd: 100,
				pot: 50,
			}),
			fromShortOptimizationPlan({
				id: "AdRad",
				health: 10,
				prot: 20,
				spd: 100,
				pot: 25,
				spec: 10,
				primaryRes: {
					triangle: "Critical Chance %",
					cross: "Potency %",
					circle: "Protection %",
				},
			}),
		],
		["Rogue 1", "SuperStar2D2"],
		DamageType.mixed,
	),
	CC2224: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Leader",
				spd: 100,
				cd: 50,
				pot: 25,
				phys: 25,
				cc: 50,
				arm: 12.5,
				res: 12.5,
			}),
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Non-leader",
			),
		],
		["zody"],
		DamageType.mixed,
	),
	CEREJUNDA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 40,
			prot: 15,
			spd: 20,
			ten: 10,
			phys: 10,
			arm: 12.5,
			res: 12.5,
			primaryRes: {
				arrow: "Health %",
				triangle: "Health %",
				cross: "Health %",
				circle: "Health %",
			},
			setRes: {
				"Health %": 2,
				"Defense %": 1,
			},
		}),
	]),
	CHEWBACCALEGENDARY: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, and Physical Damage"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "Tenacity",
				health: 25,
				prot: 25,
				spd: 100,
				ten: 80,
				phys: 10,
			}),
			fromShortOptimizationPlan({
				id: "Chew Mix",
				phys: 100,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 3 Greedo",
				spd: 75,
				phys: 100,
			}),
		],
		["Chex Mix"],
	),
	CHIEFCHIRPA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 12,
				spd: 100,
				primaryRes: {
					triangle: "Health %",
					cross: "Health %",
					circle: "Health %",
				},
				setRes: {
					"Speed %": 1,
					"Health %": 1,
				},
			}),
			fromShortOptimizationPlan({
				id: "Speedy",
				spd: 100,
				primaryRes: {
					triangle: "Critical Chance %",
					cross: "Protection %",
					circle: "Protection %",
				},
			}),
		],
		["Murderbears"],
	),
	CHIEFNEBIT: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 50,
				spd: 100,
			}),
			fromShortOptimizationPlan({
				id: "Detonator",
				health: 60,
				prot: 60,
				spd: 100,
				arm: 50,
				ca: 25,
			}),
		],
		["nebs"],
	),
	CHIRRUTIMWE: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				ten: 20,
				phys: 25,
				cc: 50,
			}),
			toRenamed(optimizationStrategy["Speedy Chex Mix"], "Chex Mix"),
		],
		["Rogue 1", "Chaze", "Chiggs", "Chex Mix"],
	),
	CHOPPERS3: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 50,
			spd: 100,
			pot: 20,
			ten: 20,
			primaryRes: {
				arrow: "Speed",
				cross: "Tenacity %",
				circle: "Health %",
			},
			setRes: {
				"Health %": 3,
			},
		}),
	]),
	CLONESERGEANTPHASEI: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
		],
		["Sarge"],
	),
	CLONEWARSCHEWBACCA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Tanky",
				health: 50,
				prot: 50,
				spd: 100,
				ten: 25,
				arm: 12.5,
				res: 12.5,
			}),
		],
		["CWC"],
	),
	COLONELSTARCK: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 10,
				pot: 5,
				phys: 5,
				cc: 5,
			}),
		],
		["Tony Stark", "Troopers"],
	),
	COMMANDERAHSOKA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				spd: 100,
				cd: 50,
				spec: 30,
			}),
			fromShortOptimizationPlan({
				id: "Health",
				health: 10,
				spd: 100,
				spec: 10,
			}),
			fromShortOptimizationPlan({
				id: "Crit.Dmg",
				health: 5,
				spd: 25,
				cd: 100,
				spec: 30,
			}),
		],
		["CAT"],
		DamageType.special,
	),
	COMMANDERLUKESKYWALKER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				pot: 25,
				phys: 25,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "Chewpio",
				health: 10,
				prot: 10,
				spd: 100,
				pot: 10,
				ten: 50,
				phys: 50,
			}),
			toRenamed(optimizationStrategy["Speedy Chex Mix"], "Chex Mix"),
			fromShortOptimizationPlan({
				id: "Raids",
				spd: 100,
				pot: 25,
				phys: 25,
			}),
			fromShortOptimizationPlan({
				id: "Slow and Strong",
				cd: 100,
				pot: 25,
				phys: 50,
				cc: 50,
			}),
		],
		["CLS", "Wampanader", "Chex Mix", "ABC", "Titans"],
	),
	CORUSCANTUNDERWORLDPOLICE: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Why?",
				spd: 100,
				pot: 50,
			}),
		],
		["CUP"],
	),
	COUNTDOOKU: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				pot: 50,
				ten: 50,
				phys: 25,
				spec: 25,
			}),
		],
		[],
		DamageType.mixed,
	),
	CROSSHAIRS3: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 40,
			phys: 100,
			primaryRes: {
				cross: "Offense %",
				triangle: "Critical Damage %",
			},
			setRes: {
				"Offense %": 1,
				"Critical Chance %": 1,
			},
		}),
	]),
	CT5555: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 15,
			prot: 30,
			spd: 50,
			pot: 15,
			phys: 25,
		}),
		fromShortOptimizationPlan({
			id: "KAM",
			health: 30,
			prot: 15,
			spd: 70,
		}),
		fromShortOptimizationPlan({
			id: "KAM/CA",
			health: 30,
			prot: 15,
			spd: 70,
			ca: 100,
		}),
	]),
	CT7567: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				spd: 100,
				pot: 5,
				ten: 10,
			}),
			fromShortOptimizationPlan({
				id: "KAM",
				health: 10,
				spd: 100,
			}),
			toRenamed(optimizationStrategy.Speed, "Chex Mix"),
		],
		["Titans"],
	),
	CT210408: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				pot: 50,
				phys: 75,
				spec: 75,
			}),
			fromShortOptimizationPlan({
				id: "Nuke",
				spd: 50,
				cd: 100,
				phys: 75,
				spec: 75,
				cc: 25,
			}),
			fromShortOptimizationPlan({
				id: "KAM",
				health: 5,
				spd: 50,
				cd: 100,
				phys: 20,
				spec: 20,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "KAM/CA",
				health: 5,
				spd: 50,
				cd: 100,
				phys: 20,
				spec: 20,
				cc: 50,
				ca: 100,
			}),
		],
		[],
		DamageType.mixed,
	),
	DAKA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 25,
				spd: 100,
				pot: 25,
				ten: 15,
			}),
			fromShortOptimizationPlan({
				id: "Tanky",
				health: 75,
				spd: 100,
				pot: 30,
				ten: 15,
				ca: 100,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 4",
				health: 100,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 3",
				health: 50,
				spd: 75,
				pot: 15,
				phys: 5,
			}),
		],
		["NS", "hSTR NS"],
	),
	DARKREY: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 25,
			spd: 100,
			phys: 20,
			primaryRes: {
				arrow: "Speed",
				triangle: "Critical Damage %",
				circle: "Health %",
				cross: "Health %",
			},
			setRes: {
				"Speed %": 1,
				"Health %": 1,
			},
		}),
		fromShortOptimizationPlan({
			id: "Health",
			health: 25,
			spd: 100,
			phys: 20,
			primaryRes: {
				arrow: "Health %",
				triangle: "Health %",
				circle: "Health %",
				cross: "Health %",
			},
			setRes: {
				"Speed %": 1,
				"Health %": 1,
			},
		}),
	]),
	DARKTROOPER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			prot: 10,
			spd: 50,
			ten: 5,
			phys: 60,
			arm: 2.5,
			res: 2.5,
		}),
	]),
	DARTHBANE: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 50,
			prot: 3,
			spd: 100,
			cd: 9,
			pot: 3,
			ten: 10,
			phys: 25,
			spec: 10,
			arm: 2,
			res: 2,
			acc: 3,
			ca: 3,
		}),
	]),
	DARTHMALAK: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			prot: 50,
			spd: 100,
			pot: 10,
			phys: 10,
			arm: 10,
		}),
		fromShortOptimizationPlan({
			id: "Tenacity",
			prot: 50,
			spd: 100,
			pot: 10,
			ten: 100,
			phys: 10,
			arm: 10,
		}),
	]),
	DARTHMALGUS: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 50,
			prot: 10,
			spd: 100,
			arm: 20,
		}),
	]),
	DARTHNIHILUS: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 30,
				spd: 100,
				pot: 50,
				ten: 60,
			}),
			fromShortOptimizationPlan({
				id: "Tanky",
				health: 40,
				spd: 100,
				ten: 20,
				ca: 100,
			}),
		],
		["Nightmare"],
		DamageType.special,
	),
	DARTHREVAN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				spd: 100,
				cd: 50,
				pot: 5,
				spec: 10,
				cc: 5,
			}),
		],
		[],
		DamageType.special,
	),
	DARTHSIDIOUS: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				pot: 25,
				phys: 50,
			}),
		],
		["Auto Lightzader"],
	),
	DARTHSION: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 25,
				prot: 30,
				spd: 100,
				pot: 5,
				arm: 20,
			}),
			fromShortOptimizationPlan({
				id: "Default/CA",
				health: 25,
				prot: 30,
				spd: 100,
				pot: 5,
				arm: 20,
				ca: 100,
			}),
		],
		["Nightmare"],
	),
	DARTHTALON: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 15,
			prot: 25,
			spd: 100,
			phys: 50,
		}),
	]),
	DARTHTRAYA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 15,
				prot: 10,
				spd: 100,
				pot: 5,
				spec: 15,
			}),
			fromShortOptimizationPlan({
				id: "Tanky",
				health: 25,
				prot: 75,
				spd: 65,
				ten: 65,
				ca: 100,
			}),
		],
		[],
		DamageType.special,
	),
	DASHRENDAR: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			spd: 100,
			cd: 60,
			pot: 5,
			phys: 50,
			cc: 10,
		}),
	]),
	DATHCHA: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "Detonator",
				health: 100,
				prot: 100,
				arm: 80,
				ca: 100,
			}),
		],
		[],
		DamageType.mixed,
	),
	DEATHTROOPER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				pot: 25,
				phys: 25,
				cc: 25,
			}),
			fromShortOptimizationPlan({
				id: "Iden Lead",
				health: 10,
				prot: 10,
				spd: 100,
				cd: 100,
				pot: 40,
				phys: 25,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 3",
				phys: 100,
				targetStats: [createTargetStat("Speed", "+", 175, 179, "null")],
			}),
		],
		["Troopers", "Chex Mix"],
	),
	DEATHTROOPERPERIDEA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 24,
			cd: 100,
			pot: 10,
			primaryRes: {
				arrow: "Speed",
				triangle: "Critical Damage %",
				cross: "Offense %",
			},
			setRes: {
				"Critical Damage %": 1,
			},
		}),
	]),
	DENGAR: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			pot: 60,
			cc: 100,
		}),
		fromShortOptimizationPlan({
			id: "hSTR Phase 3",
			cd: 50,
			phys: 100,
			cc: 25,
		}),
	]),
	DIRECTORKRENNIC: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Special Damage, Potency"],
				"Default",
			),
		],
		["Imperial Grancor Maneuver"],
		DamageType.special,
	),
	DISGUISEDCLONETROOPER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			prot: 20,
			spd: 100,
			phys: 40,
			primaryRes: {
				arrow: "Speed",
				triangle: "Offense %",
				cross: "Protection %",
				circle: "Protection %",
			},
			setRes: {
				"Speed %": 1,
				"Health %": 1,
			},
		}),
	]),
	DOCTORAPHRA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 90,
				pot: 100,
				spec: 20,
			}),
		],
		[],
		DamageType.special,
	),
	DROIDEKA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			prot: 10,
			pot: 10,
			ten: 20,
			phys: 100,
		}),
		fromShortOptimizationPlan({
			id: "Maul Kickstarter",
			prot: 5,
			spd: 100,
			pot: 5,
			ten: 5,
			phys: 20,
		}),
	]),
	EETHKOTH: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Special Damage, Potency"],
				"Default",
			),
		],
		[],
		DamageType.mixed,
	),
	EIGHTHBROTHER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			prot: 5,
			spd: 100,
			cd: 50,
			phys: 30,
			cc: 5,
		}),
	]),
	EMBO: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			prot: 20,
			spd: 100,
			phys: 10,
		}),
		fromShortOptimizationPlan({
			id: "hSTR Phase 3",
			spd: 50,
			cd: 25,
			phys: 75,
			cc: 100,
		}),
	]),
	EMPERORPALPATINE: createCharacterSettings(
		[
			toRenamed(optimizationStrategy["Special Damage with Potency"], "Default"),
			fromShortOptimizationPlan({
				id: "Tanky",
				prot: 100,
				spd: 70,
				pot: 80,
			}),
		],
		["EP", "Palp", "EzPz", "Nightmare"],
		DamageType.special,
	),
	ENFYSNEST: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				spd: 100,
				cd: 50,
				pot: 25,
				ten: 100,
				phys: 10,
			}),
			fromShortOptimizationPlan({
				id: "Speedy",
				spd: 100,
				pot: 10,
			}),
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Offense",
			),
			fromShortOptimizationPlan({
				id: "Tenacity",
				health: 10,
				ten: 100,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 3",
				health: 25,
				phys: 100,
			}),
		],
		["Nesty", "Baby Wampa", "solo"],
		DamageType.special,
	),
	EPIXFINN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 50,
				spec: 25,
			}),
		],
		[],
		DamageType.special,
	),
	EPIXPOE: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				pot: 25,
				spec: 20,
				cc: 20,
			}),
		],
		[],
		DamageType.special,
	),
	EWOKELDER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 25,
				spd: 100,
				ten: 50,
				primaryRes: {
					triangle: "Health %",
					cross: "Tenacity %",
					circle: "Health %",
				},
				setRes: {
					"Health %": 3,
				},
			}),
		],
		["EE", "Murderbears"],
	),
	EWOKSCOUT: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 15,
				spd: 100,
				pot: 50,
				phys: 50,
				cc: 20,
				minDots: 5,
				primaryRes: {
					triangle: "Offense %",
					cross: "Potency %",
					circle: "Health %",
				},
				setRes: {
					"Offense %": 1,
					"Potency %": 1,
				},
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 2",
				spd: 50,
				cd: 100,
				phys: 50,
				cc: 25,
			}),
		],
		["Murderbears"],
	),
	EZRABRIDGERS3: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			spd: 100,
			cd: 100,
			phys: 50,
			cc: 50,
			minDots: 5,
			primaryRes: {
				triangle: "Critical Damage %",
				cross: "Offense %",
				circle: "Health %",
			},
		}),
		fromShortOptimizationPlan({
			id: "hSTR P1 Jedi",
			prot: -5,
			spd: 100,
			cd: 75,
			phys: 50,
			cc: 50,
		}),
		fromShortOptimizationPlan({
			id: "hSTR P2 Jedi",
			spd: 60,
			cd: 100,
			phys: 75,
			cc: 75,
		}),
	]),
	EZRAEXILE: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			prot: 10,
			spd: 100,
			pot: 5,
			minDots: 5,
			setRes: {
				"Speed %": 1,
				"Health %": 1,
			},
		}),
	]),
	FENNECSHAND: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Offense",
				spd: 100,
				spec: 75,
			}),
			fromShortOptimizationPlan({
				id: "Crit. Dmg",
				spd: 100,
				cd: 100,
				spec: 100,
				cc: 50,
			}),
		],
		[],
		DamageType.special,
	),
	FIFTHBROTHER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				prot: 10,
				spd: 100,
				ten: 20,
			}),
		],
		[],
		DamageType.special,
	),
	FINN: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Slow Crit, Physical Damage, Potency"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "Tanky",
				health: 30,
				prot: 100,
				spd: 100,
				pot: 5,
				ten: 5,
				phys: 50,
				arm: 10,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 1",
				prot: -5,
				spd: 80,
				cd: 100,
				phys: 50,
				cc: 75,
			}),
		],
		["Zinn"],
	),
	FIRSTORDEREXECUTIONER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 25,
				spd: 100,
				cd: 100,
				phys: 50,
				cc: 50,
			}),
		],
		["Fox", "Panda", "Foe", "FO"],
	),
	FIRSTORDEROFFICERMALE: createCharacterSettings(
		[toRenamed(optimizationStrategy.Speed, "Default", "Speed")],
		["Foo", "FO"],
	),
	FIRSTORDERSPECIALFORCESPILOT: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Mixed Damage, Potency"],
				"Default",
			),
		],
		["SFTP", "FO"],
		DamageType.mixed,
	),
	FIRSTORDERTIEPILOT: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				spd: 100,
				cd: 100,
				pot: 10,
				phys: 50,
			}),
		],
		["FOTP", "FO"],
	),
	FIRSTORDERTROOPER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 30,
				prot: 40,
				spd: 100,
				ten: 10,
				arm: 30,
			}),
		],
		["FOST", "FO"],
	),
	FOSITHTROOPER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 25,
			cd: 100,
			phys: 80,
		}),
		fromShortOptimizationPlan({
			id: "Tanky",
			health: 40,
			spd: 100,
			cd: 50,
			phys: 50,
		}),
	]),
	FULCRUMAHSOKA: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, and Physical Damage"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "Omicron",
				health: 10,
				spd: 50,
				cd: 100,
				ten: -30,
				phys: 75,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "Omicron w/ Primaries",
				health: 10,
				spd: 50,
				ten: -30,
				phys: 100,
				cc: 50,
				minDots: 5,
				primaryRes: {
					arrow: "Offense %",
					triangle: "Critical Damage %",
					cross: "Offense %",
				},
			}),
		],
		["ATF", "FAT"],
	),
	GAMORREANGUARD: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 75,
				spd: 100,
				pot: 75,
				ten: 100,
				arm: 50,
			}),
		],
		["Piggy"],
	),
	GARSAXON: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			pot: 25,
			phys: 75,
			minDots: 5,
			primaryRes: {
				arrow: "Speed",
				triangle: "Offense %",
				cross: "Offense %",
			},
			setRes: {
				"Offense %": 1,
				"Potency %": 1,
			},
		}),
	]),
	GENERALHUX: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				prot: 10,
				spd: 100,
				ten: 10,
				ca: 15,
			}),
		],
		[],
		DamageType.special,
	),
	GENERALKENOBI: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Speedy Tank",
				health: 25,
				prot: 50,
				spd: 100,
				ten: 25,
				arm: 12.5,
				res: 12.5,
			}),
			fromShortOptimizationPlan({
				id: "Balanced",
				health: 50,
				prot: 100,
				spd: 50,
				ten: 50,
				arm: 25,
				res: 25,
			}),
			fromShortOptimizationPlan({
				id: "Slow Tank",
				health: 50,
				prot: 100,
				ten: 50,
				arm: 25,
				res: 25,
			}),
			fromShortOptimizationPlan({
				id: "Padme Lead",
				health: 100,
				spd: 50,
				ten: 50,
				arm: 25,
				res: 25,
			}),
			fromShortOptimizationPlan({
				id: "JMK Lead",
				health: 100,
				ten: 50,
				arm: 50,
			}),
			fromShortOptimizationPlan({
				id: "hSTR P2 Jedi",
				prot: 100,
				spd: 50,
				phys: 10,
				cc: 25,
				arm: 100,
			}),
		],
		["GK", "Titans"],
	),
	GENERALSKYWALKER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Defense",
				health: 10,
				prot: 25,
				spd: 100,
				pot: 20,
				phys: 10,
				arm: 10,
				res: 10,
			}),
			fromShortOptimizationPlan({
				id: "Offense",
				spd: 100,
				cd: 100,
				pot: 20,
				phys: 20,
			}),
			fromShortOptimizationPlan({
				id: "Parry",
				prot: 75,
				spd: 100,
				pot: 25,
				phys: 50,
				arm: 10,
			}),
		],
		["GAS"],
	),
	GENERALSYNDULLA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			prot: 10,
			spd: 100,
			pot: 5,
			primaryRes: {
				arrow: "Speed",
				cross: "Potency %",
			},
			setRes: {
				"Speed %": 1,
				"Potency %": 1,
			},
		}),
	]),
	GEONOSIANBROODALPHA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Tanky",
			health: 20,
			prot: 20,
			spd: 100,
			ten: 20,
		}),
		fromShortOptimizationPlan({
			id: "Offense",
			spd: 100,
			cd: 50,
			ten: 10,
			phys: 20,
			cc: 20,
		}),
	]),
	GEONOSIANSOLDIER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 80,
			cd: 90,
			phys: 50,
			cc: 100,
		}),
	]),
	GEONOSIANSPY: createCharacterSettings([
		toRenamed(
			optimizationStrategy["Speed, Crit, and Physical Damage"],
			"Default",
		),
	]),
	GLAHSOKATANO: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 15,
			spd: 100,
			arm: 18,
			res: 18,
			primaryRes: {
				arrow: "Health %",
				triangle: "Health %",
				cross: "Health %",
				circle: "Health %",
			},
			setRes: {
				"Speed %": 1,
				"Health %": 1,
			},
		}),
	]),
	GLLEIA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				prot: 15,
				spd: 100,
				pot: 15,
				phys: 5,
				arm: 10,
				res: 10,
				minDots: 5,
				primaryRes: {
					arrow: "Speed",
					triangle: "Health %",
					cross: "Health %",
					circle: "Health %",
				},
				setRes: {
					"Speed %": 1,
				},
			}),
		],
		["Murderbears"],
	),
	GLREY: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Health",
			health: 50,
			spd: 100,
			phys: 15,
		}),
		fromShortOptimizationPlan({
			id: "Offense",
			health: 15,
			spd: 100,
			phys: 50,
		}),
	]),
	GRANDADMIRALTHRAWN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				prot: 20,
				spd: 100,
				ten: 10,
			}),
		],
		["GAT", "Imperial Grancor Maneuver", "Wampanader", "ABC", "Titans"],
		DamageType.special,
	),
	GRANDINQUISITOR: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			prot: 5,
			spd: 100,
			cd: 50,
			phys: 30,
			cc: 5,
		}),
	]),
	GRANDMASTERLUKE: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				prot: 25,
				spd: 100,
				pot: 15,
			}),
		],
		["GMLS", "JMLS", "GLLS"],
		DamageType.special,
	),
	GRANDMASTERYODA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Speedy",
				spd: 100,
				cd: 50,
				pot: 25,
				spec: 80,
				cc: 25,
			}),
			fromShortOptimizationPlan({
				id: "Offense",
				spd: 50,
				cd: 100,
				spec: 100,
				cc: 25,
			}),
			fromShortOptimizationPlan({
				id: "Health",
				health: 20,
				spd: 100,
				pot: 5,
				spec: 20,
				cc: 5,
			}),
			fromShortOptimizationPlan({
				id: "hSTR P1 Yodalicious",
				prot: -5,
				spd: 100,
				cd: 100,
				spec: 100,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "hSTR P2 Bastila",
				spd: 60,
				cd: 100,
				spec: 75,
				cc: 80,
			}),
		],
		["GMY"],
		DamageType.special,
	),
	GRANDMOFFTARKIN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				pot: 25,
				phys: 15,
				spec: 15,
				cc: 50,
			}),
		],
		["GMT", "Auto Lightzader", "Imperial Grancor Maneuver"],
		DamageType.mixed,
	),
	GREATMOTHERS: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				prot: 5,
				spd: 100,
				pot: 5,
				ca: 16,
				primaryRes: {
					triangle: "Health %",
					cross: "Health %",
					circle: "Health %",
				},
				setRes: {
					"Health %": 1,
					"Speed %": 1,
				},
			}),
		],
		["NS"],
		DamageType.special,
	),
	GREEDO: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Crits",
			spd: 100,
			cd: 50,
			pot: 25,
			phys: 25,
			cc: 100,
		}),
		fromShortOptimizationPlan({
			id: "hSTR Phase 3",
			cd: 100,
			phys: 50,
			cc: 50,
			minDots: 5,
			targetStats: [createTargetStat("Speed", "+", 170, 174, "null")],
		}),
	]),
	GREEFKARGA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			prot: 5,
			spd: 100,
			pot: 5,
			ten: 10,
		}),
	]),
	GRIEVOUS: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 100,
				spd: 80,
				cd: 80,
			}),
			fromShortOptimizationPlan({
				id: "Fast",
				health: 20,
				spd: 100,
				cd: 100,
			}),
			fromShortOptimizationPlan({
				id: "Nuke",
				health: 100,
				cd: 80,
			}),
		],
		["GG"],
	),
	GUNGANPHALANX: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 12,
			prot: 44,
			spd: 100,
			pot: 15,
			arm: 5,
			res: 5,
			minDots: 5,
		}),
	]),
	HANSOLO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Fast Han",
				spd: 100,
				cd: 100,
				pot: 10,
				phys: 25,
			}),
			fromShortOptimizationPlan({
				id: "Slow Han",
				cd: 100,
				pot: 25,
				phys: 50,
			}),
			fromShortOptimizationPlan({
				id: "Non-relic",
				spd: 100,
				cd: 100,
				pot: 25,
				phys: 50,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "Chex Mix",
				cd: 100,
				phys: 50,
				cc: 50,
				minDots: 5,
				targetStats: [createTargetStat("Speed", "+", 170, 174, "null")],
			}),
		],
		["Raid Han", "rHan", "OG Han", "Zolo", "Chex Mix", "Titans"],
	),
	HERASYNDULLAS3: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 20,
			spd: 100,
			pot: 25,
			ten: 20,
			minDots: 5,
			primaryRes: {
				cross: "Potency %",
			},
			setRes: {
				"Speed %": 1,
				"Health %": 1,
			},
		}),
	]),
	HERMITYODA: createCharacterSettings(
		[toRenamed(optimizationStrategy.Speed, "Default")],
		["Hyoda", "Hoboda", "Hobo", "HY"],
		DamageType.mixed,
	),
	HK47: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 75,
			phys: 50,
			cc: 25,
		}),
	]),
	HONDO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				prot: 5,
				spd: 100,
				cd: 75,
				spec: 75,
			}),
		],
		[],
		DamageType.special,
	),
	HOTHHAN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				spd: 100,
				pot: 25,
			}),
		],
		["CHS", "CHolo", "Snolo", "Hoth Han"],
	),
	HOTHLEIA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 50,
				pot: 50,
				phys: 25,
				cc: 30,
			}),
		],
		["ROLO"],
	),
	HOTHREBELSCOUT: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "Mothma Lead",
				health: 5,
				prot: 10,
				spd: 100,
				pot: 5,
				ten: 5,
				phys: 75,
				cc: 100,
				arm: 5,
			}),
		],
		["HRS", "Hoth Bros"],
	),
	HOTHREBELSOLDIER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 25,
				prot: 25,
				spd: 100,
			}),
		],
		["HRS", "Hoth Bros"],
	),
	HUMANTHUG: createCharacterSettings([
		toRenamed(
			optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
			"Default",
		),
	]),
	HUNTERS3: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			prot: 20,
			spd: 100,
			pot: 25,
			primaryRes: {
				arrow: "Speed",
				triangle: "Protection %",
				circle: "Protection %",
				cross: "Potency %",
			},
			setRes: {
				"Potency %": 1,
				"Speed %": 1,
			},
		}),
	]),
	HUYANG: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			spd: 100,
			cd: 50,
			phys: 25,
			cc: 10,
			primaryRes: {
				arrow: "Offense %",
				triangle: "Critical Damage %",
				cross: "Offense %",
			},
			setRes: {
				"Critical Chance %": 1,
				"Critical Damage %": 1,
			},
		}),
	]),
	IDENVERSIOEMPIRE: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 100,
			pot: 50,
			phys: 25,
		}),
		fromShortOptimizationPlan({
			id: "Wampa Slayer",
			spd: 100,
			cd: 30,
			pot: 100,
			phys: 10,
		}),
	]),
	IG11: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Tanky",
			health: 25,
			spd: 50,
			ten: 10,
			phys: 5,
			cc: 5,
			arm: 5,
			res: 5,
		}),
	]),
	IG12: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 20,
			prot: 5,
			spd: 100,
			pot: 5,
			minDots: 5,
			primaryRes: {
				arrow: "Speed",
				triangle: "Health %",
				cross: "Health %",
				circle: "Health %",
			},
			setRes: {
				"Health %": 1,
				"Speed %": 1,
			},
		}),
	]),
	IG86SENTINELDROID: createCharacterSettings([
		toRenamed(
			optimizationStrategy["Speed, Crit, and Physical Damage"],
			"Default",
		),
	]),
	IG88: createCharacterSettings([
		toRenamed(
			optimizationStrategy["Speed, Crit, and Physical Damage"],
			"Default",
			"Damage",
		),
		fromShortOptimizationPlan({
			id: "Nuke",
			spd: 100,
			cd: 25,
			pot: 50,
			phys: 25,
			cc: 75,
		}),
	]),
	IMAGUNDI: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
		],
		["IGD"],
	),
	IMPERIALPROBEDROID: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Tanky",
				health: 50,
				prot: 50,
				spd: 100,
			}),
			fromShortOptimizationPlan({
				id: "Offense",
				spd: 100,
				cd: 80,
				pot: 50,
				phys: 25,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "Nuke",
				health: 50,
				prot: 50,
				spd: 100,
				pot: 25,
			}),
		],
		["IPD"],
	),
	IMPERIALSUPERCOMMANDO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				prot: 15,
				spd: 100,
				pot: 20,
				phys: 100,
				minDots: 5,
				primaryRes: {
					arrow: "Offense %",
					triangle: "Offense %",
					circle: "Protection %",
					cross: "Offense %",
				},
				setRes: {
					"Offense %": 1,
				},
			}),
		],
		["ISC"],
	),
	JABBATHEHUTT: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 15,
				spd: 100,
				pot: 25,
				ten: 50,
			}),
		],
		[],
		DamageType.special,
	),
	JANGOFETT: createCharacterSettings([
		toRenamed(
			optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
			"Default",
		),
	]),
	JARJARBINKS: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 0,
				prot: 20,
				spd: 100,
				cd: 0,
				pot: 40,
				ten: 0,
				phys: 0,
				spec: 0,
				cc: 0,
				arm: 0,
				res: 0,
				acc: 0,
				ca: 0,
				minDots: 5,
			}),
		],
		[],
		DamageType.special,
	),
	JAWA: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Mixed Damage, Potency"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "Detonator",
				health: 100,
				prot: 100,
				arm: 80,
				ca: 100,
			}),
		],
		[],
		DamageType.mixed,
	),
	JAWAENGINEER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				spd: 100,
				pot: 50,
				ten: 10,
			}),
			fromShortOptimizationPlan({
				id: "Detonator",
				health: 20,
				prot: 10,
				spd: 100,
				arm: 5,
			}),
		],
		[],
		DamageType.mixed,
	),
	JAWASCAVENGER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 25,
			pot: 50,
			phys: 25,
			cc: 100,
		}),
		fromShortOptimizationPlan({
			id: "Detonator",
			health: 100,
			prot: 100,
			arm: 80,
			ca: 100,
		}),
	]),
	JEDIKNIGHTCAL: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 25,
				spd: 100,
				cd: 25,
				phys: 75,
				minDots: 5,
				primaryRes: {
					arrow: "Speed",
					triangle: "Critical Damage %",
					circle: "Health %",
					cross: "Offense %",
				},
				setRes: {
					"Health %": 1,
					"Offense %": 1,
				},
			}),
			fromShortOptimizationPlan({
				id: "Debuffer",
				health: 5,
				spd: 100,
				pot: 35,
				phys: 20,
				minDots: 5,
				primaryRes: {
					arrow: "Speed",
					triangle: "Offense %",
					cross: "Potency %",
					circle: "Health %",
				},
				setRes: {
					"Potency %": 1,
				},
			}),
		],
		["JKCK"],
	),
	JEDIKNIGHTCONSULAR: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Healer",
				health: 50,
				spd: 100,
			}),
		],
		["JC"],
		DamageType.mixed,
	),
	JEDIKNIGHTGUARDIAN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 40,
				prot: 20,
				spd: 100,
				pot: 50,
				ten: 25,
				arm: 12.5,
				res: 12.5,
			}),
		],
		["JKG"],
	),
	JEDIKNIGHTLUKE: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Leader",
				health: 5,
				prot: 5,
				cd: 100,
				pot: 25,
				phys: 50,
				cc: 15,
			}),
			fromShortOptimizationPlan({
				id: "Non-leader",
				health: 5,
				prot: 5,
				spd: 25,
				cd: 100,
				pot: 25,
				phys: 50,
				cc: 15,
			}),
		],
		["JKL"],
	),
	JEDIKNIGHTREVAN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 50,
				spec: 10,
			}),
			fromShortOptimizationPlan({
				id: "Health",
				health: 10,
				spd: 100,
				spec: 10,
			}),
		],
		[],
		DamageType.special,
	),
	JEDIMASTERKENOBI: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				spd: 100,
				cd: 25,
				phys: 10,
			}),
		],
		["JMK"],
	),
	JOCASTANU: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				prot: 50,
				spd: 100,
				cd: 10,
				phys: 30,
				primaryRes: {
					triangle: "Protection %",
					cross: "Protection %",
					circle: "Protection %",
				},
			}),
		],
		[],
		DamageType.special,
	),
	JOLEEBINDO: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 50,
			spd: 75,
			ten: 100,
			ca: 100,
		}),
		fromShortOptimizationPlan({
			id: "Health and Speed",
			health: 100,
			spd: 75,
		}),
		fromShortOptimizationPlan({
			id: "Healer",
			health: 30,
			spd: 100,
			ten: 50,
		}),
	]),
	JUHANI: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			prot: 100,
			spd: 90,
			pot: 5,
			arm: 15,
		}),
	]),
	JYNERSO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 50,
				pot: 50,
				phys: 20,
				cc: 75,
			}),
			fromShortOptimizationPlan({
				id: "AdRad",
				health: 10,
				spd: 100,
				cd: 100,
				pot: 25,
				phys: 20,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "AdRad w/ Primaries",
				health: 10,
				spd: 100,
				pot: 25,
				phys: 20,
				cc: 50,
				minDots: 5,
				primaryRes: {
					triangle: "Critical Damage %",
					cross: "Potency %",
					circle: "Health %",
				},
			}),
		],
		["Rogue 1", "Auto Lightzader", "Imperial Grancor Maneuver", "SuperStar2D2"],
	),
	K2SO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Tanky",
				health: 20,
				prot: 20,
				spd: 100,
				pot: 50,
				ten: 50,
			}),
			fromShortOptimizationPlan({
				id: "AdRad",
				health: 20,
				prot: 40,
				spd: 50,
				pot: 50,
				ten: 50,
				arm: 10,
				res: 10,
				minDots: 5,
				primaryRes: {
					arrow: "Protection %",
					triangle: "Protection %",
					cross: "Tenacity %",
					circle: "Protection %",
				},
			}),
		],
		["Rogue 1", "Cass-2SO", "K2"],
	),
	KANANJARRUSS3: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 40,
			spd: 100,
			phys: 10,
			cc: 30,
			minDots: 5,
			primaryRes: {
				arrow: "Speed",
				triangle: "Health %",
				cross: "Health %",
				circle: "Health %",
			},
			setRes: {
				"Health %": 2,
				"Tenacity %": 1,
			},
		}),
	]),
	KELLERANBEQ: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 20,
			prot: 100,
			spd: 50,
			minDots: 5,
			primaryRes: {
				arrow: "Protection %",
				triangle: "Protection %",
				cross: "Protection %",
				circle: "Protection %",
			},
			setRes: {
				"Health %": 3,
			},
		}),
	]),
	KIADIMUNDI: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Balanced",
			health: 10,
			prot: 10,
			spd: 100,
			cd: 50,
			pot: 20,
			phys: 50,
			cc: 25,
			arm: 10,
			res: 10,
		}),
		fromShortOptimizationPlan({
			id: "Offense",
			spd: 100,
			cd: 50,
			pot: 20,
			phys: 75,
			cc: 50,
		}),
		fromShortOptimizationPlan({
			id: "Defense",
			health: 20,
			prot: 20,
			spd: 100,
			pot: 20,
			ten: 10,
			arm: 15,
			res: 15,
		}),
	]),
	KITFISTO: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, and Physical Damage"],
				"Default",
			),
		],
		["Fisty", "Fister"],
	),
	KRRSANTAN: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 30,
			prot: 30,
			spd: 100,
			pot: 10,
			ten: 10,
			arm: 25,
		}),
	]),
	KUIIL: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				prot: 10,
				spd: 100,
				pot: 15,
			}),
		],
		[],
		DamageType.special,
	),
	KYLEKATARN: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Mothma Lead",
			health: 5,
			spd: 100,
			pot: 5,
			ten: 5,
			phys: 50,
			arm: 5,
		}),
	]),
	KYLOREN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 50,
				phys: 25,
				cc: 25,
			}),
		],
		["Old Kylo", "zylo", "FO"],
	),
	KYLORENUNMASKED: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 75,
				prot: 50,
				spd: 100,
				arm: 30,
			}),
			fromShortOptimizationPlan({
				id: "Tanky",
				health: 100,
				prot: 100,
				spd: 50,
				ten: 75,
				arm: 37.5,
				res: 37.5,
			}),
			fromShortOptimizationPlan({
				id: "LV Lead",
				health: 100,
				prot: 75,
			}),
		],
		["kru", "matt", "Snape", "FO"],
	),
	L3_37: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Tanky",
				health: 40,
				prot: 20,
				spd: 50,
				pot: 25,
				ten: 25,
				arm: 12.5,
				res: 12.5,
			}),
			fromShortOptimizationPlan({
				id: "Speedy",
				health: 40,
				prot: 20,
				spd: 100,
				pot: 25,
				ten: 25,
				arm: 12.5,
				res: 12.5,
			}),
		],
		["solo"],
	),
	LOBOT: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			pot: 25,
			ten: 25,
			arm: 12.5,
			res: 12.5,
		}),
	]),
	LOGRAY: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				spd: 100,
				cd: 40,
				pot: 50,
				minDots: 5,
				primaryRes: {
					triangle: "Critical Damage %",
					cross: "Potency %",
					circle: "Health %",
				},
				setRes: {
					"Potency %": 1,
					"Health %": 2,
				},
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 2",
				health: 5,
				prot: 5,
				spd: 100,
				pot: 10,
			}),
		],
		["Murderbears"],
	),
	LORDVADER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			prot: 15,
			spd: 100,
			phys: 5,
		}),
	]),
	LUKESKYWALKER: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
		],
		["farmboi"],
	),
	LUMINARAUNDULI: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 40,
			spd: 100,
			pot: 25,
		}),
	]),
	LUTHENRAEL: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				prot: 10,
				spd: 100,
				cd: 0,
				pot: 5,
				ten: 0,
				phys: 0,
				spec: 0,
				cc: 0,
				arm: 0,
				res: 0,
				acc: 0,
				ca: 0,
				minDots: 5,
			}),
		],
		["Luthen"],
		DamageType.mixed,
	),
	MACEWINDU: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 15,
				spd: 100,
				pot: 50,
				spec: 50,
			}),
			fromShortOptimizationPlan({
				id: "Slow/Tanky",
				health: 100,
				prot: 25,
			}),
		],
		[],
		DamageType.special,
	),
	MAGMATROOPER: createCharacterSettings([
		toRenamed(
			optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
			"Default",
		),
		fromShortOptimizationPlan({
			id: "Anti-Traya",
			spd: 25,
			cd: 25,
			pot: 50,
			phys: 25,
			cc: 25,
		}),
	]),
	MAGNAGUARD: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 30,
			prot: 30,
			spd: 100,
			pot: 20,
			ten: 20,
			arm: 25,
			ca: 100,
		}),
		fromShortOptimizationPlan({
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
		}),
	]),
	MANDALORBOKATAN: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			spd: 80,
			phys: 100,
			arm: 12.5,
			res: 12.5,
			minDots: 5,
			primaryRes: {
				arrow: "Offense %",
				triangle: "Offense %",
				cross: "Offense %",
				circle: "Health %",
			},
			setRes: {
				"Offense %": 1,
			},
		}),
	]),
	MARAJADE: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				prot: 10,
				spd: 100,
				cd: 25,
				pot: 25,
				spec: 25,
				cc: 10,
			}),
			fromShortOptimizationPlan({
				id: "Survivability",
				prot: 10,
				spd: 100,
				pot: 25,
			}),
		],
		[],
		DamageType.special,
	),
	MARROK: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				prot: 10,
				spd: 100,
				cc: 25,
				primaryRes: {
					arrow: "Speed",
				},
				setRes: {
					"Speed %": 1,
					"Critical Chance %": 1,
				},
			}),
		],
		[],
		DamageType.special,
	),
	MASTERQUIGON: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 15,
				prot: 0,
				spd: 100,
				cd: 0,
				pot: 0,
				ten: 0,
				phys: 0,
				spec: 0,
				cc: 0,
				arm: 0,
				res: 0,
				acc: 0,
				ca: 0,
				minDots: 5,
			}),
		],
		["MQG", "Quadme", "Queeni"],
		DamageType.special,
	),
	MAUL: createCharacterSettings([
		toRenamed(optimizationStrategy["Special Damage with Potency"], "Default"),
	]),
	MAULS7: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 25,
			prot: 25,
			spd: 100,
			pot: 15,
			phys: 50,
		}),
		fromShortOptimizationPlan({
			id: "DS Mando",
			spd: 100,
			phys: 50,
		}),
	]),
	MERRIN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 15,
				pot: 100,
				spec: 40,
				minDots: 5,
				primaryRes: {
					cross: "Potency %",
					circle: "Health %",
				},
				setRes: {
					"Potency %": 3,
				},
			}),
			fromShortOptimizationPlan({
				id: "Tenacity",
				health: 15,
				pot: 20,
				ten: 60,
				spec: 30,
				minDots: 5,
				primaryRes: {
					cross: "Tenacity %",
					circle: "Health %",
				},
				setRes: {
					"Tenacity %": 2,
					"Potency %": 1,
				},
			}),
		],
		[],
		DamageType.special,
	),
	MISSIONVAO: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 100,
			phys: 75,
			cc: 50,
		}),
	]),
	MOFFGIDEONS1: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			pot: 10,
		}),
	]),
	MOFFGIDEONS3: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 3,
			prot: 20,
			spd: 100,
			pot: 4,
			ten: 3,
			phys: 2,
			spec: 3,
			cc: 4,
			arm: 4,
			res: 4,
		}),
	]),
	MONMOTHMA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Leader",
				health: 5,
				prot: 5,
				spd: 100,
				ten: 25,
				phys: 10,
			}),
		],
		["MM"],
	),
	MORGANELSBETH: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				prot: 20,
				spd: 100,
				cd: 0,
				pot: 0,
				ten: 0,
				phys: 0,
				spec: 0,
				cc: 0,
				arm: 0,
				res: 0,
				acc: 0,
				ca: 0,
				minDots: 5,
			}),
		],
		["Morgan", "NS"],
	),
	MOTHERTALZIN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				pot: 50,
				spec: 25,
				cc: 10,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 4",
				cd: 100,
				spec: 75,
				cc: 25,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 3",
				prot: -5,
				pot: 10,
				spec: 100,
			}),
		],
		["MT", "NS", "hSTR NS"],
		DamageType.special,
	),
	NIGHTSISTERACOLYTE: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				phys: 50,
				spec: 50,
				cc: 80,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 2",
				spd: 100,
				cd: 100,
				phys: 100,
				spec: 100,
				cc: 100,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 4",
				cd: 100,
				phys: 50,
				spec: 50,
				cc: 100,
			}),
		],
		["NA", "NS"],
		DamageType.mixed,
	),
	NIGHTSISTERINITIATE: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, and Physical Damage"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "hSTR Phase 3",
				cc: 100,
			}),
		],
		["NI", "NS"],
	),
	NIGHTSISTERSPIRIT: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 50,
				pot: 25,
				phys: 75,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 3",
				cd: 40,
				phys: 100,
			}),
		],
		["NS"],
	),
	NIGHTSISTERZOMBIE: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Strong Zombie",
				health: 20,
				prot: 20,
				spd: 100,
				ten: 25,
			}),
			fromShortOptimizationPlan({
				id: "Weak Zombie",
				health: 0,
				prot: 0,
				spd: 100,
				cd: 0,
				pot: 0,
				ten: 0,
				phys: 0,
				spec: 0,
				cc: 0,
				arm: 0,
				res: 0,
				acc: 0,
				ca: 0,
				minDots: 5,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 4",
				health: 100,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 3",
				health: 20,
				spd: 100,
				res: 20,
			}),
		],
		["NS", "hSTR NS"],
	),
	NIGHTTROOPER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 50,
				prot: 0,
				spd: 100,
				cd: 10,
				pot: 0,
				ten: 10,
				phys: 25,
				spec: 0,
				cc: 0,
				arm: 0,
				res: 0,
				acc: 0,
				ca: 0,
				minDots: 5,
			}),
		],
		["NS", "NT"],
	),
	NINTHSISTER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 40,
			prot: 50,
			spd: 100,
			ten: 40,
			arm: 30,
		}),
	]),
	NUTEGUNRAY: createCharacterSettings([
		toRenamed(optimizationStrategy["Speed with survivability"], "Default"),
		toRenamed(
			optimizationStrategy["Speed, Crit, and Physical Damage"],
			"Damage",
		),
	]),
	OLDBENKENOBI: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Speed",
				health: 10,
				prot: 10,
				spd: 100,
				pot: 50,
			}),
		],
		["OB"],
	),
	OMEGAS3: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				spd: 100,
				ten: 25,
				primaryRes: {
					arrow: "Speed",
					triangle: "Offense %",
					cross: "Tenacity %",
				},
				setRes: {
					"Speed %": 1,
					"Health %": 1,
				},
			}),
		],
		[],
		DamageType.special,
	),
	OPERATIVE: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 40,
			spd: 100,
			phys: 20,
			primaryRes: {
				arrow: "Speed",
				triangle: "Health %",
				circle: "Health %",
				cross: "Health %",
			},
			setRes: {
				"Health %": 1,
				"Speed %": 1,
			},
		}),
	]),
	PADAWANOBIWAN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 40,
				cd: 78,
				pot: 5,
				phys: 65,
				primaryRes: {
					triangle: "Critical Damage %",
					cross: "Offense %",
				},
				setRes: {
					"Offense %": 1,
					"Potency %": 1,
				},
			}),
		],
		["POW", "Quadme", "Queeni"],
	),
	PADAWANSABINE: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 20,
			phys: 25,
			cc: 10,
			primaryRes: {
				arrow: "Speed",
				triangle: "Critical Damage %",
				circle: "Protection %",
				cross: "Offense %",
			},
			setRes: {
				"Offense %": 1,
				"Health %": 1,
			},
		}),
	]),
	PADMEAMIDALA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 35,
				spd: 100,
				cd: 25,
				pot: 15,
				phys: 10,
				cc: 10,
			}),
			fromShortOptimizationPlan({
				id: "Slow",
				health: 50,
				cd: 25,
				pot: 15,
				phys: 10,
				cc: 10,
			}),
		],
		["Padme"],
	),
	PAO: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "Mothma Lead",
				health: 10,
				prot: 30,
				spd: 100,
				pot: 5,
				ten: 5,
				phys: 100,
				arm: 5,
			}),
			toRenamed(optimizationStrategy["Speedy Chex Mix"], "Chex Mix"),
		],
		["Rogue 1", "Chex Mix"],
	),
	PAPLOO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				spd: 100,
				ten: 10,
				arm: 5,
				res: 5,
				minDots: 5,
				primaryRes: {
					triangle: "Health %",
					cross: "Health %",
					circle: "Health %",
				},
				setRes: {
					"Health %": 3,
				},
			}),
			fromShortOptimizationPlan({
				id: "Fast Tank",
				health: 25,
				prot: 25,
				spd: 100,
				ten: 25,
				arm: 12.5,
				res: 12.5,
			}),
		],
		["Murderbears"],
	),
	PAZVIZSLA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Health",
			health: 75,
			prot: 50,
			spd: 100,
			arm: 10,
			res: 10,
			minDots: 5,
			primaryRes: {
				triangle: "Health %",
				cross: "Health %",
				circle: "Health %",
			},
			setRes: {
				"Health %": 3,
			},
		}),
		fromShortOptimizationPlan({
			id: "Protection",
			health: 75,
			prot: 50,
			spd: 100,
			arm: 10,
			res: 10,
			minDots: 5,
			primaryRes: {
				triangle: "Protection %",
				cross: "Protection %",
				circle: "Protection %",
			},
			setRes: {
				"Health %": 3,
			},
		}),
	]),
	PHASMA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				prot: 10,
				spd: 100,
				pot: 25,
			}),
		],
		["FO"],
	),
	PLOKOON: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
		],
		[],
		DamageType.mixed,
	),
	POE: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			prot: 10,
			spd: 100,
			pot: 40,
			ten: 20,
			arm: 5,
		}),
	]),
	POGGLETHELESSER: createCharacterSettings([
		toRenamed(optimizationStrategy["Speedy debuffer"], "Default"),
	]),
	PRINCESSKNEESAA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 20,
			spd: 100,
			cd: 50,
			pot: 40,
			phys: 10,
			cc: 80,
			minDots: 5,
			primaryRes: {
				arrow: "Speed",
				triangle: "Critical Damage %",
				cross: "Potency %",
				circle: "Health %",
			},
			setRes: {
				"Potency %": 1,
				"Critical Chance %": 1,
				"Health %": 1,
			},
		}),
	]),
	PRINCESSLEIA: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, and Physical Damage"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "hSTR Phase 2",
				spd: 50,
				cd: 100,
				phys: 25,
				cc: 50,
			}),
		],
		["Machine Gun"],
	),
	QIRA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 50,
				pot: 10,
				phys: 50,
				cc: 25,
			}),
		],
		["solo"],
	),
	QUEENAMIDALA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				prot: 10,
				spd: 100,
				cd: 0,
				pot: 0,
				ten: 0,
				phys: 0,
				spec: 0,
				cc: 0,
				arm: 0,
				res: 0,
				acc: 0,
				ca: 0,
				minDots: 5,
			}),
		],
		["Quadme", "Queeni"],
	),
	QUIGONJINN: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Special Damage, Potency"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "Omicron",
				phys: 100,
				spec: 100,
			}),
			fromShortOptimizationPlan({
				id: "hSTR P1 Jedi",
				prot: -5,
				spd: 100,
				cd: 75,
				phys: 25,
				spec: 25,
				cc: 50,
			}),
		],
		["QGJ"],
		DamageType.mixed,
	),
	R2D2_LEGENDARY: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				prot: 5,
				spd: 100,
				pot: 25,
				ten: 10,
				cc: 25,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 1",
				health: 10,
				prot: -5,
				spd: 100,
				cd: 25,
				pot: 25,
				phys: 25,
				cc: 50,
			}),
		],
		["Trashcan", "R2z2", "SuperStar2D2"],
		DamageType.mixed,
	),
	RANGETROOPER: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, and Physical Damage"],
				"Default",
			),
		],
		["Troopers"],
	),
	RESISTANCEPILOT: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Slow Crit, Physical Damage, Potency"],
				"Default",
			),
		],
		["RP"],
	),
	RESISTANCETROOPER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 10,
				cd: 100,
				pot: 25,
				phys: 50,
				cc: 100,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 1",
				prot: -5,
				cd: 100,
				phys: 50,
			}),
		],
		["RT", "res trooper"],
	),
	REY: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				phys: 25,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 1",
				prot: -5,
				spd: 90,
				cd: 100,
				phys: 50,
			}),
		],
		["scav rey"],
	),
	REYJEDITRAINING: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				pot: 20,
				phys: 20,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 1",
				prot: -5,
				spd: 90,
				cd: 100,
				pot: 50,
				phys: 50,
			}),
			fromShortOptimizationPlan({
				id: "hSTR p1 C3PO",
				prot: -5,
				spd: 90,
				cd: 100,
				pot: 60,
				ten: 60,
				phys: 50,
			}),
		],
		["JTR", "RJT", "Jedi Rey", "Jey Z"],
	),
	ROSETICO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				prot: 5,
				spd: 100,
				cd: 50,
				pot: 30,
				phys: 20,
				spec: 20,
				cc: 25,
			}),
		],
		[],
		DamageType.mixed,
	),
	ROYALGUARD: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Tanky",
				health: 50,
				prot: 50,
				spd: 25,
				ten: 25,
				arm: 5,
				res: 5,
			}),
			fromShortOptimizationPlan({
				id: "LV Lead",
				health: 100,
				prot: 75,
			}),
		],
		["RG", "Red Guard"],
	),
	SABINEWRENS3: createCharacterSettings([
		toRenamed(
			optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
			"Default",
		),
		fromShortOptimizationPlan({
			id: "hSTR Phase 2",
			health: 20,
			prot: 20,
			spd: 100,
		}),
	]),
	SANASTARROS: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 50,
				pot: 5,
				spec: 20,
			}),
		],
		[],
		DamageType.special,
	),
	SAVAGEOPRESS: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 100,
				phys: 10,
				arm: 50,
			}),
			fromShortOptimizationPlan({
				id: "Balanced",
				health: 50,
				spd: 100,
				cd: 25,
				pot: 25,
				ten: 25,
				phys: 25,
				cc: 25,
				arm: 12.5,
				res: 12.5,
			}),
		],
		["zavage"],
	),
	SAWGERRERA: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 20,
			spd: 100,
			pot: 20,
			phys: 20,
		}),
	]),
	SCARIFREBEL: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Health",
				health: 30,
				prot: 10,
				spd: 100,
				pot: 25,
				ten: 10,
				arm: 10,
				res: 10,
				minDots: 5,
				primaryRes: {
					triangle: "Health %",
					cross: "Health %",
				},
			}),
			fromShortOptimizationPlan({
				id: "Protection",
				health: 30,
				prot: 20,
				spd: 100,
				pot: 25,
				ten: 10,
				arm: 10,
				minDots: 5,
				primaryRes: {
					triangle: "Protection %",
					cross: "Protection %",
				},
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 2",
				health: 20,
				spd: 100,
			}),
		],
		["Rogue 1", "SRP"],
	),
	SCORCH: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 20,
			prot: 20,
			spd: 100,
			arm: 20,
			primaryRes: {
				arrow: "Protection %",
				triangle: "Protection %",
				cross: "Protection %",
				circle: "Protection %",
			},
			setRes: {
				"Health %": 2,
				"Defense %": 1,
			},
		}),
	]),
	SCOUTTROOPER_V3: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				prot: 10,
				spd: 100,
				pot: 30,
				ten: 10,
				phys: 15,
				minDots: 5,
				primaryRes: {
					arrow: "Speed",
					triangle: "Offense %",
					cross: "Potency %",
				},
				setRes: {
					"Speed %": 1,
					"Potency %": 1,
				},
			}),
		],
		["Rogue 1", "SRP"],
	),
	SECONDSISTER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				prot: 5,
				spd: 100,
				cd: 75,
				spec: 100,
				cc: 30,
			}),
		],
		[],
		DamageType.special,
	),
	SEVENTHSISTER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 20,
			prot: 10,
			spd: 100,
			ten: 20,
		}),
	]),
	SHAAKTI: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 25,
			prot: 25,
			spd: 100,
		}),
		fromShortOptimizationPlan({
			id: "Nuke",
			health: 25,
			prot: 25,
			spd: 50,
		}),
		fromShortOptimizationPlan({
			id: "KAM",
			health: 20,
			prot: 10,
			spd: 100,
		}),
		fromShortOptimizationPlan({
			id: "KAM/CA",
			health: 20,
			prot: 10,
			spd: 100,
			ca: 100,
		}),
	]),
	SHINHATI: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 50,
				spd: 100,
				cd: 10,
				ten: 10,
				phys: 25,
				primaryRes: {
					arrow: "Critical Avoidance %",
					triangle: "Critical Damage %",
					cross: "Offense %",
				},
				setRes: {
					"Health %": 1,
					"Offense %": 1,
				},
			}),
		],
		[],
	),
	SHORETROOPER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Speedy Tank",
				health: 50,
				prot: 50,
				spd: 100,
				ten: 25,
			}),
			fromShortOptimizationPlan({
				id: "LV Lead",
				health: 100,
				prot: 75,
			}),
		],
		["ShT", "Troopers", "Imperial Grancor Maneuver"],
	),
	SITHASSASSIN: createCharacterSettings(
		[toRenamed(optimizationStrategy["Special Damage with Potency"], "Default")],
		["SA", "Sassy"],
	),
	SITHMARAUDER: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
		],
		["SM"],
	),
	SITHPALPATINE: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 40,
				prot: 5,
				spd: 100,
				spec: 5,
			}),
		],
		["SEE"],
		DamageType.special,
	),
	SITHTROOPER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 25,
				prot: 25,
				spd: 50,
				ten: 15,
				arm: 25,
				res: 25,
			}),
			fromShortOptimizationPlan({
				id: "DR Lead",
				health: 25,
				prot: 50,
				spd: 15,
				ten: 15,
			}),
		],
		["SiT", "Nightmare"],
	),
	SMUGGLERCHEWBACCA: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "DefaultSpeedy Critter",
				spd: 100,
				cd: 80,
				pot: 25,
				phys: 60,
				cc: 25,
			}),
		],
		["Vets"],
	),
	SMUGGLERHAN: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "Speedy Critter",
				spd: 100,
				cd: 80,
				pot: 25,
				phys: 60,
			}),
		],
		["Vets"],
	),
	SNOWTROOPER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				phys: 50,
				cc: 25,
			}),
			fromShortOptimizationPlan({
				id: "Iden Lead",
				health: 10,
				prot: 10,
				spd: 50,
				cd: 100,
				pot: 10,
				phys: 30,
				cc: 25,
			}),
		],
		["Troopers"],
	),
	STAP: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 10,
			pot: 10,
			phys: 50,
			cc: 10,
			minDots: 5,
			primaryRes: {
				arrow: "Speed",
				triangle: "Critical Damage %",
				cross: "Offense %",
			},
			setRes: {
				"Speed %": 1,
			},
		}),
	]),
	STARKILLER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 25,
			spd: 100,
			cd: 75,
			phys: 50,
		}),
		fromShortOptimizationPlan({
			id: "Default w/ Primaries",
			health: 25,
			spd: 100,
			phys: 50,
			minDots: 5,
			primaryRes: {
				triangle: "Critical Damage %",
			},
		}),
		fromShortOptimizationPlan({
			id: "Speedy",
			health: 10,
			spd: 100,
			cd: 50,
			phys: 30,
			minDots: 5,
			primaryRes: {
				triangle: "Critical Damage %",
			},
		}),
	]),
	STORMTROOPER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				desc: "Speedy Tank",
				health: 25,
				prot: 25,
				spd: 50,
				ten: 25,
				arm: 25,
				res: 25,
			}),
			fromShortOptimizationPlan({
				id: "LV Lead",
				health: 100,
				prot: 75,
			}),
			fromShortOptimizationPlan({
				id: "Iden Lead",
				prot: 75,
				spd: 50,
				arm: 100,
			}),
			// TODO: Check differing values
			fromShortOptimizationPlan({
				id: "Iden Lead w/ Primaries",
				prot: 100,
				spd: 50,
				arm: 50,
				minDots: 5,
				primaryRes: {
					arrow: "Defense %",
					triangle: "Defense %",
					cross: "Defense %",
				},
			}),
		],
		["Troopers"],
	),
	STORMTROOPERHAN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 25,
				prot: 50,
				spd: 50,
				pot: 100,
				ten: 10,
				arm: 20,
			}),
		],
		["STHan"],
	),
	SUNFAC: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Tanky",
			health: 40,
			prot: 40,
			spd: 100,
			pot: 25,
			ten: 25,
			arm: 12.5,
			res: 12.5,
		}),
	]),
	SUPREMELEADERKYLOREN: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Speed",
			health: 10,
			spd: 100,
			cd: 50,
			phys: 30,
		}),
		fromShortOptimizationPlan({
			id: "Offense",
			health: 20,
			spd: 100,
			cd: 100,
			phys: 40,
		}),
	]),
	T3_M4: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				prot: 10,
				spd: 100,
				pot: 25,
				ten: 10,
				spec: 10,
				cc: 10,
			}),
			fromShortOptimizationPlan({
				id: "Damage",
				health: 10,
				prot: 20,
				spd: 100,
				cd: 50,
				pot: 50,
				ten: 10,
				spec: 20,
				cc: 25,
			}),
			fromShortOptimizationPlan({
				id: "Nuke",
				health: 10,
				prot: 50,
				spd: 100,
				pot: 25,
				ten: 10,
				cc: 10,
			}),
		],
		[],
		DamageType.special,
	),
	TALIA: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, and Mixed Damage"],
				"Default",
			),
			fromShortOptimizationPlan({
				id: "hSTR Phase 4",
				phys: 100,
				spec: 100,
				cc: 100,
			}),
		],
		["NS", "hSTR NS"],
		DamageType.mixed,
	),
	TARFFUL: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 30,
			spd: 100,
			arm: 50,
			res: 50,
			minDots: 5,
			primaryRes: {
				arrow: "Health %",
				triangle: "Health %",
				cross: "Health %",
				circle: "Health %",
			},
			setRes: {
				"Defense %": 3,
			},
		}),
	]),
	TARONMALICOS: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			desc: "Fast Build",
			health: 20,
			spd: 100,
			cd: 50,
			phys: 40,
			minDots: 5,
			primaryRes: {
				triangle: "Critical Damage %",
			},
			setRes: {
				"Offense %": 1,
				"Health %": 1,
			},
		}),
		fromShortOptimizationPlan({
			id: "Slow Build",
			health: 40,
			spd: 100,
			cd: 50,
			phys: 60,
			minDots: 5,
			primaryRes: {
				triangle: "Critical Damage %",
			},
			setRes: {
				"Offense %": 1,
				"Health %": 1,
			},
		}),
	]),
	TEEBO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				spd: 100,
				pot: 100,
				minDots: 5,
				primaryRes: {
					triangle: "Health %",
					cross: "Potency %",
					circle: "Health %",
				},
				setRes: {
					"Potency %": 3,
				},
			}),
		],
		["Teebotine", "Murderbears"],
	),
	THEMANDALORIAN: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			prot: 5,
			spd: 100,
			cd: 15,
			phys: 5,
			cc: 30,
		}),
		fromShortOptimizationPlan({
			id: "Relic 7",
			spd: 100,
			cd: 80,
			phys: 20,
		}),
		fromShortOptimizationPlan({
			id: "Non-relic",
			spd: 100,
			cd: 80,
			phys: 10,
			cc: 20,
		}),
	]),
	THEMANDALORIANBESKARARMOR: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			prot: 5,
			spd: 100,
			pot: 15,
			phys: 30,
		}),
	]),
	THIRDSISTER: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 30,
			prot: 5,
			spd: 100,
			cd: 50,
			phys: 50,
			arm: 5,
		}),
		// TODO: Check differing values
		fromShortOptimizationPlan({
			id: "Default w/ Primaries",
			health: 30,
			prot: 5,
			spd: 100,
			phys: 50,
			arm: 5,
			minDots: 5,
			primaryRes: {
				triangle: "Critical Damage %",
				circle: "Health %",
				cross: "Health %",
			},
		}),
	]),
	TIEFIGHTERPILOT: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
		],
		["TFP", "Auto Lightzader"],
	),
	TRENCH: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 20,
				prot: 10,
				spd: 100,
				pot: 30,
				spec: 20,
			}),
		],
		[],
		DamageType.special,
	),
	TRIPLEZERO: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				pot: 30,
				spec: 20,
			}),
		],
		[],
		DamageType.special,
	),
	TUSKENCHIEFTAIN: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 15,
			prot: 10,
			spd: 100,
			ten: 30,
		}),
	]),
	TUSKENHUNTRESS: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 75,
			pot: 10,
			phys: 40,
			cc: 10,
		}),
	]),
	TUSKENRAIDER: createCharacterSettings([
		toRenamed(
			optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
			"Default",
		),
	]),
	TUSKENSHAMAN: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			prot: 5,
			spd: 100,
			pot: 30,
			ten: 10,
		}),
	]),
	UGNAUGHT: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Mixed Damage, Potency"],
				"Default",
			),
		],
		[],
		DamageType.mixed,
	),
	UNDERCOVERLANDO: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			spd: 100,
			cd: 50,
			phys: 25,
			cc: 25,
		}),
	]),
	URORRURRR: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			prot: 20,
			spd: 100,
			pot: 10,
			arm: 10,
		}),
	]),
	VADER: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				spd: 100,
				cd: 100,
				pot: 40,
				phys: 20,
				cc: 20,
			}),
			fromShortOptimizationPlan({
				id: "Raids",
				spd: 100,
				cd: 50,
				pot: 25,
				phys: 25,
				cc: 25,
			}),
		],
		["Auto Lightzader", "Wampanader", "Nightmare"],
	),
	VEERS: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Mixed Damage, Potency"],
				"Default",
			),
		],
		["Troopers"],
		DamageType.mixed,
	),
	VISASMARR: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 25,
			spd: 100,
			cd: 50,
			ten: 25,
			phys: 50,
			cc: 50,
		}),
		fromShortOptimizationPlan({
			id: "Healer",
			health: 50,
			spd: 100,
			ten: 10,
		}),
		fromShortOptimizationPlan({
			id: "hSTR Phase 1",
			health: 25,
			prot: -5,
			cd: 100,
			phys: 50,
			cc: 75,
		}),
	]),
	WAMPA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				spd: 80,
				cd: 100,
				pot: 10,
				phys: 50,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "Omicron",
				health: 100,
				spd: 75,
				ten: 75,
				phys: 50,
				arm: 20,
			}),
			fromShortOptimizationPlan({
				id: "Omicron/Health",
				health: 100,
				spd: 75,
				ten: 10,
				phys: 10,
				arm: 10,
			}),
			fromShortOptimizationPlan({
				id: "Omicron/Tenacity",
				health: 30,
				spd: 15,
				ten: 100,
				phys: 30,
				arm: 20,
			}),
			fromShortOptimizationPlan({
				id: "Raids",
				health: 10,
				spd: 80,
				cd: 100,
				pot: 10,
				phys: 50,
			}),
		],
		["beast", "Wampanader"],
	),
	WATTAMBOR: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 30,
			spd: 100,
			pot: 25,
			ten: 10,
		}),
	]),
	WEDGEANTILLES: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, and Physical Damage"],
				"Default",
			),
		],
		["Wiggs", "chiggs", "SuperStar2D2"],
	),
	WICKET: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 5,
				spd: 100,
				cd: 100,
				phys: 40,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "Default w/ Primaries",
				health: 5,
				spd: 100,
				cd: 100,
				phys: 40,
				cc: 50,
				minDots: 5,
				primaryRes: {
					triangle: "Critical Damage %",
					circle: "Health %",
					cross: "Offense %",
				},
			}),
			// TODO: Check differing values
			fromShortOptimizationPlan({
				id: "Default w/ Primaries & Sets",
				health: 5,
				spd: 100,
				cd: 100,
				phys: 60,
				cc: 50,
				minDots: 5,
				primaryRes: {
					triangle: "Critical Damage %",
					circle: "Health %",
					cross: "Offense %",
				},
				setRes: {
					"Critical Damage %": 1,
					"Health %": 1,
				},
			}),
			fromShortOptimizationPlan({
				id: "hSTR Phase 2",
				spd: 80,
				cd: 50,
				phys: 100,
				cc: 10,
			}),
		],
		["Murderbears"],
	),
	WRECKERS3: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 10,
			prot: 100,
			spd: 50,
			primaryRes: {
				arrow: "Protection %",
				circle: "Protection %",
				cross: "Protection %",
				triangle: "Protection %",
			},
			setRes: {
				"Health %": 1,
				"Speed %": 1,
			},
		}),
	]),
	YOUNGCHEWBACCA: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 50,
				spd: 100,
				cd: 50,
				phys: 25,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "Tanky",
				health: 100,
				spd: 50,
				ten: 5,
				arm: 5,
			}),
		],
		["Dwight", "solo"],
	),
	YOUNGHAN: createCharacterSettings(
		[
			fromShortOptimizationPlan({
				id: "Default",
				health: 10,
				spd: 100,
				cd: 100,
				pot: 25,
				phys: 50,
				cc: 50,
			}),
			fromShortOptimizationPlan({
				id: "HAAT",
				spd: 80,
				cd: 100,
				phys: 50,
			}),
		],
		["YOLO", "solo", "Jim"],
	),
	YOUNGLANDO: createCharacterSettings(
		[
			toRenamed(
				optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
				"Default",
			),
		],
		["solo"],
	),
	ZAALBAR: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 50,
			prot: 50,
			spd: 25,
			pot: 25,
			ten: 50,
			ca: 50,
		}),
	]),
	ZAMWESELL: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			spd: 100,
			cd: 40,
			pot: 50,
			phys: 25,
			cc: 40,
		}),
		fromShortOptimizationPlan({
			id: "Omicron",
			health: 10,
			prot: 10,
			spd: 100,
			phys: 10,
		}),
	]),
	ZEBS3: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 40,
			spd: 100,
			pot: 50,
			phys: 20,
			minDots: 5,
			primaryRes: {
				arrow: "Speed",
				cross: "Potency %",
			},
			setRes: {
				"Health %": 3,
			},
		}),
	]),
	ZORIIBLISS_V2: createCharacterSettings([
		fromShortOptimizationPlan({
			id: "Default",
			health: 5,
			prot: 10,
			spd: 100,
			cd: 50,
			pot: 10,
			phys: 20,
		}),
	]),
};

for (const charID in characterSettings) {
	Object.freeze(characterSettings[charID as CharacterNames]);
}

Object.freeze(characterSettings);

export { characterSettings };
