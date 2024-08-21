// utils
import type * as UtilityTypes from "#/utils/typeHelper";

// domain
import optimizationStrategy from "#/constants/optimizationStrategy";

import { createCharacterSettings, type CharacterSettings, DamageType } from "#/domain/CharacterSettings";
import { createOptimizationPlan, fromShortOptimizationPlan, toRenamed } from "#/domain/OptimizationPlan";
import { createTargetStat } from "#/domain/TargetStat";

export const characterNames = [
  '50RT',
  'AAYLASECURA',
  'ADMINISTRATORLANDO',
  'ADMIRALACKBAR',
  'ADMIRALPIETT',
  'ADMIRALRADDUS',
  'AHSOKATANO',
  'AMILYNHOLDO',
  'ANAKINKNIGHT',
  'ARCTROOPER501ST',
  'ARMORER',
  'ASAJVENTRESS',
  'AURRA_SING',
  'BADBATCHECHO',
  'BADBATCHHUNTER',
  'BADBATCHOMEGA',
  'BADBATCHTECH',
  'BADBATCHWRECKER',
  'B1BATTLEDROIDV2',
  'B2SUPERBATTLEDROID',
  'BARRISSOFFEE',
  'BASTILASHAN',
  'BASTILASHANDARK',
  'BAZEMALBUS',
  'BB8',
  'BENSOLO',
  'BIGGSDARKLIGHTER',
  'BISTAN',
  'BOBAFETT',
  'BOBAFETTSCION',
  'BODHIROOK',
  'BOKATAN',
  'BOOMADIER',
  'BOSSK',
  'BOSSNASS',
  'BOUSHH',
  'BT1',
  'C3POCHEWBACCA',
  'C3POLEGENDARY',
  'CADBANE',
  'CALKESTIS',
  'CANDEROUSORDO',
  'CAPTAINDROGAN',
  'CAPTAINREX',
  'CAPTAINTARPALS',
  'CARADUNE',
  'CARTHONASI',
  'CASSIANANDOR',
  'CC2224',
  'CEREJUNDA',
  'CHEWBACCALEGENDARY',
  'CHIEFCHIRPA',
  'CHIEFNEBIT',
  'CHIRRUTIMWE',
  'CHOPPERS3',
  'CLONESERGEANTPHASEI',
  'CLONEWARSCHEWBACCA',
  'COLONELSTARCK',
  'COMMANDERAHSOKA',
  'COMMANDERLUKESKYWALKER',
  'CORUSCANTUNDERWORLDPOLICE',
  'COUNTDOOKU',
  'CT5555',
  'CT7567',
  'CT210408',
  'DAKA',
  'DARKTROOPER',
  'DARTHBANE',
  'DARTHMALAK',
  'DARTHMALGUS',
  'DARTHNIHILUS',
  'DARTHREVAN',
  'DARTHSIDIOUS',
  'DARTHSION',
  'DARTHTALON',
  'DARTHTRAYA',
  'DASHRENDAR',
  'DATHCHA',
  'DEATHTROOPER',
  'DENGAR',
  'DIRECTORKRENNIC',
  'DOCTORAPHRA',
  'DROIDEKA',
  'EETHKOTH',
  'EIGHTHBROTHER',
  'EMBO',
  'EMPERORPALPATINE',
  'ENFYSNEST',
  'EPIXFINN',
  'EPIXPOE',
  'EWOKELDER',
  'EWOKSCOUT',
  'EZRABRIDGERS3',
  'FENNECSHAND',
  'FIFTHBROTHER',
  'FINN',
  'FIRSTORDEREXECUTIONER',
  'FIRSTORDEROFFICERMALE',
  'FIRSTORDERSPECIALFORCESPILOT',
  'FIRSTORDERTIEPILOT',
  'FIRSTORDERTROOPER',
  'FOSITHTROOPER',
  'FULCRUMAHSOKA',
  'GAMORREANGUARD',
  'GARSAXON',
  'GENERALHUX',
  'GENERALKENOBI',
  'GENERALSKYWALKER',
  'GEONOSIANBROODALPHA',
  'GEONOSIANSOLDIER',
  'GEONOSIANSPY',
  'GLLEIA',
  'GLREY',
  'GRANDADMIRALTHRAWN',
  'GRANDINQUISITOR',
  'GRANDMASTERLUKE',
  'GRANDMASTERYODA',
  'GRANDMOFFTARKIN',
  'GREEDO',
  'GREEFKARGA',
  'GRIEVOUS',
  'GUNGANPHALANX',
  'HANSOLO',
  'HERASYNDULLAS3',
  'HERMITYODA',
  'HK47',
  'HONDO',
  'HOTHHAN',
  'HOTHLEIA',
  'HOTHREBELSCOUT',
  'HOTHREBELSOLDIER',
  'HUMANTHUG',
  'IDENVERSIOEMPIRE',
  'IG11',
  'IG12',
  'IG86SENTINELDROID',
  'IG88',
  'IMAGUNDI',
  'IMPERIALPROBEDROID',
  'IMPERIALSUPERCOMMANDO',
  'JABBATHEHUTT',
  'JANGOFETT',
  'JARJARBINKS',
  'JAWA',
  'JAWAENGINEER',
  'JAWASCAVENGER',
  'JEDIKNIGHTCAL',
  'JEDIKNIGHTCONSULAR',
  'JEDIKNIGHTGUARDIAN',
  'JEDIKNIGHTLUKE',
  'JEDIKNIGHTREVAN',
  'JEDIMASTERKENOBI',
  'JOLEEBINDO',
  'JUHANI',
  'JYNERSO',
  'K2SO',
  'KANANJARRUSS3',
  'KELLERANBEQ',
  'KIADIMUNDI',
  'KITFISTO',
  'KRRSANTAN',
  'KUIIL',
  'KYLEKATARN',
  'KYLOREN',
  'KYLORENUNMASKED',
  'L3_37',
  'LOBOT',
  'LOGRAY',
  'LORDVADER',
  'LUKESKYWALKER',
  'LUMINARAUNDULI',
  'LUTHENRAEL',
  'MACEWINDU',
  'MAGMATROOPER',
  'MAGNAGUARD',
  'MANDALORBOKATAN',
  'MARAJADE',
  'MASTERQUIGON',
  'MAUL',
  'MAULS7',
  'MERRIN',
  'MISSIONVAO',
  'MOFFGIDEONS1',
  'MOFFGIDEONS3',
  'MONMOTHMA',
  'MORGANELSBETH',
  'MOTHERTALZIN',
  'NIGHTSISTERACOLYTE',
  'NIGHTSISTERINITIATE',
  'NIGHTSISTERSPIRIT',
  'NIGHTSISTERZOMBIE',
  'NIGHTTROOPER',
  'NINTHSISTER',
  'NUTEGUNRAY',
  'OLDBENKENOBI',
  'PADAWANOBIWAN',
  'PADMEAMIDALA',
  'PAO',
  'PAPLOO',
  'PAZVIZSLA',
  'PHASMA',
  'PLOKOON',
  'POE',
  'POGGLETHELESSER',
  'PRINCESSKNEESAA',
  'PRINCESSLEIA',
  'QIRA',
  'QUEENAMIDALA',
  'QUIGONJINN',
  'R2D2_LEGENDARY',
  'RANGETROOPER',
  'RESISTANCEPILOT',
  'RESISTANCETROOPER',
  'REY',
  'REYJEDITRAINING',
  'ROSETICO',
  'ROYALGUARD',
  'SABINEWRENS3',
  'SANASTARROS',
  'SAVAGEOPRESS',
  'SAWGERRERA',
  'SCARIFREBEL',
  'SCOUTTROOPER_V3',
  'SECONDSISTER',
  'SEVENTHSISTER',
  'SHAAKTI',
  'SHORETROOPER',
  'SITHASSASSIN',
  'SITHMARAUDER',
  'SITHPALPATINE',
  'SITHTROOPER',
  'SMUGGLERCHEWBACCA',
  'SMUGGLERHAN',
  'SNOWTROOPER',
  'STAP',
  'STARKILLER',
  'STORMTROOPER',
  'STORMTROOPERHAN',
  'SUNFAC',
  'SUPREMELEADERKYLOREN',
  'T3_M4',
  'TALIA',
  'TARFFUL',
  'TARONMALICOS',
  'TEEBO',
  'THEMANDALORIAN',
  'THEMANDALORIANBESKARARMOR',
  'THIRDSISTER',
  'TIEFIGHTERPILOT',
  'TRENCH',
  'TRIPLEZERO',
  'TUSKENCHIEFTAIN',
  'TUSKENHUNTRESS',
  'TUSKENRAIDER',
  'TUSKENSHAMAN',
  'UGNAUGHT',
  'UNDERCOVERLANDO',
  'URORRURRR',
  'VADER',
  'VEERS',
  'VISASMARR',
  'WAMPA',
  'WATTAMBOR',
  'WEDGEANTILLES',
  'WICKET',
  'YOUNGCHEWBACCA',
  'YOUNGHAN',
  'YOUNGLANDO',
  'ZAALBAR',
  'ZAMWESELL',
  'ZEBS3',
  'ZORIIBLISS_V2',
] as const;

export type CharacterNames = UtilityTypes.ElementType<typeof characterNames>

export type CharacterSettingsIndexer = {
  [key in CharacterNames]: CharacterSettings
}
const characterSettings: CharacterSettingsIndexer = {
  '50RT': createCharacterSettings(
    [createOptimizationPlan('Default', 20, 10, 100, 0, 20, 0, 0, 0, 0, 25, 0, 0, 0)],
  ),
  AAYLASECURA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 0, 75, 0, 10, 0, 100, 0, 0, 0, 0),
      createOptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 50, 0, 0, 0, 0, 0, 0),
    ]
  ),
  ADMINISTRATORLANDO: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 50, 0, 0, 25, 0, 75, 0, 0, 0, 0)]
  ),
  ADMIRALACKBAR: createCharacterSettings(
    [
      createOptimizationPlan('Survivability', 20, 20, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0),
      optimizationStrategy.Speed
    ],
    ['AA', 'Snackbar', 'ABC']
  ),
  ADMIRALPIETT: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 25, 15, 0, 10, 0, 10, 0, 0, 0, 0)]
  ),
  ADMIRALRADDUS: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 10, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0),
      createOptimizationPlan('Protection', 10, 20, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0),
      createOptimizationPlan('Protection w/ Primaries', 10, 20, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 5, {
        triangle: "Protection %",
        cross: "Protection %",
        circle: "Protection %",
      }),
      createOptimizationPlan('Health', 20, 10, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0),
      createOptimizationPlan('Health w/ Primaries', 20, 10, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 5, {
        triangle: "Health %",
        cross: "Health %",
        circle: "Health %",
      }),
    ],
    [],
    DamageType.special
  ),
  AHSOKATANO: createCharacterSettings(
    [
      createOptimizationPlan('Default', 20, 0, 100, 50, 0, 0, 25, 0, 10, 0, 0, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
        health: 20,
        spd: 100,
        cd: 50,
        phys: 25,
        cc: 10,
        primaryRes: {
          triangle: "Critical Damage %",
          cross: "Offense %",
          circle: "Health %",
        }
      }),
      createOptimizationPlan('Padme Lead', 10, 0, 100, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0),
      createOptimizationPlan('Slow Damage', 25, 0, 0, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0)
    ],
    ['Snips']
  ),
  AMILYNHOLDO: createCharacterSettings(
    [createOptimizationPlan('Default', 20, 10, 100, 0, 50, 25, 0, 0, 0, 5, 5, 0, 0)],
    ['Hodor'],
    DamageType.mixed
  ),
  ANAKINKNIGHT: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 75, 25, 0, 25, 0, 80, 0, 0, 0, 0),
      createOptimizationPlan('Padme Lead', 10, 0, 80, 100, 25, 0, 25, 0, 40, 0, 0, 0, 0),
      createOptimizationPlan('oQGJ Lead', 0, 0, 100, 100, 10, 0, 25, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Chex Mix', 0, 0, 50, 0, 0, 0, 100, 0, 25, 0, 0, 0, 0),
      createOptimizationPlan('hSTR P1 Jedi', 0, -5, 20, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Slow Damage', 25, 0, 0, 100, 25, 0, 25, 0, 40, 0, 0, 0, 0),
      createOptimizationPlan('Nuke', 0, 0, 0, 100, 20, 0, 40, 0, 25, 0, 0, 0, 0),
    ],
    ['JKA']
  ),
  ARCTROOPER501ST: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 0, 0, 0, 50, 0, 15, 0, 0, 0, 0),
      createOptimizationPlan('KAM', 10, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('KAM/CA', 10, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 100),
    ],
  ),
  ARMORER: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 10, 100, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0)],
  ),
  ASAJVENTRESS: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 25, 0, 10, 10, 20, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 25, 25, 0, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3', 15, 0, 50, 100, 0, 0, 30, 30, 0, 0, 0, 0, 0),
    ],
    ['AV', 'Zen', 'NS', 'hSTR NS', 'ABC'],
    DamageType.mixed
  ),
  AURRA_SING: createCharacterSettings(
    [
      createOptimizationPlan('hSTR Phase 3', 0, 0, 75, 100, 0, 0, 50, 0, 10, 0, 0, 0, 0),
      createOptimizationPlan('Default', 0, 0, 100, 80, 20, 0, 50, 0, 25, 0, 0, 0, 0)
    ]
  ),
  BADBATCHECHO: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speedy debuffer"], 'Default')],
  ),
  BADBATCHHUNTER: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 0, 15, 0, 25, 0, 0, 0, 0, 0, 0)],
  ),
  BADBATCHOMEGA: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 50, 0, 25, 0, 100, 0, 0, 0, 0, 0, 0)]
  ),
  BADBATCHTECH: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speedy debuffer"], 'Default')],
    [],
    DamageType.special
  ),
  BADBATCHWRECKER: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 30, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0)]
  ),
  B1BATTLEDROIDV2: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 0, 25, 0, 75, 0, 0, 0, 0, 0, 0)]
  ),
  B2SUPERBATTLEDROID: createCharacterSettings(
    [
      createOptimizationPlan('Survival', 50, 50, 0, 0, 50, 25, 0, 0, 0, 0, 0, 50, 0),
      createOptimizationPlan('Tenacity', 50, 50, 0, 0, 50, 100, 0, 0, 0, 0, 0, 0, 100),
      createOptimizationPlan('Potency', 50, 50, 0, 0, 100, 50, 0, 0, 0, 0, 0, 0, 100),
    ]
  ),
  BARRISSOFFEE: createCharacterSettings(
    [
      createOptimizationPlan('Default', 70, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('hSTR P1 Jedi', 75, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
  ),
  BASTILASHAN: createCharacterSettings(
    [
      createOptimizationPlan('Leader', 10, 0, 100, 0, 50, 0, 0, 25, 0, 0, 0, 0, 0),
      toRenamed(optimizationStrategy["Special Damage with Potency"], 'Non-leader'),
      toRenamed(optimizationStrategy["Special Damage"], 'JKR Lead'),
      createOptimizationPlan('hSTR P2 Jedi', 0, 0, 100, 50, 0, 0, 0, 25, 50, 0, 0, 0, 0)
    ],
    [],
    DamageType.special
  ),
  BASTILASHANDARK: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Offensive', 0, 0, 100, 50, 5, 0, 0, 25, 0, 0, 0, 0, 0),
    ],
    [],
    DamageType.special
  ),
  BAZEMALBUS: createCharacterSettings(
    [
      createOptimizationPlan('Default', 50, 0, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
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
      createOptimizationPlan('Default Slow', 50, 0, 20, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
      fromShortOptimizationPlan({
        id: "Default Slow w/ Primaries",
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
      createOptimizationPlan('Slow Tank', 50, 50, 0, 0, 10, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
      createOptimizationPlan('hSTR Phase 4', 10, 10, -100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    ],
    ['Rogue 1', 'Chaze', 'Chiggs']
  ),
  BB8: createCharacterSettings(
    [
      createOptimizationPlan('Default', 5, 5, 100, 0, 0, 10, 0, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 1', 10, -5, 100, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0),
      optimizationStrategy.Speed,
      createOptimizationPlan('Tanky', 5, 25, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0)
    ],
    ['bb8', 'Wampanader', 'ABC']
  ),
  BENSOLO: createCharacterSettings(
    [createOptimizationPlan('Default', 20, 0, 100, 0, 10, 0, 0, 70, 0, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  BIGGSDARKLIGHTER: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Default')],
    ['Wiggs', 'Chiggs']
  ),
  BISTAN: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
    ['Rogue 1', 'SuperStar2D2']
  ),
  BOBAFETT: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 50, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0),
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default'),
      createOptimizationPlan('hSTR Phase 2', 0, 0, 100, 75, 0, 0, 25, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3 Greedo', 0, 0, 20, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0)
    ]
  ),
  BOBAFETTSCION: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0),
    ]
  ),
  BODHIROOK: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0)],
    ['Rogue 1']
  ),
  BOKATAN: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 100, 25, 0, 10, 0, 50, 0, 0, 0, 0)],
  ),
  BOOMADIER: createCharacterSettings(
    [createOptimizationPlan('Default', 50, 3, 100, 9, 3, 10, 25, 10, 0, 2, 2, 3, 3)],
  ),
  BOSSK: createCharacterSettings(
    [
      createOptimizationPlan('Leader', 10, 10, 100, 0, 10, 25, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Non-leader', 10, 0, 100, 0, 10, 25, 0, 0, 0, 0, 0, 0, 0),
    ]
  ),
  BOSSNASS: createCharacterSettings(
    [createOptimizationPlan('Default', 4, 22, 100, 0, 28, 15, 2, 3, 2, 2, 2, 0, 0)],
  ),
  BOUSHH: createCharacterSettings(
    [
      createOptimizationPlan('Default', 5, 0, 100, 0, 10, 0, 0, 20, 0, 0, 0, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
        health: 5,
        spd: 100,
        pot: 10,
        spec: 20,
        primaryRes: {
          arrow: "Speed",
          triangle: "Offense %",
          cross: "Offense %",
        },
      }),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries & Sets',
        health: 5,
        spd: 100,
        spec: 20,
        primaryRes: {
          arrow: "Speed",
          triangle: "Offense %",
          cross: "Offense %",
        },
        setRes: {
          "Speed %": 1,
          "Potency %": 1,
        }
      }),
    ],
    [],
    DamageType.special
  ),
  BT1: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 5, 0, 80, 0, 10, 0, 0, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
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
    ],
  ),
  C3POCHEWBACCA: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 80, 10, 0, 50, 0, 25, 0, 0, 0, 0)],
  ),
  C3POLEGENDARY: createCharacterSettings(
    [
      optimizationStrategy["Speedy debuffer"],
      optimizationStrategy.Speed,
      createOptimizationPlan('hSTR Phase 1', 0, 0, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Anti-Malak', 10, 0, 25, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0),
    ]
  ),
  CADBANE: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
  ),
  CALKESTIS: createCharacterSettings(
    [
      createOptimizationPlan('Default', 40, 0, 0, 0, -10, 15, 10, 0, 0, 12.5, 12.5, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
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
      }),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries & Set',
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
        }
      }),
    ],
  ),
  CANDEROUSORDO: createCharacterSettings(
    [
      createOptimizationPlan('Maul Lead', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0),
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default'),
    ],
  ),
  CAPTAINDROGAN: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 0, 100, 0, 10, 10, 0, 70, 20, 0, 0, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
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
      }),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries & Set',
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
        }
      }),
    ],
    [],
    DamageType.special
  ),
  CAPTAINREX: createCharacterSettings(
    [
      createOptimizationPlan('Default', 20, 0, 100, 0, 60, 10, 0, 0, 100, 0, 0, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
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
      }),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries & Set',
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
    ],
  ),
  CAPTAINTARPALS: createCharacterSettings(
    [createOptimizationPlan('Default', 50, 3, 100, 9, 3, 10, 25, 10, 0, 2, 2, 3, 3)],
  ),
  CARADUNE: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 0, 80, 100, 20, 0, 25, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Mothma Lead', 10, 10, 100, 0, 20, 20, 5, 0, 0, 5, 0, 0, 0),
    ]
  ),
  CARTHONASI: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
  ),
  CASSIANANDOR: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 20, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('AdRad', 10, 20, 100, 0, 25, 0, 0, 10, 0, 0, 0, 0, 0),
      fromShortOptimizationPlan({
        id: 'AdRad w/ Primaries',
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
    ['Rogue 1', 'SuperStar2D2'],
    DamageType.mixed
  ),
  CC2224: createCharacterSettings(
    [
      createOptimizationPlan('Leader', 0, 0, 100, 50, 25, 0, 25, 0, 50, 12.5, 12.5, 0, 0),
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Non-leader'),
    ],
    ['zody'],
    DamageType.mixed
  ),
  CEREJUNDA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 40, 15, 20, 0, 0, 10, 10, 0, 0, 12.5, 12.5, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
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
      }),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries & Set',
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
    ],
  ),
  CHEWBACCALEGENDARY: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Default'),
      createOptimizationPlan('Tenacity', 25, 25, 100, 0, 0, 80, 10, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Chew Mix', 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3 Greedo', 0, 0, 75, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0)
    ],
    ['Chex Mix']
  ),
  CHIEFCHIRPA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 12, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
        health: 12,
        spd: 100,
        primaryRes: {
          triangle: "Health %",
          cross: "Health %",
          circle: "Health %",
        },
      }),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries & Sets',
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
      toRenamed(optimizationStrategy.Speed, 'Speed'),
      fromShortOptimizationPlan({
        id: 'Speed w/ Primaries',
        spd: 100,
        primaryRes: {
          triangle: "Critical Chance %",
          cross: "Protection %",
          circle: "Protection %",
        },
      }),
    ],
    ['Murderbears']
  ),
  CHIEFNEBIT: createCharacterSettings(
    [
      createOptimizationPlan('Default', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Detonator', 60, 60, 100, 0, 0, 0, 0, 0, 0, 50, 0, 0, 25),
    ],
    ['nebs'],
  ),
  CHIRRUTIMWE: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 0, 20, 25, 0, 50, 0, 0, 0, 0),
      toRenamed(optimizationStrategy["Speedy Chex Mix"], 'Chex Mix')
    ],
    ['Rogue 1', 'Chaze', 'Chiggs', 'Chex Mix']
  ),
  CHOPPERS3: createCharacterSettings(
    [
      createOptimizationPlan('Default', 50, 0, 100, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
        health: 50,
        spd: 100,
        pot: 20,
        ten: 20,
        primaryRes: {
          arrow: "Speed",
          cross: "Tenacity %",
          circle: "Health %",
        },
      }),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries & Sets',
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
    ],
  ),
  CLONESERGEANTPHASEI: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
    ['Sarge']
  ),
  CLONEWARSCHEWBACCA: createCharacterSettings(
    [createOptimizationPlan('Tanky', 50, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0)],
    ['CWC']
  ),
  COLONELSTARCK: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 10, 5, 0, 5, 0, 5, 0, 0, 0, 0)],
    ['Tony Stark', 'Troopers']
  ),
  COMMANDERAHSOKA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 5, 0, 100, 50, 0, 0, 0, 30, 0, 0, 0, 0, 0),
      createOptimizationPlan('Health', 10, 0, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0),
      createOptimizationPlan('Crit.Dmg', 5, 0, 25, 100, 0, 0, 0, 30, 0, 0, 0, 0, 0),
    ],
    ['CAT'],
    DamageType.special
  ),
  COMMANDERLUKESKYWALKER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 25, 0, 25, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Chewpio', 10, 10, 100, 0, 10, 50, 50, 0, 0, 0, 0, 0, 0),
      toRenamed(optimizationStrategy["Speedy Chex Mix"], 'Chex Mix'),
      createOptimizationPlan('Raids', 0, 0, 100, 0, 25, 0, 25, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Slow and Strong', 0, 0, 0, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0),
    ],
    ['CLS', 'Wampanader', 'Chex Mix', 'ABC', 'Titans'],
  ),
  CORUSCANTUNDERWORLDPOLICE: createCharacterSettings(
    [createOptimizationPlan('Why?', 0, 0, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0)],
    ['CUP']
  ),
  COUNTDOOKU: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 0, 50, 50, 25, 25, 0, 0, 0, 0, 0)],
    [],
    DamageType.mixed
  ),
  CT5555: createCharacterSettings(
    [
      createOptimizationPlan('Default', 15, 30, 50, 0, 15, 0, 25, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('KAM', 30, 15, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('KAM/CA', 30, 15, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100),
    ],
  ),
  CT7567: createCharacterSettings(
    [
      createOptimizationPlan('Default', 5, 0, 100, 0, 5, 10, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('KAM', 10, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      toRenamed(optimizationStrategy.Speed, 'Chex Mix'),
    ],
    ['Titans'],
  ),
  CT210408: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 50, 0, 75, 75, 0, 0, 0, 0, 0),
      createOptimizationPlan('Nuke', 0, 0, 50, 100, 0, 0, 75, 75, 25, 0, 0, 0, 0),
      createOptimizationPlan('KAM', 5, 0, 50, 100, 0, 0, 20, 20, 50, 0, 0, 0, 0),
      createOptimizationPlan('KAM/CA', 5, 0, 50, 100, 0, 0, 20, 20, 50, 0, 0, 0, 100),
    ],
    [],
    DamageType.mixed
  ),
  DAKA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 25, 0, 100, 0, 25, 15, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Tanky', 75, 0, 100, 0, 30, 15, 0, 0, 0, 0, 0, 0, 100),
      createOptimizationPlan('hSTR Phase 4', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3', 50, 0, 75, 0, 15, 0, 5, 0, 0, 0, 0, 0, 0),
    ],
    ['NS', 'hSTR NS']
  ),
  DARKTROOPER: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 10, 50, 0, 0, 5, 60, 0, 0, 2.5, 2.5, 0, 0)],
  ),
  DARTHBANE: createCharacterSettings(
    [createOptimizationPlan('Default', 50, 3, 100, 9, 3, 10, 25, 10, 0, 2, 2, 3, 3)],
  ),
  DARTHMALAK: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 50, 100, 0, 10, 0, 10, 0, 0, 10, 0, 0, 0),
      createOptimizationPlan('Tenacity', 0, 50, 100, 0, 10, 100, 10, 0, 0, 10, 0, 0, 0),
    ],
  ),
  DARTHMALGUS: createCharacterSettings(
    [createOptimizationPlan('Default', 50, 10, 100, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0)],
  ),
  DARTHNIHILUS: createCharacterSettings(
    [
      createOptimizationPlan('Default', 30, 0, 100, 0, 50, 60, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Tanky', 40, 0, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 100),
    ],
    ['Nightmare'],
    DamageType.special
  ),
  DARTHREVAN: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 0, 100, 50, 5, 0, 0, 10, 5, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  DARTHSIDIOUS: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 0, 25, 0, 50, 0, 0, 0, 0, 0, 0)],
    ['Auto Lightzader']
  ),
  DARTHSION: createCharacterSettings(
    [
      createOptimizationPlan('Default', 25, 30, 100, 0, 5, 0, 0, 0, 0, 20, 0, 0, 0),
      createOptimizationPlan('Default/CA', 25, 30, 100, 0, 5, 0, 0, 0, 0, 20, 0, 0, 100),
    ],
    ['Nightmare']
  ),
  DARTHTALON: createCharacterSettings(
    [
      createOptimizationPlan('Default', 15, 25, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0),
    ],
  ),
  DARTHTRAYA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 15, 10, 100, 0, 5, 0, 0, 15, 0, 0, 0, 0, 0),
      createOptimizationPlan('Tanky', 25, 75, 65, 0, 0, 65, 0, 0, 0, 0, 0, 0, 100)
    ],
    [],
    DamageType.special
  ),
  DASHRENDAR: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 0, 100, 60, 5, 0, 50, 0, 10, 0, 0, 0, 0)],
  ),
  DATHCHA: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default'),
      createOptimizationPlan('Detonator', 100, 100, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 100),
    ],
    [],
    DamageType.mixed
  ),
  DEATHTROOPER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 25, 0, 25, 0, 25, 0, 0, 0, 0),
      createOptimizationPlan('Iden Lead', 10, 10, 100, 100, 40, 0, 25, 0, 0, 0, 0, 0, 0),
      fromShortOptimizationPlan({
        id: 'hSTR Phase 3',
        phys: 100,
        targetStats: [
          createTargetStat('Speed', '+', 175, 179, 'null'),
        ],
      }),
    ],
    ['Troopers', 'Chex Mix'],
  ),
  DENGAR: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 0, 60, 0, 0, 0, 100, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0),
    ]
  ),
  DIRECTORKRENNIC: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Special Damage, Potency"], 'Default')],
    ['Imperial Grancor Maneuver'],
    DamageType.special
  ),
  DOCTORAPHRA: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 90, 0, 100, 0, 0, 20, 0, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  DROIDEKA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 10, 0, 0, 10, 20, 100, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Maul Kickstarter', 0, 5, 100, 0, 5, 5, 20, 0, 0, 0, 0, 0, 0),
    ],
  ),
  EETHKOTH: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Special Damage, Potency"], 'Default')],
    [],
    DamageType.mixed
  ),
  EIGHTHBROTHER: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 5, 100, 50, 0, 0, 30, 0, 5, 0, 0, 0, 0)],
  ),
  EMBO: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 20, 100, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 50, 25, 0, 0, 75, 0, 100, 0, 0, 0, 0),
    ]
  ),
  EMPERORPALPATINE: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Special Damage with Potency"], 'Default'),
      createOptimizationPlan('Tanky', 0, 100, 70, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
    ['EP', 'Palp', 'EzPz', 'Nightmare'],
    DamageType.special
  ),
  ENFYSNEST: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 0, 100, 50, 25, 100, 10, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Speedy', 0, 0, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0),
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Offense'),
      createOptimizationPlan('Tenacity', 10, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3', 25, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0),
    ],
    ['Nesty', 'Baby Wampa', 'solo'],
    DamageType.special
  ),
  EPIXFINN: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 50, 0, 0, 0, 25, 0, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  EPIXPOE: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 100, 25, 0, 0, 20, 20, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  EWOKELDER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 25, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries',
        health: 25,
        spd: 100,
        ten: 50,
        primaryRes: {
          triangle: "Health %",
          cross: "Tenacity %",
          circle: "Health %",
        },
      }),
      fromShortOptimizationPlan({
        id: 'Default w/ Primaries & Sets',
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
    ['EE', 'Murderbears'],
  ),
  EWOKSCOUT: createCharacterSettings(
    [
      createOptimizationPlan('Default', 15, 0, 100, 0, 50, 0, 50, 0, 20, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 15, 0, 100, 0, 50, 0, 50, 0, 20, 0, 0, 0, 0, 5, {
        triangle: "Offense %",
        cross: "Potency %",
        circle: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 15, 0, 100, 0, 50, 0, 50, 0, 20, 0, 0, 0, 0, 5, {
        triangle: "Offense %",
        cross: "Potency %",
        circle: "Health %",
      }, {
        "Offense %": 1,
        "Potency %": 1,
      }),
      createOptimizationPlan('hSTR Phase 2', 0, 0, 50, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0),
    ],
    ['Murderbears'],
  ),
  EZRABRIDGERS3: createCharacterSettings(
    [
      createOptimizationPlan('Default', 5, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 5, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
        cross: "Offense %",
        circle: "Health %",
      }),
      createOptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 50, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('hSTR P2 Jedi', 0, 0, 60, 100, 0, 0, 75, 0, 75, 0, 0, 0, 0),
    ],
  ),
  FENNECSHAND: createCharacterSettings(
    [
      createOptimizationPlan('Default - Offense', 0, 0, 100, 0, 0, 0, 0, 75, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default - Crit.Dmg', 0, 0, 100, 100, 0, 0, 0, 100, 50, 0, 0, 0, 0),
    ],
    [],
    DamageType.special
  ),
  FIFTHBROTHER: createCharacterSettings(
    [createOptimizationPlan('Default', 20, 10, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  FINN: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Slow Crit, Physical Damage, Potency"], 'Default'),
      createOptimizationPlan('Tanky', 30, 100, 100, 0, 5, 5, 50, 0, 0, 10, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 1', 0, -5, 80, 100, 0, 0, 50, 0, 75, 0, 0, 0, 0),
    ],
    ['Zinn']
  ),
  FIRSTORDEREXECUTIONER: createCharacterSettings(
    [createOptimizationPlan('Default', 25, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0)],
    ['Fox', 'Panda', 'Foe', 'FO']
  ),
  FIRSTORDEROFFICERMALE: createCharacterSettings(
    [toRenamed(optimizationStrategy.Speed, 'Speed')],
    ['Foo', 'FO']
  ),
  FIRSTORDERSPECIALFORCESPILOT: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Mixed Damage, Potency"], 'Default')],
    ['SFTP', 'FO'],
    DamageType.mixed
  ),
  FIRSTORDERTIEPILOT: createCharacterSettings(
    [createOptimizationPlan('Default', 20, 0, 100, 100, 10, 0, 50, 0, 0, 0, 0, 0, 0)],
    ['FOTP', 'FO'],
  ),
  FIRSTORDERTROOPER: createCharacterSettings(
    [createOptimizationPlan('Default', 30, 40, 100, 0, 0, 10, 0, 0, 0, 30, 0, 0, 0)],
    ['FOST', 'FO'],
  ),
  FOSITHTROOPER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 25, 100, 0, 0, 80, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Tanky', 40, 0, 100, 50, 0, 0, 50, 0, 0, 0, 0, 0, 0),
    ],
  ),
  FULCRUMAHSOKA: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Default'),
      createOptimizationPlan('Omicron', 10, 0, 50, 100, 0, -30, 75, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Omicron w/ Primaries', 10, 0, 50, 0, 0, -30, 100, 0, 50, 0, 0, 0, 0, 5, {
        arrow: "Offense %",
        triangle: "Critical Damage %",
        cross: "Offense %",
      }),
    ],
    ['ATF', 'FAT'],
  ),
  GAMORREANGUARD: createCharacterSettings(
    [createOptimizationPlan('Default', 75, 0, 100, 0, 75, 100, 0, 0, 0, 50, 0, 0, 0)],
    ['Piggy']
  ),
  GARSAXON: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 0, 25, 0, 75, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 0, 0, 100, 0, 25, 0, 75, 0, 0, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Offense %",
        cross: "Offense %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 0, 0, 100, 0, 25, 0, 75, 0, 0, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Offense %",
        cross: "Offense %",
      }, {
        "Offense %": 1,
        "Potency %": 1,
      }),
    ],
  ),
  GENERALHUX: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 10, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 15)],
    [],
    DamageType.special
  ),
  GENERALKENOBI: createCharacterSettings(
    [
      createOptimizationPlan('Speedy Tank', 25, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
      createOptimizationPlan('Balanced', 50, 100, 50, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0),
      createOptimizationPlan('Slow Tank', 50, 100, 0, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0),
      createOptimizationPlan('Padme Lead', 100, 0, 50, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0),
      createOptimizationPlan('JMK Lead', 100, 0, 0, 0, 0, 50, 0, 0, 0, 50, 0, 0, 0),
      createOptimizationPlan('hSTR P2 Jedi', 0, 100, 50, 0, 0, 0, 10, 0, 25, 100, 0, 0, 0),
    ],
    ['GK', 'Titans']
  ),
  GENERALSKYWALKER: createCharacterSettings(
    [
      createOptimizationPlan('Default - Defense', 10, 25, 100, 0, 20, 0, 10, 0, 0, 10, 10, 0, 0),
      createOptimizationPlan('Default - Offense', 0, 0, 100, 100, 20, 0, 20, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default - Parry', 0, 75, 100, 0, 25, 0, 50, 0, 0, 10, 0, 0, 0),
    ],
    ['GAS']
  ),
  GEONOSIANBROODALPHA: createCharacterSettings(
    [
      createOptimizationPlan('Tanky', 20, 20, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Offense', 0, 0, 100, 50, 0, 10, 20, 0, 20, 0, 0, 0, 0),
    ]
  ),
  GEONOSIANSOLDIER: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 80, 90, 0, 0, 50, 0, 100, 0, 0, 0, 0)],
  ),
  GEONOSIANSPY: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Default')],
  ),
  GLLEIA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 20, 15, 100, 0, 15, 0, 5, 0, 0, 10, 10, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 20, 15, 100, 0, 15, 0, 5, 0, 0, 10, 10, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Health %",
        circle: "Health %",
        cross: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 20, 15, 100, 0, 15, 0, 5, 0, 0, 10, 10, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Health %",
        circle: "Health %",
        cross: "Health %",
      }, {
        "Speed %": 1,
      }),
    ],
    ['Murderbears']
  ),
  GLREY: createCharacterSettings(
    [
      createOptimizationPlan('Default - Health', 50, 0, 100, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default - Offense', 15, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0),
    ]
  ),
  GRANDADMIRALTHRAWN: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 20, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0)],
    ['GAT', 'Imperial Grancor Maneuver', 'Wampanader', 'ABC', 'Titans'],
    DamageType.special
  ),
  GRANDINQUISITOR: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 5, 100, 50, 0, 0, 30, 0, 5, 0, 0, 0, 0)],
  ),
  GRANDMASTERLUKE: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 25, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0)],
    ['GMLS', 'JMLS', 'GLLS'],
    DamageType.special
  ),
  GRANDMASTERYODA: createCharacterSettings(
    [
      createOptimizationPlan('Speedy', 0, 0, 100, 50, 25, 0, 0, 80, 25, 0, 0, 0, 0),
      createOptimizationPlan('Offense', 0, 0, 50, 100, 0, 0, 0, 100, 25, 0, 0, 0, 0),
      createOptimizationPlan('Health', 20, 0, 100, 0, 5, 0, 0, 20, 5, 0, 0, 0, 0),
      createOptimizationPlan('hSTR P1 Yodalicious', 0, -5, 100, 100, 0, 0, 0, 100, 50, 0, 0, 0, 0),
      createOptimizationPlan('hSTR P2 Bastila', 0, 0, 60, 100, 0, 0, 0, 75, 80, 0, 0, 0, 0),
    ],
    ['GMY'],
    DamageType.special
  ),
  GRANDMOFFTARKIN: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 100, 25, 0, 15, 15, 50, 0, 0, 0, 0)],
    ['GMT', 'Auto Lightzader', 'Imperial Grancor Maneuver'],
    DamageType.mixed
  ),
  GREEDO: createCharacterSettings(
    [
      createOptimizationPlan('Crits', 0, 0, 100, 50, 25, 0, 25, 0, 100, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, 5, {}, {},
        [createTargetStat('Speed', '+', 170, 174, 'null')]
      )
    ]
  ),
  GREEFKARGA: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 5, 100, 0, 5, 10, 0, 0, 0, 0, 0, 0, 0)],
  ),
  GRIEVOUS: createCharacterSettings(
    [
      createOptimizationPlan('Default', 100, 0, 80, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Fast', 20, 0, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Nuke', 100, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
    ['GG'],
  ),
  GUNGANPHALANX: createCharacterSettings(
    [createOptimizationPlan('Default', 12, 44, 100, 0, 15, 0, 0, 0, 0, 5, 5, 0, 0, 5, true)],
  ),
  HANSOLO: createCharacterSettings(
    [
      createOptimizationPlan('Fast Han', 0, 0, 100, 100, 10, 0, 25, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Slow Han', 0, 0, 0, 100, 25, 0, 50, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Non-relic', 0, 0, 100, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Chex Mix', 0, 0, 0, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, 5, {}, {},
        [createTargetStat('Speed', '+', 170, 174, 'null')],
      ),
    ],
    ['Raid Han', 'rHan', 'OG Han', 'Zolo', 'Chex Mix', 'Titans'],
  ),
  HERASYNDULLAS3: createCharacterSettings(
    [
      createOptimizationPlan('Default', 20, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 20, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0, 5, {
        cross: "Potency %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 20, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0, 5, {
        cross: "Potency %",
      }, {
        "Speed %": 1,
        "Health %": 1,
      }),
    ],
  ),
  HERMITYODA: createCharacterSettings(
    [optimizationStrategy.Speed],
    ['Hyoda', 'Hoboda', 'Hobo', 'HY'],
    DamageType.mixed
  ),
  HK47: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 75, 0, 0, 50, 0, 25, 0, 0, 0, 0),
    ]
  ),
  HONDO: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 5, 100, 75, 0, 0, 0, 75, 0, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  HOTHHAN: createCharacterSettings(
    [createOptimizationPlan('Default', 20, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0)],
    ['CHS', 'CHolo', 'Snolo', 'Hoth Han']
  ),
  HOTHLEIA: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 50, 50, 0, 25, 0, 30, 0, 0, 0, 0)],
    ['ROLO']
  ),
  HOTHREBELSCOUT: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default'),
      createOptimizationPlan('Mothma Lead', 5, 10, 100, 0, 5, 5, 75, 0, 100, 5, 0, 0, 0),
    ],
    ['HRS', 'Hoth Bros']
  ),
  HOTHREBELSOLDIER: createCharacterSettings(
    [createOptimizationPlan('Default', 25, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)],
    ['HRS', 'Hoth Bros']
  ),
  HUMANTHUG: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
  ),
  IDENVERSIOEMPIRE: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 50, 0, 25, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Wampa Slayer', 0, 0, 100, 30, 100, 0, 10, 0, 0, 0, 0, 0, 0),
    ],
  ),
  IG11: createCharacterSettings(
    [createOptimizationPlan('Tanky', 25, 0, 50, 0, 0, 10, 5, 0, 5, 5, 5, 0, 0)],
  ),
  IG12: createCharacterSettings(
    [
      createOptimizationPlan('GIMO Default', 20, 5, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default', 20, 5, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Health %",
        cross: "Health %",
        circle: "Health %",
      }, {
        "Health %": 1,
        "Speed %": 1,
      }),
    ],
  ),
  IG86SENTINELDROID: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Default')],
  ),
  IG88: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Damage'),
      createOptimizationPlan('Nuke', 0, 0, 100, 25, 50, 0, 25, 0, 75, 0, 0, 0, 0),
    ]
  ),
  IMAGUNDI: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
    ['IGD']
  ),
  IMPERIALPROBEDROID: createCharacterSettings(
    [
      createOptimizationPlan('Tanky', 50, 50, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Offense', 0, 0, 100, 80, 50, 0, 25, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Nuke', 50, 50, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
    ['IPD']
  ),
  IMPERIALSUPERCOMMANDO: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 15, 100, 0, 20, 0, 100, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 0, 15, 100, 0, 20, 0, 100, 0, 0, 0, 0, 0, 0, 5, {
        arrow: "Offense %",
        triangle: "Offense %",
        circle: "Protection %",
        cross: "Offense %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 0, 15, 100, 0, 20, 0, 100, 0, 0, 0, 0, 0, 0, 5, {
        arrow: "Offense %",
        triangle: "Offense %",
        circle: "Protection %",
        cross: "Offense %",
      }, {
        "Offense %": 1,
      }),
    ],
    ['ISC']
  ),
  JABBATHEHUTT: createCharacterSettings(
    [createOptimizationPlan('Default', 15, 0, 100, 0, 25, 50, 0, 0, 0, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  JANGOFETT: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
  ),
  JARJARBINKS: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 20, 100, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 5, true)],
    [],
    DamageType.special
  ),
  JAWA: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Mixed Damage, Potency"], 'Default'),
      createOptimizationPlan('Detonator', 100, 100, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 100),
    ],
    [],
    DamageType.mixed
  ),
  JAWAENGINEER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 0, 100, 0, 50, 10, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Detonator', 20, 10, 100, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0),
    ],
    [],
    DamageType.mixed
  ),
  JAWASCAVENGER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 25, 50, 0, 25, 0, 100, 0, 0, 0, 0),
      createOptimizationPlan('Detonator', 100, 100, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 100),
    ],
  ),
  JEDIKNIGHTCAL: createCharacterSettings(
    [
      createOptimizationPlan('GIMO Default', 25, 0, 100, 25, 0, 0, 75, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default', 25, 0, 100, 98, 2, 2, 3, 6, 2, 1, 1, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Critical Damage %",
        circle: "Health %",
        cross: "Offense %",
        }, {
          "Health %": 1,
          "Offense %": 1,
        },
      ),
      createOptimizationPlan('Debuffer', 5, 0, 100, 0, 35, 0, 20, 0, 0, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Offense %",
        cross: "Potency %",
        circle: "Health %",
      }, {
        "Potency %": 1,
      }),
    ],
    ['JKCK'],
  ),
  JEDIKNIGHTCONSULAR: createCharacterSettings(
    [createOptimizationPlan('Healer', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)],
    ['JC'],
    DamageType.mixed
  ),
  JEDIKNIGHTGUARDIAN: createCharacterSettings(
    [createOptimizationPlan('Default', 40, 20, 100, 0, 50, 25, 0, 0, 0, 12.5, 12.5, 0, 0)],
    ['JKG']
  ),
  JEDIKNIGHTLUKE: createCharacterSettings(
    [
      createOptimizationPlan('Leader', 5, 5, 0, 100, 25, 0, 50, 0, 15, 0, 0, 0, 0),
      createOptimizationPlan('Non-leader', 5, 5, 25, 100, 25, 0, 50, 0, 15, 0, 0, 0, 0),
    ],
    ['JKL']
  ),
  JEDIKNIGHTREVAN: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 50, 0, 0, 0, 10, 0, 0, 0, 0, 0),
      createOptimizationPlan('Health', 10, 0, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0),
    ],
    [],
    DamageType.special
  ),
  JEDIMASTERKENOBI: createCharacterSettings(

    [createOptimizationPlan('Default', 5, 0, 100, 25, 0, 0, 10, 0, 0, 0, 0, 0, 0)],
    ['JMK'],
  ),
  JOLEEBINDO: createCharacterSettings(
    [
      createOptimizationPlan('Default', 50, 0, 75, 0, 0, 100, 0, 0, 0, 0, 0, 0, 100),
      createOptimizationPlan('Health and Speed', 100, 0, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Healer', 30, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0),
    ]
  ),
  JUHANI: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 100, 90, 0, 5, 0, 0, 0, 0, 15, 0, 0, 0)],
  ),
  JYNERSO: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 50, 50, 0, 20, 0, 75, 0, 0, 0, 0),
      createOptimizationPlan('AdRad', 10, 0, 100, 100, 25, 0, 20, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('AdRad w/ Primaries', 10, 0, 100, 0, 25, 0, 20, 0, 50, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
        cross: "Potency %",
        circle: "Health %",
      }),
    ],
    ['Rogue 1', 'Auto Lightzader', 'Imperial Grancor Maneuver', 'SuperStar2D2'],
  ),
  K2SO: createCharacterSettings(
    [
      createOptimizationPlan('Tanky', 20, 20, 100, 0, 50, 50, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('AdRad', 20, 40, 50, 0, 50, 50, 0, 0, 0, 10, 10, 0, 0),
      createOptimizationPlan('AdRad w/ Primaries', 20, 40, 50, 0, 50, 50, 0, 0, 0, 10, 10, 0, 0, 5, {
        arrow: "Protection %",
        triangle: "Protection %",
        cross: "Tenacity %",
        circle: "Protection %",
      }),
    ],
    ['Rogue 1', 'Cass-2SO', 'K2'],
  ),
  KANANJARRUSS3: createCharacterSettings(
    [
      createOptimizationPlan('Default', 40, 0, 100, 0, 0, 0, 10, 0, 30, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 40, 0, 100, 0, 0, 0, 10, 0, 30, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Health %",
        cross: "Health %",
        circle: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 40, 0, 100, 0, 0, 0, 10, 0, 30, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Health %",
        cross: "Health %",
        circle: "Health %",
      }, {
        "Health %": 2,
        "Tenacity %": 1,
      }),
    ],
  ),
  KELLERANBEQ: createCharacterSettings(
    [
      createOptimizationPlan('GIMO Default', 20, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default', 20, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, {
        arrow: "Protection %",
        triangle: "Protection %",
        cross: "Protection %",
        circle: "Protection %",
      }, {
        "Health %": 3,
      }),
    ],
  ),
  KIADIMUNDI: createCharacterSettings(
    [
      createOptimizationPlan('Balanced', 10, 10, 100, 50, 20, 0, 50, 0, 25, 10, 10, 0, 0),
      createOptimizationPlan('Offense', 0, 0, 100, 50, 20, 0, 75, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Defense', 20, 20, 100, 0, 20, 10, 0, 0, 0, 15, 15, 0, 0),
    ]
  ),
  KITFISTO: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Default')],
    ['Fisty', 'Fister']
  ),
  KRRSANTAN: createCharacterSettings(
    [createOptimizationPlan('Default', 30, 30, 100, 0, 10, 10, 0, 0, 0, 25, 0, 0, 0)],
  ),
  KUIIL: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 10, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  KYLEKATARN: createCharacterSettings(
    [createOptimizationPlan('Mothma Lead', 5, 0, 100, 0, 5, 5, 50, 0, 0, 5, 0, 0, 0)],
  ),
  KYLOREN: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 50, 0, 0, 25, 0, 25, 0, 0, 0, 0)],
    ['Old Kylo', 'zylo', 'FO']
  ),
  KYLORENUNMASKED: createCharacterSettings(
    [
      createOptimizationPlan('Default', 75, 50, 100, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0),
      createOptimizationPlan('Tanky', 100, 100, 50, 0, 0, 75, 0, 0, 0, 37.5, 37.5, 0, 0),
      createOptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
    ['kru', 'matt', 'Snape', 'FO']
  ),
  L3_37: createCharacterSettings(
    [
      createOptimizationPlan('Tanky', 40, 20, 50, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
      createOptimizationPlan('Speedy', 40, 20, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
    ],
    ['solo']
  ),
  LOBOT: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0)]
  ),
  LOGRAY: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 0, 100, 40, 50, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 10, 0, 100, 40, 50, 0, 0, 0, 0, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
        cross: "Potency %",
        circle: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 10, 0, 100, 40, 50, 0, 0, 0, 0, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
        cross: "Potency %",
        circle: "Health %",
      }, {
        "Potency %": 1,
        "Health %": 2,
      }),
      createOptimizationPlan('hSTR Phase 2', 5, 5, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
    ['Murderbears'],
  ),
  LORDVADER: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 15, 100, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0)],
  ),
  LUKESKYWALKER: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
    ['farmboi']
  ),
  LUMINARAUNDULI: createCharacterSettings(
    [createOptimizationPlan('Default', 40, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0)],
  ),
  LUTHENRAEL: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 10, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, true)],
    ['Luthen'],
    DamageType.mixed
  ),
  MACEWINDU: createCharacterSettings(
    [
      createOptimizationPlan('Default', 15, 0, 100, 0, 50, 0, 0, 50, 0, 0, 0, 0, 0),
      createOptimizationPlan('Slow/Tanky', 100, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
    [],
    DamageType.special
  ),
  MAGMATROOPER: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default'),
      createOptimizationPlan('Anti-Traya', 0, 0, 25, 25, 50, 0, 25, 0, 25, 0, 0, 0, 0),
    ]
  ),
  MAGNAGUARD: createCharacterSettings(
    [
      createOptimizationPlan('Default', 30, 30, 100, 0, 20, 20, 0, 0, 0, 25, 0, 0, 100),
      createOptimizationPlan('Balanced', 20, 20, 100, 25, 50, 25, 25, 0, 25, 12.5, 12.5, 0, 0),
    ],
  ),
  MANDALORBOKATAN: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 0, 80, 0, 0, 0, 100, 0, 0, 12.5, 12.5, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 10, 0, 80, 0, 0, 0, 100, 0, 0, 12.5, 12.5, 0, 0, 5, {
        arrow: "Offense %",
        triangle: "Offense %",
        cross: "Offense %",
        circle: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 10, 0, 80, 0, 0, 0, 100, 0, 0, 12.5, 12.5, 0, 0, 5, {
        arrow: "Offense %",
        triangle: "Offense %",
        cross: "Offense %",
        circle: "Health %",
      }, {
        "Offense %": 1,
      }),
    ],
  ),
  MARAJADE: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 10, 100, 25, 25, 0, 0, 25, 10, 0, 0, 0, 0),
      createOptimizationPlan('Survivability', 0, 10, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
    [],
    DamageType.special
  ),
  MASTERQUIGON: createCharacterSettings(
    [createOptimizationPlan('Default', 15, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, true)],
    ['MQG', 'Quadme', 'Queeni'],
    DamageType.special
  ),
  MAUL: createCharacterSettings(
    [toRenamed(optimizationStrategy["Special Damage with Potency"], 'Default')]
  ),
  MAULS7: createCharacterSettings(
    [
      createOptimizationPlan('Default', 25, 25, 100, 0, 15, 0, 50, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('DS Mando', 0, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0),
    ]
  ),
  MERRIN: createCharacterSettings(
    [
      createOptimizationPlan('Default', 15, 0, 0, 0, 100, 0, 0, 40, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 15, 0, 0, 0, 100, 0, 0, 40, 0, 0, 0, 0, 0, 5, {
        cross: "Potency %",
        circle: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Set', 15, 0, 0, 0, 100, 0, 0, 40, 0, 0, 0, 0, 0, 5, {
        cross: "Potency %",
        circle: "Health %",
      }, {
        "Potency %": 3,
      }),
      createOptimizationPlan('Tenacity', 15, 0, 0, 0, 20, 60, 0, 30, 0, 0, 0, 0, 0),
      createOptimizationPlan('Tenacity w/ Primaries', 15, 0, 0, 0, 20, 60, 0, 30, 0, 0, 0, 0, 0, 5, {
        cross: "Tenacity %",
        circle: "Health %",
      }),
      createOptimizationPlan('Tenacity w/ Primaries & Sets', 15, 0, 0, 0, 0, 60, 0, 30, 0, 0, 0, 0, 0, 5, {
        cross: "Tenacity %",
        circle: "Health %",
      }, {
        "Tenacity %": 2,
        "Potency %": 1,
      }),
    ],
    [],
    DamageType.special,
  ),
  MISSIONVAO: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 100, 0, 0, 75, 0, 50, 0, 0, 0, 0)],
  ),
  MOFFGIDEONS1: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0)],
  ),
  MOFFGIDEONS3: createCharacterSettings(
    [createOptimizationPlan('Default', 3, 20, 100, 0, 4, 3, 2, 3, 4, 4, 4, 0, 0)],
  ),
  MONMOTHMA: createCharacterSettings(
    [createOptimizationPlan('Leader', 5, 5, 100, 0, 0, 25, 10, 0, 0, 0, 0, 0, 0)],
    ['MM']
  ),
  MORGANELSBETH: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 20, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, true)],
    ['Morgan', 'NS']
  ),
  MOTHERTALZIN: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 0, 50, 0, 0, 25, 10, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 0, 75, 25, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3', 0, -5, 0, 0, 10, 0, 0, 100, 0, 0, 0, 0, 0),
    ],
    ['MT', 'NS', 'hSTR NS'],
    DamageType.special
  ),
  NIGHTSISTERACOLYTE: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 0, 0, 50, 50, 80, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 2', 0, 0, 100, 100, 0, 0, 100, 100, 100, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 50, 50, 100, 0, 0, 0, 0),
    ],
    ['NA', 'NS'],
    DamageType.mixed
  ),
  NIGHTSISTERINITIATE: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Default'),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0),
    ],
    ['NI', 'NS']
  ),
  NIGHTSISTERSPIRIT: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 50, 25, 0, 75, 0, 50, 0, 0, 0, 0),
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default'),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 40, 0, 0, 100, 0, 0, 0, 0, 0, 0),
    ],
    ['NS']
  ),
  NIGHTSISTERZOMBIE: createCharacterSettings(
    [
      createOptimizationPlan('Strong Zombie', 20, 20, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Weak Zombie', 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, false),
      createOptimizationPlan('hSTR Phase 4', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 3', 20, 0, 100, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0),
    ],
    ['NS', 'hSTR NS']
  ),
  NIGHTTROOPER: createCharacterSettings(
    [createOptimizationPlan('Default', 50, 0, 100, 10, 0, 10, 25, 0, 0, 0, 0, 0, 0, 5, true)],
    ['NS', 'NT']
  ),
  NINTHSISTER: createCharacterSettings(
    [createOptimizationPlan('Default', 40, 50, 100, 0, 0, 40, 0, 0, 0, 30, 0, 0, 0)],
  ),
  NUTEGUNRAY: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed with survivability"], 'Default'),
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Damage')
    ]
  ),
  OLDBENKENOBI: createCharacterSettings(
    [createOptimizationPlan('Speed', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0)],
    ['OB']
  ),
  PADAWANOBIWAN: createCharacterSettings(
    [
      fromShortOptimizationPlan({
        id: "Default",
        spd: 30,
        cd: 100,
      }),
    ],
    ['POW', 'Quadme', 'Queeni'],
  ),
  PADMEAMIDALA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 35, 0, 100, 25, 15, 0, 10, 0, 10, 0, 0, 0, 0),
      createOptimizationPlan('Slow', 50, 0, 0, 25, 15, 0, 10, 0, 10, 0, 0, 0, 0),
    ],
    ['Padme']
  ),
  PAO: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default'),
      createOptimizationPlan('Mothma Lead', 10, 30, 100, 0, 5, 5, 100, 0, 0, 5, 0, 0, 0),
      toRenamed(optimizationStrategy["Speedy Chex Mix"], 'Chex Mix')
    ],
    ['Rogue 1', 'Chex Mix']
  ),
  PAPLOO: createCharacterSettings(
    [
      createOptimizationPlan('Default', 20, 0, 100, 0, 0, 10, 0, 0, 0, 5, 5, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 20, 0, 100, 0, 0, 10, 0, 0, 0, 5, 5, 0, 0, 5, {
        triangle: "Health %",
        cross: "Health %",
        circle: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 20, 0, 100, 0, 0, 10, 0, 0, 0, 5, 5, 0, 0, 5, {
        triangle: "Health %",
        cross: "Health %",
        circle: "Health %",
      }, {
        "Health %": 3,
      }),
      createOptimizationPlan('Fast Tank', 25, 25, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
    ],
    ['Murderbears'],
  ),
  PAZVIZSLA: createCharacterSettings(
    [
      createOptimizationPlan('GIMO Health', 75, 50, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0),
      createOptimizationPlan('Health', 75, 50, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 5, {
        triangle: "Health %",
        cross: "Health %",
        circle: "Health %",
      }, {
        "Health %": 3,
      }),
      createOptimizationPlan('Protection', 50, 75, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 5, {
        triangle: "Protection %",
        cross: "Protection %",
        circle: "Protection %",
      }, {
        "Health %": 3,
      }),
    ]
  ),
  PHASMA: createCharacterSettings(
    [createOptimizationPlan('Default', 20, 10, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0)],
    ['FO'],
  ),
  PLOKOON: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
    [],
    DamageType.mixed
  ),
  POE: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 10, 100, 0, 40, 20, 0, 0, 0, 5, 0, 0, 0)],
  ),
  POGGLETHELESSER: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speedy debuffer"], 'Default')]
  ),
  PRINCESSKNEESAA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 20, 0, 100, 50, 40, 0, 10, 0, 80, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 20, 0, 100, 50, 40, 0, 10, 0, 80, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Critical Damage %",
        cross: "Potency %",
        circle: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Set', 20, 0, 100, 50, 40, 0, 10, 0, 80, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Critical Damage %",
        cross: "Potency %",
        circle: "Health %",
      }, {
        "Potency %": 1,
        "Critical Chance %": 1,
        "Health %": 1,
      }),
    ],
  ),
  PRINCESSLEIA: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Default'),
      createOptimizationPlan('hSTR Phase 2', 0, 0, 50, 100, 0, 0, 25, 0, 50, 0, 0, 0, 0)
    ],
    ['Machine Gun']
  ),
  QIRA: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 50, 10, 0, 50, 0, 25, 0, 0, 0, 0)],
    ['solo'],
  ),
  QUEENAMIDALA: createCharacterSettings(
    [createOptimizationPlan('Default', 20, 10, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, true)],
    ['Quadme', 'Queeni']
  ),
  QUIGONJINN: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Special Damage, Potency"], 'Default'),
      createOptimizationPlan('Omicron', 0, 0, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 0),
      createOptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 25, 25, 50, 0, 0, 0, 0),
    ],
    ['QGJ'],
    DamageType.mixed
  ),
  R2D2_LEGENDARY: createCharacterSettings(
    [
      createOptimizationPlan('Default', 5, 5, 100, 0, 25, 10, 0, 0, 25, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 1', 10, -5, 100, 25, 25, 0, 25, 0, 50, 0, 0, 0, 0)
    ],
    ['Trashcan', 'R2z2', 'SuperStar2D2'],
    DamageType.mixed
  ),
  RANGETROOPER: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Default')],
    ['Troopers']
  ),
  RESISTANCEPILOT: createCharacterSettings(
    [toRenamed(optimizationStrategy["Slow Crit, Physical Damage, Potency"], 'Default')],
    ['RP']
  ),
  RESISTANCETROOPER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 10, 100, 25, 0, 50, 0, 100, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 1', 0, -5, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0)
    ],
    ['RT', 'res trooper']
  ),
  REY: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 0, 0, 25, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 1', 0, -5, 90, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0)
    ],
    ['scav rey']
  ),
  REYJEDITRAINING: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 20, 0, 20, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 1', 0, -5, 90, 100, 50, 0, 50, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('hSTR p1 C3PO', 0, -5, 90, 100, 60, 60, 50, 0, 0, 0, 0, 0, 0)
    ],
    ['JTR', 'RJT', 'Jedi Rey', 'Jey Z']
  ),
  ROSETICO: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 5, 100, 50, 30, 0, 20, 20, 25, 0, 0, 0, 0)],
    [],
    DamageType.mixed
  ),
  ROYALGUARD: createCharacterSettings(
    [
      createOptimizationPlan('Tanky', 50, 50, 25, 0, 0, 25, 0, 0, 0, 5, 5, 0, 0),
      createOptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
    ['RG', 'Red Guard']
  ),
  SABINEWRENS3: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default'),
      createOptimizationPlan('hSTR Phase 2', 20, 20, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    ]
  ),
  SANASTARROS: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 50, 5, 0, 0, 20, 0, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  SAVAGEOPRESS: createCharacterSettings(
    [
      createOptimizationPlan('Default/Omicron', 100, 0, 0, 0, 0, 0, 10, 0, 0, 50, 0, 0, 0),
      createOptimizationPlan('Balanced', 50, 0, 100, 25, 25, 25, 25, 0, 25, 12.5, 12.5, 0, 0),
    ],
    ['zavage']
  ),
  SAWGERRERA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 20, 0, 100, 0, 20, 0, 20, 0, 0, 0, 0, 0, 0),
    ],
  ),
  SCARIFREBEL: createCharacterSettings(
    [
      createOptimizationPlan('GIMO Default', 30, 10, 100, 0, 25, 10, 0, 0, 0, 10, 10, 0, 0),
      createOptimizationPlan('Health', 8, 12, 50, 0, 8, 12, 0, 0, 0, 10, 10, 0, 45, 5, {
        triangle: "Health %",
        cross: "Health %",
      }),
      createOptimizationPlan('Protection', 30, 20, 100, 0, 25, 10, 0, 0, 0, 10, 0, 0, 0, 5, {
        triangle: "Protection %",
        cross: "Protection %",
      }),
      createOptimizationPlan('hSTR Phase 2', 20, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
    ['Rogue 1', 'SRP'],
  ),
  SCOUTTROOPER_V3: createCharacterSettings(
    [
      createOptimizationPlan('Default', 5, 10, 100, 0, 30, 10, 15, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 5, 10, 100, 0, 30, 10, 15, 0, 0, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Offense %",
        cross: "Potency %",
      }),
      createOptimizationPlan('Default w/ Primaries & Set', 5, 10, 100, 0, 30, 10, 15, 0, 0, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        triangle: "Offense %",
        cross: "Potency %",
      }, {
        "Speed %": 1,
        "Potency %": 1,
      }),
    ],
    ['Rogue 1', 'SRP']
  ),
  SECONDSISTER: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 5, 100, 75, 0, 0, 0, 100, 30, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  SEVENTHSISTER: createCharacterSettings(
    [createOptimizationPlan('Default', 20, 10, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0)],
  ),
  SHAAKTI: createCharacterSettings(
    [
      createOptimizationPlan('Default', 25, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Nuke', 25, 25, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('KAM', 20, 10, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('KAM/CA', 20, 10, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100),
    ],
  ),
  SHORETROOPER: createCharacterSettings(
    [
      createOptimizationPlan('Speedy Tank', 50, 50, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    ],
    ['ShT', 'Troopers', 'Imperial Grancor Maneuver']
  ),
  SITHASSASSIN: createCharacterSettings(
    [toRenamed(optimizationStrategy["Special Damage with Potency"], 'Default')],
    ['SA', 'Sassy']
  ),
  SITHMARAUDER: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
    ['SM']
  ),
  SITHPALPATINE: createCharacterSettings(
    [createOptimizationPlan('Default', 40, 5, 100, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0)],
    ['SEE'],
    DamageType.special
  ),
  SITHTROOPER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 25, 25, 50, 0, 0, 15, 0, 0, 0, 25, 25, 0, 0),
      createOptimizationPlan('DR Lead', 25, 50, 15, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0)
    ],
    ['SiT', 'Nightmare']
  ),
  SMUGGLERCHEWBACCA: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default'),
      createOptimizationPlan('Default', 0, 0, 100, 80, 25, 0, 60, 0, 25, 0, 0, 0, 0)
    ],
    ['Vets']
  ),
  SMUGGLERHAN: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default'),
      createOptimizationPlan('Default', 0, 0, 100, 80, 25, 0, 60, 0, 0, 0, 0, 0, 0)
    ],
    ['Vets']
  ),
  SNOWTROOPER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0),
      createOptimizationPlan('Iden Lead', 10, 10, 50, 100, 10, 0, 30, 0, 25, 0, 0, 0, 0),
    ],
    ['Troopers'],
  ),
  STAP: createCharacterSettings(
    [
      createOptimizationPlan('GIMO Default', 0, 0, 100, 10, 10, 0, 50, 0, 10, 0, 0, 0, 0),
      createOptimizationPlan('Default', 0, 0, 100, 10, 10, 0, 50, 0, 10, 0, 0, 0, 0, 5, {
          arrow: "Speed",
          triangle: "Critical Damage %",
          cross: "Offense %",
        }, {
          "Speed %": 1,
        }
      ),
    ],
  ),
  STARKILLER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 25, 0, 100, 75, 0, 0, 50, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 25, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
      }),
      createOptimizationPlan('Speedy', 10, 0, 100, 50, 0, 0, 30, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Speedy w/ Primaries', 10, 0, 100, 50, 0, 0, 30, 0, 0, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
      }),
    ],
  ),
  STORMTROOPER: createCharacterSettings(
    [
      createOptimizationPlan('Speedy Tank', 25, 25, 50, 0, 0, 25, 0, 0, 0, 25, 25, 0, 0),
      createOptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Iden Lead', 0, 75, 50, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0),
      createOptimizationPlan('Iden Lead w/ Primaries', 0, 100, 50, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, 5, {
        arrow: "Defense %",
        triangle: "Defense %",
        cross: "Defense %",
      }),
    ],
    ['Troopers'],
  ),
  STORMTROOPERHAN: createCharacterSettings(
    [createOptimizationPlan('Default', 25, 50, 50, 0, 100, 10, 0, 0, 0, 20, 0, 0, 0)],
    ['STHan']
  ),
  SUNFAC: createCharacterSettings(
    [createOptimizationPlan('Tanky', 40, 40, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0)]
  ),
  SUPREMELEADERKYLOREN: createCharacterSettings(
    [
      createOptimizationPlan('Default - Speed', 10, 0, 100, 50, 0, 0, 30, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default - Offense', 20, 0, 100, 100, 0, 0, 40, 0, 0, 0, 0, 0, 0),
    ],
  ),
  T3_M4: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 10, 100, 0, 25, 10, 0, 10, 10, 0, 0, 0, 0),
      createOptimizationPlan('Damage', 10, 20, 100, 50, 50, 10, 0, 20, 25, 0, 0, 0, 0),
      createOptimizationPlan('Nuke', 10, 50, 100, 0, 25, 10, 0, 0, 10, 0, 0, 0, 0),
    ],
    [],
    DamageType.special
  ),
  TALIA: createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Mixed Damage"], 'Default'),
      createOptimizationPlan('hSTR Phase 4', 0, 0, 0, 0, 0, 0, 100, 100, 100, 0, 0, 0, 0),
    ],
    ['NS', 'hSTR NS'],
    DamageType.mixed
  ),
  TARFFUL: createCharacterSettings(
    [
      createOptimizationPlan('Default', 30, 0, 100, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 30, 0, 100, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0, 5, {
        arrow: "Health %",
        triangle: "Health %",
        cross: "Health %",
        circle: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Set', 30, 0, 100, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0, 5, {
        arrow: "Health %",
        triangle: "Health %",
        cross: "Health %",
        circle: "Health %",
      }, {
        "Defense %": 3,
      }),
    ],
  ),
  TARONMALICOS: createCharacterSettings(
    [
      createOptimizationPlan('Fast Build', 20, 0, 100, 50, 0, 0, 40, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Fast Build w/ Primaries', 20, 0, 100, 50, 0, 0, 40, 0, 0, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
      }),
      createOptimizationPlan('Fast Build w/ Primaries & Sets', 20, 0, 100, 50, 0, 0, 40, 0, 0, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
      }, {
        "Offense %": 1,
        "Health %": 1,
      }),
      createOptimizationPlan('Slow Build', 40, 0, 100, 50, 0, 0, 60, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Slow Build w/ Primaries', 40, 0, 100, 50, 0, 0, 60, 0, 0, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
      }),
      createOptimizationPlan('Slow Build w/ Primaries & Sets', 40, 0, 100, 50, 0, 0, 60, 0, 0, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
      }, {
        "Offense %": 1,
        "Health %": 1,
      }),
    ],
  ),
  TEEBO: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 0, 100, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 10, 0, 100, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 5, {
        triangle: "Health %",
        cross: "Potency %",
        circle: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 10, 0, 100, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 5, {
        triangle: "Health %",
        cross: "Potency %",
        circle: "Health %",
      }, {
        "Potency %": 3,
      }),
    ],
    ['Teebotine', 'Murderbears']
  ),
  THEMANDALORIAN: createCharacterSettings(
    [
      createOptimizationPlan('Default', 5, 5, 100, 15, 0, 0, 5, 0, 30, 0, 0, 0, 0),
      createOptimizationPlan('Relic 7', 0, 0, 100, 80, 0, 0, 20, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Non-relic', 0, 0, 100, 80, 0, 0, 10, 0, 20, 0, 0, 0, 0),
    ],
  ),
  THEMANDALORIANBESKARARMOR: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 5, 100, 0, 15, 0, 30, 0, 0, 0, 0, 0, 0)],
  ),
  THIRDSISTER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 30, 5, 100, 50, 0, 0, 50, 0, 0, 5, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 30, 5, 100, 0, 0, 0, 50, 0, 0, 5, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
        circle: "Health %",
        cross: "Health %",
      }),
    ],
  ),
  TIEFIGHTERPILOT: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
    ['TFP', 'Auto Lightzader']
  ),
  TRENCH: createCharacterSettings(
    [createOptimizationPlan('Default', 20, 10, 100, 0, 30, 0, 0, 20, 0, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  TRIPLEZERO: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 0, 30, 0, 0, 20, 0, 0, 0, 0, 0)],
    [],
    DamageType.special
  ),
  TUSKENCHIEFTAIN: createCharacterSettings(
    [createOptimizationPlan('Default', 15, 10, 100, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0)],
  ),
  TUSKENHUNTRESS: createCharacterSettings(
    [createOptimizationPlan('Default', 0, 0, 100, 75, 10, 0, 40, 0, 10, 0, 0, 0, 0)],
  ),
  TUSKENRAIDER: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
  ),
  TUSKENSHAMAN: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 5, 100, 0, 30, 10, 0, 0, 0, 0, 0, 0, 0)],
  ),
  UGNAUGHT: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Mixed Damage, Potency"], 'Default')],
    [],
    DamageType.mixed
  ),
  UNDERCOVERLANDO: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 0, 100, 50, 0, 0, 25, 0, 25, 0, 0, 0, 0)],
  ),
  URORRURRR: createCharacterSettings(
    [createOptimizationPlan('Default', 10, 20, 100, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0)],
  ),
  VADER: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 100, 40, 0, 20, 0, 20, 0, 0, 0, 0),
      createOptimizationPlan('Raids', 0, 0, 100, 50, 25, 0, 25, 0, 25, 0, 0, 0, 0),
    ],
    ['Auto Lightzader', 'Wampanader', 'Nightmare'],
  ),
  VEERS: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Mixed Damage, Potency"], 'Default')],
    ['Troopers'],
    DamageType.mixed
  ),
  VISASMARR: createCharacterSettings(
    [
      createOptimizationPlan('Default', 25, 0, 100, 50, 0, 25, 50, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Healer', 50, 0, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('hSTR Phase 1', 25, -5, 0, 100, 0, 0, 50, 0, 75, 0, 0, 0, 0),
    ],
  ),
  WAMPA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 0, 80, 100, 10, 0, 50, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Omicron', 100, 0, 75, 0, 0, 75, 50, 0, 0, 20, 0, 0, 0),
      createOptimizationPlan('Omicron/Health', 100, 0, 75, 0, 0, 10, 10, 0, 0, 10, 0, 0, 0),
      createOptimizationPlan('Omicron/Tenacity', 30, 0, 15, 0, 0, 100, 30, 0, 0, 20, 0, 0, 0),
      createOptimizationPlan('Raids', 10, 0, 80, 100, 10, 0, 50, 0, 0, 0, 0, 0, 0),
    ],
    ['beast', 'Wampanader'],
  ),
  WATTAMBOR: createCharacterSettings(
    [
      createOptimizationPlan('Default', 30, 0, 100, 0, 25, 10, 0, 0, 0, 0, 0, 0, 0)
    ]
  ),
  WEDGEANTILLES: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Default')],
    ['Wiggs', 'chiggs', 'SuperStar2D2']
  ),
  WICKET: createCharacterSettings(
    [
      createOptimizationPlan('Default', 5, 0, 100, 100, 0, 0, 40, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 5, 0, 100, 100, 0, 0, 40, 0, 50, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
        cross: "Offense %",
        circle: "Health %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 5, 0, 100, 100, 0, 0, 60, 0, 50, 0, 0, 0, 0, 5, {
        triangle: "Critical Damage %",
        cross: "Offense %",
        circle: "Health %",
      }, {
        "Critical Damage %": 1,
        "Health %": 1,
      }),
      createOptimizationPlan('hSTR Phase 2', 0, 0, 80, 50, 0, 0, 100, 0, 10, 0, 0, 0, 0),
    ],
    ['Murderbears'],
  ),
  YOUNGCHEWBACCA: createCharacterSettings(
    [
      createOptimizationPlan('Default', 50, 0, 100, 50, 0, 0, 25, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('Tanky', 100, 0, 50, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0),
    ],
    ['Dwight', 'solo'],
  ),
  YOUNGHAN: createCharacterSettings(
    [
      createOptimizationPlan('Default', 10, 0, 100, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0),
      createOptimizationPlan('HAAT', 0, 0, 80, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0),
    ],
    ['YOLO', 'solo', 'Jim'],
  ),
  YOUNGLANDO: createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Default')],
    ['solo']
  ),
  ZAALBAR: createCharacterSettings(
    [createOptimizationPlan('Default', 50, 50, 25, 0, 25, 50, 0, 0, 0, 0, 0, 0, 50)],
  ),
  ZAMWESELL: createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 40, 50, 0, 25, 0, 40, 0, 0, 0, 0),
      createOptimizationPlan('Omicron', 10, 10, 100, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0),
    ],
  ),
  ZEBS3: createCharacterSettings(
    [
      createOptimizationPlan('Default', 40, 0, 100, 0, 50, 0, 20, 0, 0, 0, 0, 0, 0),
      createOptimizationPlan('Default w/ Primaries', 40, 0, 100, 0, 50, 0, 20, 0, 0, 0, 0, 0, 0, 5, {
        cross: "Potency %",
      }),
      createOptimizationPlan('Default w/ Primaries & Sets', 40, 0, 100, 0, 50, 0, 20, 0, 0, 0, 0, 0, 0, 5, {
        arrow: "Speed",
        cross: "Potency %",
      }, {
        "Health %": 3,
      }),
    ],
  ),
  ZORIIBLISS_V2: createCharacterSettings(
    [createOptimizationPlan('Default', 5, 10, 100, 50, 10, 0, 20, 0, 0, 0, 0, 0, 0)],
  ),
};

for (const charID in characterSettings) {
  Object.freeze(characterSettings[charID as CharacterNames]);
}

Object.freeze(characterSettings);

export { characterSettings };
