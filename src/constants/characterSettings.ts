// utils
import * as UtilityTypes from "#/utils/typeHelper";

// domain
import optimizationStrategy from "#/constants/optimizationStrategy";

import { createCharacterSettings, CharacterSettings, DamageType } from "#/domain/CharacterSettings";
import { createOptimizationPlan, toRenamed } from "#/domain/OptimizationPlan";
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
  'BOSSK',
  'BOUSHH',
  'BT1',
  'C3POCHEWBACCA',
  'C3POLEGENDARY',
  'CADBANE',
  'CALKESTIS',
  'CANDEROUSORDO',
  'CAPTAINDROGAN',
  'CAPTAINREX',
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
  'MACEWINDU',
  'MAGMATROOPER',
  'MAGNAGUARD',
  'MARAJADE',
  'MAUL',
  'MAULS7',
  'MERRIN',
  'MISSIONVAO',
  'MOFFGIDEONS1',
  'MONMOTHMA',
  'MOTHERTALZIN',
  'NIGHTSISTERACOLYTE',
  'NIGHTSISTERINITIATE',
  'NIGHTSISTERSPIRIT',
  'NIGHTSISTERZOMBIE',
  'NINTHSISTER',
  'NUTEGUNRAY',
  'OLDBENKENOBI',
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
    [createOptimizationPlan('PvP', 20, 10, 100, 0, 20, 0, 0, 0, 0, 25, 0, 0, 0, true)],
  ),
  'AAYLASECURA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 0, 75, 0, 10, 0, 100, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 50, 0, 0, 0, 0, 0, 0, true),
    ]
  ),
  'ADMINISTRATORLANDO': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 25, 0, 75, 0, 0, 0, 0, true)]
  ),
  'ADMIRALACKBAR': createCharacterSettings(
    [
      createOptimizationPlan('Survivability', 20, 20, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, true),
      optimizationStrategy.Speed
    ],
    ['AA', 'Snackbar', 'ABC']
  ),
  'ADMIRALPIETT': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 25, 15, 0, 10, 0, 10, 0, 0, 0, 0, true)]
  ),
  'ADMIRALRADDUS': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 10, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Protection', 10, 20, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Protection w/ Primaries', 10, 20, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true, {
        "triangle": "Protection %",
        "cross": "Protection %",
        "circle": "Protection %",
      }),
      createOptimizationPlan('Health', 20, 10, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Health w/ Primaries', 20, 10, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }),
    ],
    [],
    DamageType.special
  ),
  'AHSOKATANO': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 20, 0, 100, 50, 0, 0, 25, 0, 10, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 20, 0, 100, 50, 0, 0, 25, 0, 10, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Offense %",
        "circle": "Health %",
      }),
      createOptimizationPlan('Padme Lead', 10, 0, 100, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('Slow Damage', 25, 0, 0, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Snips']
  ),
  'AMILYNHOLDO': createCharacterSettings(
    [createOptimizationPlan('PvP', 20, 10, 100, 0, 50, 25, 0, 0, 0, 5, 5, 0, 0, true)],
    ['Hodor'],
    DamageType.mixed
  ),
  'ANAKINKNIGHT': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 75, 25, 0, 25, 0, 80, 0, 0, 0, 0, true),
      createOptimizationPlan('Padme Lead', 10, 0, 80, 100, 25, 0, 25, 0, 40, 0, 0, 0, 0, true),
      createOptimizationPlan('oQGJ Lead', 0, 0, 100, 100, 10, 0, 25, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('Chex Mix', 0, 0, 50, 0, 0, 0, 100, 0, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR P1 Jedi', 0, -5, 20, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('Slow Damage', 25, 0, 0, 100, 25, 0, 25, 0, 40, 0, 0, 0, 0, true),
      createOptimizationPlan('Nuke', 0, 0, 0, 100, 20, 0, 40, 0, 25, 0, 0, 0, 0, true),
    ],
    ['JKA']
  ),
  'ARCTROOPER501ST': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 0, 0, 0, 50, 0, 15, 0, 0, 0, 0, true),
      createOptimizationPlan('KAM', 10, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('KAM/CA', 10, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 100, true),
    ],
  ),
  'ARMORER': createCharacterSettings(
    [createOptimizationPlan('PvP', 10, 10, 100, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, true)],
  ),
  'ASAJVENTRESS': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 10, 10, 20, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 25, 25, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3', 15, 0, 50, 100, 0, 0, 30, 30, 0, 0, 0, 0, 0, true),
    ],
    ['AV', 'Zen', 'NS', 'hSTR NS', 'ABC'],
    DamageType.mixed
  ),
  'AURRA_SING': createCharacterSettings(
    [
      createOptimizationPlan('hSTR Phase 3', 0, 0, 75, 100, 0, 0, 50, 0, 10, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP', 0, 0, 100, 80, 20, 0, 50, 0, 25, 0, 0, 0, 0, true)
    ]
  ),
  'BADBATCHECHO': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speedy debuffer"], 'PvP')],
  ),
  'BADBATCHHUNTER': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 0, 15, 0, 25, 0, 0, 0, 0, 0, 0, true)],
  ),
  'BADBATCHOMEGA': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 50, 0, 25, 0, 100, 0, 0, 0, 0, 0, 0, true)]
  ),
  'BADBATCHTECH': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speedy debuffer"], 'PvP')],
    [],
    DamageType.special
  ),
  'BADBATCHWRECKER': createCharacterSettings(
    [createOptimizationPlan('PvP', 10, 30, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'B1BATTLEDROIDV2': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 0, 25, 0, 75, 0, 0, 0, 0, 0, 0, true)]
  ),
  'B2SUPERBATTLEDROID': createCharacterSettings(
    [
      createOptimizationPlan('Survival', 50, 50, 0, 0, 50, 25, 0, 0, 0, 0, 0, 50, 0, true),
      createOptimizationPlan('Tenacity', 50, 50, 0, 0, 50, 100, 0, 0, 0, 0, 0, 0, 100, true),
      createOptimizationPlan('Potency', 50, 50, 0, 0, 100, 50, 0, 0, 0, 0, 0, 0, 100, true),
    ]
  ),
  'BARRISSOFFEE': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 70, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR P1 Jedi', 75, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ],
  ),
  'BASTILASHAN': createCharacterSettings(
    [
      createOptimizationPlan('Leader', 10, 0, 100, 0, 50, 0, 0, 25, 0, 0, 0, 0, 0, true),
      toRenamed(optimizationStrategy["Special Damage with Potency"], 'Non-leader'),
      toRenamed(optimizationStrategy["Special Damage"], 'JKR Lead'),
      createOptimizationPlan('hSTR P2 Jedi', 0, 0, 100, 50, 0, 0, 0, 25, 50, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.special
  ),
  'BASTILASHANDARK': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Offensive', 0, 0, 100, 50, 5, 0, 0, 25, 0, 0, 0, 0, 0, true),
    ],
    [],
    DamageType.special
  ),
  'BAZEMALBUS': createCharacterSettings(
    [
      createOptimizationPlan('Slow Tank', 50, 50, 0, 0, 10, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      createOptimizationPlan('hSTR Phase 4', 10, 10, -100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Rogue 1', 'Chaze', 'Chiggs']
  ),
  'BB8': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 5, 5, 100, 0, 0, 10, 0, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 1', 10, -5, 100, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, true),
      optimizationStrategy.Speed,
      createOptimizationPlan('Tanky', 5, 25, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['bb8', 'Wampanader', 'ABC']
  ),
  'BENSOLO': createCharacterSettings(
    [createOptimizationPlan('PvP', 20, 0, 100, 0, 10, 0, 0, 70, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'BIGGSDARKLIGHTER': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'PvP')],
    ['Wiggs', 'Chiggs']
  ),
  'BISTAN': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP')],
    ['Rogue 1', 'SuperStar2D2']
  ),
  'BOBAFETT': createCharacterSettings(
    [
      createOptimizationPlan('PvE', 0, 0, 50, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true),
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP'),
      createOptimizationPlan('hSTR Phase 2', 0, 0, 100, 75, 0, 0, 25, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3 Greedo', 0, 0, 20, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'BOBAFETTSCION': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true),
    ]
  ),
  'BODHIROOK': createCharacterSettings(
    [createOptimizationPlan('PvP', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Rogue 1']
  ),
  'BOKATAN': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 10, 0, 50, 0, 0, 0, 0, true)],
  ),
  'BOSSK': createCharacterSettings(
    [
      createOptimizationPlan('Leader', 10, 10, 100, 0, 10, 25, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Non-leader', 10, 0, 100, 0, 10, 25, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'BOUSHH': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 0, 100, 50, 10, 0, 0, 20, 25, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'BT1': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 5, 0, 80, 0, 10, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 0, 0, 100, 50, 5, 0, 50, 0, 10, 0, 0, 0, 0, true, {
        "arrow": "Offense %",
        "triangle": "Critical Damage %",
        "cross": "Offense %",
      }),
    ],
  ),
  'C3POCHEWBACCA': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 80, 10, 0, 50, 0, 25, 0, 0, 0, 0, true)]
  ),
  'C3POLEGENDARY': createCharacterSettings(
    [
      optimizationStrategy["Speedy debuffer"],
      optimizationStrategy.Speed,
      createOptimizationPlan('hSTR Phase 1', 0, 0, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Anti-Malak', 10, 0, 25, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'CADBANE': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP')],
  ),
  'CALKESTIS': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 40, 0, 0, 0, -10, 15, 10, 0, 0, 12.5, 12.5, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 40, 0, 0, 0, -10, 15, 10, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries & Set', 40, 0, 0, 0, -10, 15, 10, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      },
      {
        "Health %": 2,
        "Defense %": 1,
      }),
    ],
  ),
  'CANDEROUSORDO': createCharacterSettings(
    [
      createOptimizationPlan('Maul Lead', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0, true),
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvE'),
    ],
  ),
  'CAPTAINDROGAN': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 0, 100, 0, 10, 10, 0, 70, 20, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 10, 0, 100, 0, 10, 10, 0, 70, 20, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Offense %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries & Set', 10, 0, 100, 0, 10, 10, 0, 70, 20, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Offense %",
        "circle": "Health %",
      }, {
        "Offense %": 1,
        "Health %": 1,
      }),
    ],
    [],
    DamageType.special
  ),
  'CAPTAINREX': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 20, 0, 100, 0, 60, 10, 0, 0, 100, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 20, 0, 100, 0, 60, 10, 0, 0, 100, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Chance %",
        "cross": "Potency %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries & Set', 20, 0, 100, 0, 60, 10, 0, 0, 100, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Chance %",
        "cross": "Potency %",
        "circle": "Health %",
      }, {
        "Potency %": 1,
        "Critical Chance %": 1,
        "Health %": 1,
      }),
    ],
  ),
  'CARADUNE': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 0, 80, 100, 20, 0, 25, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Mothma Lead', 10, 10, 100, 0, 20, 20, 5, 0, 0, 5, 0, 0, 0, true),
    ]
  ),
  'CARTHONASI': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP')]
  ),
  'CASSIANANDOR': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 20, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('AdRad', 10, 20, 100, 0, 25, 0, 0, 10, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('AdRad w/ Primaries', 10, 20, 100, 0, 25, 0, 0, 10, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Chance %",
        "cross": "Potency %",
        "circle": "Protection %",
      }),
    ],
    ['Rogue 1', 'SuperStar2D2'],
    DamageType.mixed
  ),
  'CC2224': createCharacterSettings(
    [
      createOptimizationPlan('Leader', 0, 0, 100, 50, 25, 0, 25, 0, 50, 12.5, 12.5, 0, 0, true),
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Non-leader')
    ],
    ['zody'],
    DamageType.mixed
  ),
  'CEREJUNDA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 40, 15, 20, 0, 0, 10, 10, 0, 0, 12.5, 12.5, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 40, 15, 20, 0, 0, 10, 10, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries & Set', 40, 15, 20, 0, 0, 10, 10, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      },
      {
        "Health %": 2,
        "Defense %": 1,
      }),
    ],
  ),
  'CHEWBACCALEGENDARY': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'PvP'),
      createOptimizationPlan('Tenacity', 25, 25, 100, 0, 0, 80, 10, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Chew Mix', 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3 Greedo', 0, 0, 75, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Chex Mix']
  ),
  'CHIEFCHIRPA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 12, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 12, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries & Sets', 12, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }, {
        "Speed %": 1,
        "Health %": 1,
      }),
      toRenamed(optimizationStrategy.Speed, 'Speed'),
      createOptimizationPlan('Speed w/ Primaries', 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Chance %",
        "cross": "Protection %",
        "circle": "Protection %",
      }),
    ],
    ['Murderbears']
  ),
  'CHIEFNEBIT': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Detonator', 60, 60, 100, 0, 0, 0, 0, 0, 0, 50, 0, 0, 25, true),
    ],
    ['nebs'],
  ),
  'CHIRRUTIMWE': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 0, 20, 25, 0, 50, 0, 0, 0, 0, true),
      toRenamed(optimizationStrategy["Speedy Chex Mix"], 'Chex Mix')
    ],
    ['Rogue 1', 'Chaze', 'Chiggs', 'Chex Mix']
  ),
  'CHOPPERS3': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 50, 0, 100, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 50, 0, 100, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "cross": "Tenacity %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 50, 0, 100, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "cross": "Tenacity %",
        "circle": "Health %",
      }, {
        "Health %": 3,
      }),
    ],
  ),
  'CLONESERGEANTPHASEI': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP')],
    ['Sarge']
  ),
  'CLONEWARSCHEWBACCA': createCharacterSettings(
    [createOptimizationPlan('Tanky', 50, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)],
    ['CWC']
  ),
  'COLONELSTARCK': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 10, 5, 0, 5, 0, 5, 0, 0, 0, 0)],
    ['Tony Stark', 'Troopers']
  ),
  'COMMANDERAHSOKA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 5, 0, 100, 50, 0, 0, 0, 30, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Health', 10, 0, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Crit.Dmg', 5, 0, 25, 100, 0, 0, 0, 30, 0, 0, 0, 0, 0, true),
    ],
    ['CAT'],
    DamageType.special
  ),
  'COMMANDERLUKESKYWALKER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 25, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('Chewpio', 10, 10, 100, 0, 10, 50, 50, 0, 0, 0, 0, 0, 0, true),
      toRenamed(optimizationStrategy["Speedy Chex Mix"], 'Chex Mix'),
      createOptimizationPlan('Raids', 0, 0, 100, 0, 25, 0, 25, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Slow and Strong', 0, 0, 0, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true),
    ],
    ['CLS', 'Wampanader', 'Chex Mix', 'ABC', 'Titans'],
  ),
  'CORUSCANTUNDERWORLDPOLICE': createCharacterSettings(
    [createOptimizationPlan('Why?', 0, 0, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['CUP']
  ),
  'COUNTDOOKU': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 0, 50, 50, 25, 25, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.mixed
  ),
  'CT5555': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 15, 30, 50, 0, 15, 0, 25, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('KAM', 30, 15, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('KAM/CA', 30, 15, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, true),
    ],
  ),
  'CT7567': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 5, 0, 100, 0, 5, 10, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('KAM', 10, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      toRenamed(optimizationStrategy.Speed, 'Chex Mix'),
    ],
    ['Titans'],
  ),
  'CT210408': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 50, 0, 75, 75, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Nuke', 0, 0, 50, 100, 0, 0, 75, 75, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('KAM', 5, 0, 50, 100, 0, 0, 20, 20, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('KAM/CA', 5, 0, 50, 100, 0, 0, 20, 20, 50, 0, 0, 0, 100, true),
    ],
    [],
    DamageType.mixed
  ),
  'DAKA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 25, 0, 100, 0, 25, 15, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Tanky', 75, 0, 100, 0, 30, 15, 0, 0, 0, 0, 0, 0, 100, true),
      createOptimizationPlan('hSTR Phase 4', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3', 50, 0, 75, 0, 15, 0, 5, 0, 0, 0, 0, 0, 0, true),
    ],
    ['NS', 'hSTR NS']
  ),
  'DARKTROOPER': createCharacterSettings(
    [createOptimizationPlan('PvP', 10, 10, 50, 0, 0, 5, 60, 0, 0, 2.5, 2.5, 0, 0, true)]
  ),
  'DARTHMALAK': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 50, 100, 0, 10, 0, 10, 0, 0, 10, 0, 0, 0, true),
      createOptimizationPlan('Tenacity', 0, 50, 100, 0, 10, 100, 10, 0, 0, 10, 0, 0, 0, true),
    ],
  ),
  'DARTHMALGUS': createCharacterSettings(
    [createOptimizationPlan('PvP', 50, 10, 100, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, true)],
  ),
  'DARTHNIHILUS': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 30, 0, 100, 0, 50, 60, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Tanky', 40, 0, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 100, true),
    ],
    ['Nightmare'],
    DamageType.special
  ),
  'DARTHREVAN': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 0, 100, 50, 5, 0, 0, 10, 5, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'DARTHSIDIOUS': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 0, 25, 0, 50, 0, 0, 0, 0, 0, 0)],
    ['Auto Lightzader']
  ),
  'DARTHSION': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 25, 30, 100, 0, 5, 0, 0, 0, 0, 20, 0, 0, 0, true),
      createOptimizationPlan('PvP/CA', 25, 30, 100, 0, 5, 0, 0, 0, 0, 20, 0, 0, 100, true),
    ],
    ['Nightmare']
  ),
  'DARTHTALON': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 15, 25, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, true),
    ],
  ),
  'DARTHTRAYA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 15, 10, 100, 0, 5, 0, 0, 15, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Tanky', 25, 75, 65, 0, 0, 65, 0, 0, 0, 0, 0, 0, 100, true)
    ],
    [],
    DamageType.special
  ),
  'DASHRENDAR': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 0, 100, 60, 5, 0, 50, 0, 10, 0, 0, 0, 0, true)],
  ),
  'DATHCHA': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvE'),
      createOptimizationPlan('Detonator', 100, 100, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 100, true),
    ],
    [],
    DamageType.mixed
  ),
  'DEATHTROOPER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 25, 0, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('Iden Lead', 10, 10, 100, 100, 40, 0, 25, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true, {}, {},
        [createTargetStat('Speed', [], 1, '+', 175, 179, 'null', true)]
      ),
    ],
    ['Troopers', 'Chex Mix'],
  ),
  'DENGAR': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 0, 60, 0, 0, 0, 100, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0, true),
    ]
  ),
  'DIRECTORKRENNIC': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Special Damage, Potency"], 'PvP')],
    ['Imperial Grancor Maneuver'],
    DamageType.special
  ),
  'DOCTORAPHRA': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 90, 0, 100, 0, 0, 20, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'DROIDEKA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 10, 0, 0, 10, 20, 100, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Maul Kickstarter', 0, 5, 100, 0, 5, 5, 20, 0, 0, 0, 0, 0, 0, true),
    ],
  ),
  'EETHKOTH': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Special Damage, Potency"], 'PvP')],
    [],
    DamageType.mixed
  ),
  'EIGHTHBROTHER': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 5, 100, 50, 0, 0, 30, 0, 5, 0, 0, 0, 0, true)],
  ),
  'EMBO': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 20, 100, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 50, 25, 0, 0, 75, 0, 100, 0, 0, 0, 0, true)
    ]
  ),
  'EMPERORPALPATINE': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Special Damage with Potency"], 'PvP'),
      createOptimizationPlan('Tanky', 0, 100, 70, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ],
    ['EP', 'Palp', 'EzPz', 'Nightmare'],
    DamageType.special
  ),
  'ENFYSNEST': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 0, 100, 50, 25, 100, 10, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Speedy', 0, 0, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, true),
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'Offense'),
      createOptimizationPlan('Tenacity', 10, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3', 25, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true),
    ],
    ['Nesty', 'Baby Wampa', 'solo'],
    DamageType.special
  ),
  'EPIXFINN': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 0, 25, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'EPIXPOE': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 0, 20, 20, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'EWOKELDER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 25, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 25, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Tenacity %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 25, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Tenacity %",
        "circle": "Health %",
      }, {
        "Health %": 3,
      }),
    ],
    ['EE', 'Murderbears'],
  ),
  'EWOKSCOUT': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 15, 0, 100, 0, 50, 0, 50, 0, 20, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 15, 0, 100, 0, 50, 0, 50, 0, 20, 0, 0, 0, 0, true, {
        "triangle": "Offense %",
        "cross": "Potency %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 15, 0, 100, 0, 50, 0, 50, 0, 20, 0, 0, 0, 0, true, {
        "triangle": "Offense %",
        "cross": "Potency %",
        "circle": "Health %",
      }, {
        "Offense %": 1,
        "Potency %": 1,
      }),
      createOptimizationPlan('hSTR Phase 2', 0, 0, 50, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0, true),
    ],
    ['Murderbears'],
  ),
  'EZRABRIDGERS3': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 5, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 5, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Offense %",
        "circle": "Health %",
      }),
      createOptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 50, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR P2 Jedi', 0, 0, 60, 100, 0, 0, 75, 0, 75, 0, 0, 0, 0, true),
    ],
  ),
  'FENNECSHAND': createCharacterSettings(
    [
      createOptimizationPlan('PvP - Offense', 0, 0, 100, 0, 0, 0, 0, 75, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP - Crit.Dmg', 0, 0, 100, 100, 0, 0, 0, 100, 50, 0, 0, 0, 0, true),
    ],
    [],
    DamageType.special
  ),
  'FIFTHBROTHER': createCharacterSettings(
    [createOptimizationPlan('PvP', 20, 10, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'FINN': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Slow Crit, Physical Damage, Potency"], 'PvP'),
      createOptimizationPlan('Tanky', 30, 100, 100, 0, 5, 5, 50, 0, 0, 10, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 1', 0, -5, 80, 100, 0, 0, 50, 0, 75, 0, 0, 0, 0, true)
    ],
    ['Zinn']
  ),
  'FIRSTORDEREXECUTIONER': createCharacterSettings(
    [createOptimizationPlan('PvP', 25, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true)],
    ['Fox', 'Panda', 'Foe', 'FO']
  ),
  'FIRSTORDEROFFICERMALE': createCharacterSettings(
    [toRenamed(optimizationStrategy.Speed, 'Speed')],
    ['Foo', 'FO']
  ),
  'FIRSTORDERSPECIALFORCESPILOT': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Mixed Damage, Potency"], 'PvP')],
    ['SFTP', 'FO'],
    DamageType.mixed
  ),
  'FIRSTORDERTIEPILOT': createCharacterSettings(
    [createOptimizationPlan('PvP', 20, 0, 100, 100, 10, 0, 50, 0, 0, 0, 0, 0, 0, true)],
    ['FOTP', 'FO'],
  ),
  'FIRSTORDERTROOPER': createCharacterSettings(
    [createOptimizationPlan('PvP', 30, 40, 100, 0, 0, 10, 0, 0, 0, 30, 0, 0, 0, true)],
    ['FOST', 'FO'],
  ),
  'FOSITHTROOPER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 25, 100, 0, 0, 80, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Tanky', 40, 0, 100, 50, 0, 0, 50, 0, 0, 0, 0, 0, 0, true),
    ],
  ),
  'FULCRUMAHSOKA': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'PvP'),
      createOptimizationPlan('Omicron', 10, 0, 50, 100, 0, -30, 75, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('Omicron w/ Primaries', 10, 0, 50, 0, 0, -30, 100, 0, 50, 0, 0, 0, 0, true, {
        "arrow": "Offense %",
        "triangle": "Critical Damage %",
        "cross": "Offense %",
      }),
    ],
    ['ATF', 'FAT'],
  ),
  'GAMORREANGUARD': createCharacterSettings(
    [createOptimizationPlan('PvP', 75, 0, 100, 0, 75, 100, 0, 0, 0, 50, 0, 0, 0, true)],
    ['Piggy']
  ),
  'GARSAXON': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP')]
  ),
  'GENERALHUX': createCharacterSettings(
    [createOptimizationPlan('PvP', 10, 10, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 15, true)],
    [],
    DamageType.special
  ),
  'GENERALKENOBI': createCharacterSettings(
    [
      createOptimizationPlan('Speedy Tank', 25, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      createOptimizationPlan('Balanced', 50, 100, 50, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0, true),
      createOptimizationPlan('Slow Tank', 50, 100, 0, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0, true),
      createOptimizationPlan('Padme Lead', 100, 0, 50, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0, true),
      createOptimizationPlan('JMK Lead', 100, 0, 0, 0, 0, 50, 0, 0, 0, 50, 0, 0, 0, true),
      createOptimizationPlan('hSTR P2 Jedi', 0, 100, 50, 0, 0, 0, 10, 0, 25, 100, 0, 0, 0, true),
    ],
    ['GK', 'Titans']
  ),
  'GENERALSKYWALKER': createCharacterSettings(
    [
      createOptimizationPlan('PvP - Defense', 10, 25, 100, 0, 20, 0, 10, 0, 0, 10, 10, 0, 0, true),
      createOptimizationPlan('PvP - Offense', 0, 0, 100, 100, 20, 0, 20, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP - Parry', 0, 75, 100, 0, 25, 0, 50, 0, 0, 10, 0, 0, 0, true),
    ],
    ['GAS']
  ),
  'GEONOSIANBROODALPHA': createCharacterSettings(
    [
      createOptimizationPlan('Tanky', 20, 20, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Offense', 0, 0, 100, 50, 0, 10, 20, 0, 20, 0, 0, 0, 0, true)
    ]
  ),
  'GEONOSIANSOLDIER': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 80, 90, 0, 0, 50, 0, 100, 0, 0, 0, 0, true)]
  ),
  'GEONOSIANSPY': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'PvP')]
  ),
  'GLLEIA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 20, 15, 100, 0, 15, 0, 5, 0, 0, 10, 10, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 20, 15, 100, 0, 15, 0, 5, 0, 0, 10, 10, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "circle": "Health %",
        "cross": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 20, 15, 100, 0, 15, 0, 5, 0, 0, 10, 10, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "circle": "Health %",
        "cross": "Health %",
      }, {
        "Speed %": 1,
      }),
    ],
    ['Murderbears']
  ),
  'GLREY': createCharacterSettings(
    [
      createOptimizationPlan('PvP - Health', 50, 0, 100, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP - Offense', 15, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, true),
    ]
  ),
  'GRANDADMIRALTHRAWN': createCharacterSettings(
    [createOptimizationPlan('PvP', 10, 20, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, true)],
    ['GAT', 'Imperial Grancor Maneuver', 'Wampanader', 'ABC', 'Titans'],
    DamageType.special
  ),
  'GRANDINQUISITOR': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 5, 100, 50, 0, 0, 30, 0, 5, 0, 0, 0, 0, true)],
  ),
  'GRANDMASTERLUKE': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 25, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['GMLS', 'JMLS', 'GLLS'],
    DamageType.special
  ),
  'GRANDMASTERYODA': createCharacterSettings(
    [
      createOptimizationPlan('Speedy', 0, 0, 100, 50, 25, 0, 0, 80, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('Offense', 0, 0, 50, 100, 0, 0, 0, 100, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('Health', 20, 0, 100, 0, 5, 0, 0, 20, 5, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR P1 Yodalicious', 0, -5, 100, 100, 0, 0, 0, 100, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR P2 Bastila', 0, 0, 60, 100, 0, 0, 0, 75, 80, 0, 0, 0, 0, true),
    ],
    ['GMY'],
    DamageType.special
  ),
  'GRANDMOFFTARKIN': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 15, 15, 50, 0, 0, 0, 0, true)],
    ['GMT', 'Auto Lightzader', 'Imperial Grancor Maneuver'],
    DamageType.mixed
  ),
  'GREEDO': createCharacterSettings(
    [
      createOptimizationPlan('Crits', 0, 0, 100, 50, 25, 0, 25, 0, 100, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true, {}, {},
        [createTargetStat('Speed', [], 1, '+', 170, 174, 'null', true)]
      )
    ]
  ),
  'GREEFKARGA': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 5, 100, 0, 5, 10, 0, 0, 0, 0, 0, 0, 0, true)],
  ),
  'GRIEVOUS': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 100, 0, 80, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Fast', 20, 0, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Nuke', 100, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ],
    ['GG'],
  ),
  'HANSOLO': createCharacterSettings(
    [
      createOptimizationPlan('Fast Han', 0, 0, 100, 100, 10, 0, 25, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Slow Han', 0, 0, 0, 100, 25, 0, 50, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Non-relic', 0, 0, 100, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('Chex Mix', 0, 0, 0, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true, {}, {},
        [createTargetStat('Speed', [], 1, '+', 170, 174, 'null', true)],
      ),
    ],
    ['Raid Han', 'rHan', 'OG Han', 'Zolo', 'Chex Mix', 'Titans'],
  ),
  'HERASYNDULLAS3': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 20, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 20, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0, true, {
        "cross": "Potency %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 20, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0, true, {
        "cross": "Potency %",
      }, {
        "Speed %": 1,
        "Health %": 1,
      }),
    ],
  ),
  'HERMITYODA': createCharacterSettings(
    [optimizationStrategy.Speed],
    ['Hyoda', 'Hoboda', 'Hobo', 'HY'],
    DamageType.mixed
  ),
  'HK47': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 75, 0, 0, 50, 0, 25, 0, 0, 0, 0, true)
    ]
  ),
  'HONDO': createCharacterSettings(
    [createOptimizationPlan('PvP', 10, 5, 100, 75, 0, 0, 0, 75, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'HOTHHAN': createCharacterSettings(
    [createOptimizationPlan('PvP', 20, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['CHS', 'CHolo', 'Snolo', 'Hoth Han']
  ),
  'HOTHLEIA': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 25, 0, 30, 0, 0, 0, 0, true)],
    ['ROLO']
  ),
  'HOTHREBELSCOUT': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvE'),
      createOptimizationPlan('Mothma Lead', 5, 10, 100, 0, 5, 5, 75, 0, 100, 5, 0, 0, 0, true),
    ],
    ['HRS', 'Hoth Bros']
  ),
  'HOTHREBELSOLDIER': createCharacterSettings(
    [createOptimizationPlan('PvE', 25, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['HRS', 'Hoth Bros']
  ),
  'HUMANTHUG': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP')],
  ),
  'IDENVERSIOEMPIRE': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 50, 0, 25, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Wampa Slayer', 0, 0, 100, 30, 100, 0, 10, 0, 0, 0, 0, 0, 0, true),
    ],
  ),
  'IG11': createCharacterSettings(
    [createOptimizationPlan('Tanky', 25, 0, 50, 0, 0, 10, 5, 0, 5, 5, 5, 0, 0, true)],
  ),
  'IG12': createCharacterSettings(
    [
      createOptimizationPlan('Default', 20, 5, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }, {
        "Health %": 1,
        "Speed %": 1,
      }),
    ],
  ),
  'IG86SENTINELDROID': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'PvP')],
  ),
  'IG88': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Damage'),
      createOptimizationPlan('Nuke', 0, 0, 100, 25, 50, 0, 25, 0, 75, 0, 0, 0, 0, true)
    ]
  ),
  'IMAGUNDI': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP')],
    ['IGD']
  ),
  'IMPERIALPROBEDROID': createCharacterSettings(
    [
      createOptimizationPlan('Tanky', 50, 50, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Offense', 0, 0, 100, 80, 50, 0, 25, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('Nuke', 50, 50, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['IPD']
  ),
  'IMPERIALSUPERCOMMANDO': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 15, 100, 0, 20, 0, 100, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 0, 15, 100, 0, 20, 0, 100, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Offense %",
        "triangle": "Offense %",
        "circle": "Protection %",
        "cross": "Offense %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 0, 15, 100, 0, 20, 0, 100, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Offense %",
        "triangle": "Offense %",
        "circle": "Protection %",
        "cross": "Offense %",
      }, {
        "Offense %": 1,
      }),
    ],
    ['ISC']
  ),
  'JABBATHEHUTT': createCharacterSettings(
    [createOptimizationPlan('PvP', 15, 0, 100, 0, 25, 50, 0, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'JANGOFETT': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP')],
  ),
  'JAWA': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Mixed Damage, Potency"], 'PvE'),
      createOptimizationPlan('Detonator', 100, 100, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 100, true),
    ],
    [],
    DamageType.mixed
  ),
  'JAWAENGINEER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 0, 100, 0, 50, 10, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Detonator', 20, 10, 100, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, true),
    ],
    [],
    DamageType.mixed
  ),
  'JAWASCAVENGER': createCharacterSettings(
    [
      createOptimizationPlan('PvE', 0, 0, 100, 25, 50, 0, 25, 0, 100, 0, 0, 0, 0, true),
      createOptimizationPlan('Detonator', 100, 100, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 100, true),
    ],
  ),
  'JEDIKNIGHTCAL': createCharacterSettings(
    [
      createOptimizationPlan('Default', 25, 0, 100, 98, 2, 2, 3, 6, 2, 1, 1, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Damage %",
        "circle": "Health %",
        "cross": "Offense %",
        }, {
          "Health %": 1,
          "Offense %": 1,
        },
      )
    ],
    ['JKCK'],
  ),
  'JEDIKNIGHTCONSULAR': createCharacterSettings(
    [createOptimizationPlan('Healer', 50, 0, 100, 25, 0, 0, 75, 0, 0, 0, 0, 0, 0, true)],
    ['JC'],
    DamageType.mixed
  ),
  'JEDIKNIGHTGUARDIAN': createCharacterSettings(
    [createOptimizationPlan('PvE', 40, 20, 100, 0, 50, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)],
    ['JKG']
  ),
  'JEDIKNIGHTLUKE': createCharacterSettings(
    [
      createOptimizationPlan('Leader', 5, 5, 0, 100, 25, 0, 50, 0, 15, 0, 0, 0, 0, true),
      createOptimizationPlan('Non-leader', 5, 5, 25, 100, 25, 0, 50, 0, 15, 0, 0, 0, 0, true)
    ],
    ['JKL']
  ),
  'JEDIKNIGHTREVAN': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Health', 10, 0, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
    ],
    [],
    DamageType.special
  ),
  'JEDIMASTERKENOBI': createCharacterSettings(

    [createOptimizationPlan('PvP', 5, 0, 100, 25, 0, 0, 10, 0, 0, 0, 0, 0, 0, true)],
    ['JMK'],
  ),
  'JOLEEBINDO': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 50, 0, 75, 0, 0, 100, 0, 0, 0, 0, 0, 0, 100, true),
      createOptimizationPlan('Health and Speed', 100, 0, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Healer', 30, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'JUHANI': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 100, 90, 0, 5, 0, 0, 0, 0, 15, 0, 0, 0, true)],
  ),
  'JYNERSO': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 20, 0, 75, 0, 0, 0, 0, true),
      createOptimizationPlan('AdRad', 10, 0, 100, 100, 25, 0, 20, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('AdRad w/ Primaries', 10, 0, 100, 0, 25, 0, 20, 0, 50, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Potency %",
        "circle": "Health %",
      }),
    ],
    ['Rogue 1', 'Auto Lightzader', 'Imperial Grancor Maneuver', 'SuperStar2D2'],
  ),
  'K2SO': createCharacterSettings(
    [
      createOptimizationPlan('Tanky', 20, 20, 100, 0, 50, 50, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('AdRad', 20, 40, 50, 0, 50, 50, 0, 0, 0, 10, 10, 0, 0, true),
      createOptimizationPlan('AdRad w/ Primaries', 20, 40, 50, 0, 50, 50, 0, 0, 0, 10, 10, 0, 0, true, {
        "arrow": "Protection %",
        "triangle": "Protection %",
        "cross": "Tenacity %",
        "circle": "Protection %",
      }),
    ],
    ['Rogue 1', 'Cass-2SO', 'K2'],
  ),
  'KANANJARRUSS3': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 40, 0, 100, 0, 0, 0, 10, 0, 30, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 40, 0, 100, 0, 0, 0, 10, 0, 30, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 40, 0, 100, 0, 0, 0, 10, 0, 30, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }, {
        "Health %": 2,
        "Tenacity %": 1,
      }),
    ],
  ),
  'KELLERANBEQ': createCharacterSettings(
    [
      createOptimizationPlan('Default', 20, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Protection %",
        "triangle": "Protection %",
        "cross": "Protection %",
        "circle": "Protection %",
      }, {
        "Health %": 3,
      }),
    ],
  ),
  'KIADIMUNDI': createCharacterSettings(
    [
      createOptimizationPlan('Balanced', 10, 10, 100, 50, 20, 0, 50, 0, 25, 10, 10, 0, 0, true),
      createOptimizationPlan('Offense', 0, 0, 100, 50, 20, 0, 75, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('Defense', 20, 20, 100, 0, 20, 10, 0, 0, 0, 15, 15, 0, 0, true)
    ]
  ),
  'KITFISTO': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'PvE')],
    ['Fisty', 'Fister']
  ),
  'KRRSANTAN': createCharacterSettings(
    [createOptimizationPlan('PvP', 30, 30, 100, 0, 10, 10, 0, 0, 0, 25, 0, 0, 0, true)],
  ),
  'KUIIL': createCharacterSettings(
    [createOptimizationPlan('PvP', 10, 10, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'KYLEKATARN': createCharacterSettings(
    [createOptimizationPlan('Mothma Lead', 5, 0, 100, 0, 5, 5, 50, 0, 0, 5, 0, 0, 0, true)],
  ),
  'KYLOREN': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 25, 0, 25, 0, 0, 0, 0, true)],
    ['Old Kylo', 'zylo', 'FO']
  ),
  'KYLORENUNMASKED': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 75, 50, 100, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, true),
      createOptimizationPlan('Tanky', 100, 100, 50, 0, 0, 75, 0, 0, 0, 37.5, 37.5, 0, 0, true),
      createOptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ],
    ['kru', 'matt', 'Snape', 'FO']
  ),
  'L3_37': createCharacterSettings(
    [
      createOptimizationPlan('Tanky', 40, 20, 50, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      createOptimizationPlan('Speedy', 40, 20, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)
    ],
    ['solo']
  ),
  'LOBOT': createCharacterSettings(
    [createOptimizationPlan('PvE', 0, 0, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)]
  ),
  'LOGRAY': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 0, 100, 40, 50, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 10, 0, 100, 40, 50, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Potency %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 10, 0, 100, 40, 50, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Potency %",
        "circle": "Health %",
      }, {
        "Potency %": 1,
        "Health %": 2,
      }),
      createOptimizationPlan('hSTR Phase 2', 5, 5, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ],
    ['Murderbears'],
  ),
  'LORDVADER': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 15, 100, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, true)]
  ),
  'LUKESKYWALKER': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvE')],
    ['farmboi']
  ),
  'LUMINARAUNDULI': createCharacterSettings(
    [createOptimizationPlan('PvE', 40, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'MACEWINDU': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 15, 0, 100, 0, 50, 0, 0, 50, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Slow/Tanky', 100, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ],
    [],
    DamageType.special
  ),
  'MAGMATROOPER': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvE'),
      createOptimizationPlan('Anti-Traya', 0, 0, 25, 25, 50, 0, 25, 0, 25, 0, 0, 0, 0, true)
    ]
  ),
  'MAGNAGUARD': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 30, 30, 100, 0, 20, 20, 0, 0, 0, 25, 0, 0, 100, true),
      createOptimizationPlan('Balanced', 20, 20, 100, 25, 50, 25, 25, 0, 25, 12.5, 12.5, 0, 0, true),
    ],
  ),
  'MARAJADE': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 10, 100, 25, 25, 0, 0, 25, 10, 0, 0, 0, 0, true),
      createOptimizationPlan('Survivability', 0, 10, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ],
    [],
    DamageType.special
  ),
  'MAUL': createCharacterSettings(
    [toRenamed(optimizationStrategy["Special Damage with Potency"], 'PvP')]
  ),
  'MAULS7': createCharacterSettings(
    [createOptimizationPlan('PvP', 25, 25, 100, 0, 15, 0, 50, 0, 0, 0, 0, 0, 0, true)]
  ),
  'MERRIN': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 15, 0, 0, 0, 100, 0, 0, 40, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 15, 0, 0, 0, 100, 0, 0, 40, 0, 0, 0, 0, 0, true, {
        "cross": "Potency %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries & Set', 15, 0, 0, 0, 100, 0, 0, 40, 0, 0, 0, 0, 0, true, {
        "cross": "Potency %",
        "circle": "Health %",
      }, {
        "Potency %": 3,
      }),
    ],
    [],
    DamageType.special,
  ),
  'MISSIONVAO': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 75, 0, 50, 0, 0, 0, 0, true)]
  ),
  'MOFFGIDEONS1': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'MONMOTHMA': createCharacterSettings(
    [createOptimizationPlan('Leader', 5, 5, 100, 0, 0, 25, 10, 0, 0, 0, 0, 0, 0, true)],
    ['MM']
  ),
  'MOTHERTALZIN': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 0, 50, 0, 0, 25, 10, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 0, 75, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3', 0, -5, 0, 0, 10, 0, 0, 100, 0, 0, 0, 0, 0, true)
    ],
    ['MT', 'NS', 'hSTR NS'],
    DamageType.special
  ),
  'NIGHTSISTERACOLYTE': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 50, 50, 80, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 2', 0, 0, 100, 100, 0, 0, 100, 100, 100, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 50, 50, 100, 0, 0, 0, 0, true),
    ],
    ['NA', 'NS'],
    DamageType.mixed
  ),
  'NIGHTSISTERINITIATE': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'PvE'),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, true)
    ],
    ['NI', 'NS']
  ),
  'NIGHTSISTERSPIRIT': createCharacterSettings(
    [
      createOptimizationPlan('PvE', 0, 0, 100, 50, 25, 0, 75, 0, 50, 0, 0, 0, 0, true),
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP'),
      createOptimizationPlan('hSTR Phase 3', 0, 0, 0, 40, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
    ],
    ['NS']
  ),
  'NIGHTSISTERZOMBIE': createCharacterSettings(
    [
      createOptimizationPlan('Strong Zombie', 20, 20, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Weak Zombie', 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false),
      createOptimizationPlan('hSTR Phase 4', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 3', 20, 0, 100, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, true)
    ],
    ['NS', 'hSTR NS']
  ),
  'NINTHSISTER': createCharacterSettings(
    [createOptimizationPlan('PvP', 40, 50, 100, 0, 0, 40, 0, 0, 0, 30, 0, 0, 0, true)],
  ),
  'NUTEGUNRAY': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed with survivability"], 'PvP'),
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'Damage')
    ]
  ),
  'OLDBENKENOBI': createCharacterSettings(
    [createOptimizationPlan('Speed', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['OB']
  ),
  'PADMEAMIDALA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 35, 0, 100, 25, 15, 0, 10, 0, 10, 0, 0, 0, 0, true),
      createOptimizationPlan('Slow', 50, 0, 0, 25, 15, 0, 10, 0, 10, 0, 0, 0, 0, true)
    ],
    ['Padme']
  ),
  'PAO': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP'),
      createOptimizationPlan('Mothma Lead', 10, 30, 100, 0, 5, 5, 100, 0, 0, 5, 0, 0, 0, true),
      toRenamed(optimizationStrategy["Speedy Chex Mix"], 'Chex Mix')
    ],
    ['Rogue 1', 'Chex Mix']
  ),
  'PAPLOO': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 20, 0, 100, 0, 0, 10, 0, 0, 0, 5, 5, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 20, 0, 100, 0, 0, 10, 0, 0, 0, 5, 5, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }),
      createOptimizationPlan('HPvP w/ Primaries and Sets', 20, 0, 100, 0, 0, 10, 0, 0, 0, 5, 5, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }, {
        "Health %": 3,
      }),
      createOptimizationPlan('Fast Tank', 25, 25, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
    ],
    ['Murderbears'],
  ),
  'PAZVIZSLA': createCharacterSettings(
    [
      createOptimizationPlan('Health', 75, 50, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }, {
        "Health %": 3,
      }),
      createOptimizationPlan('Protection', 50, 75, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true, {
        "triangle": "Protection %",
        "cross": "Protection %",
        "circle": "Protection %",
      }, {
        "Health %": 3,
      }),
    ]
  ),
  'PHASMA': createCharacterSettings(
    [createOptimizationPlan('PvP', 20, 10, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['FO'],
  ),
  'PLOKOON': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvE')],
    [],
    DamageType.mixed
  ),
  'POE': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 10, 100, 0, 40, 20, 0, 0, 0, 5, 0, 0, 0, true)],
  ),
  'POGGLETHELESSER': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speedy debuffer"], 'PvE')]
  ),
  'PRINCESSKNEESAA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 20, 0, 100, 50, 40, 0, 10, 0, 80, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 20, 0, 100, 50, 40, 0, 10, 0, 80, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Damage %",
        "cross": "Potency %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries & Set', 20, 0, 100, 50, 40, 0, 10, 0, 80, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Damage %",
        "cross": "Potency %",
        "circle": "Health %",
      }, {
        "Potency %": 1,
        "Critical Chance %": 1,
        "Health %": 1,
      }),
    ],
  ),
  'PRINCESSLEIA': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'PvP'),
      createOptimizationPlan('hSTR Phase 2', 0, 0, 50, 100, 0, 0, 25, 0, 50, 0, 0, 0, 0, true)
    ],
    ['Machine Gun']
  ),
  'QIRA': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 50, 10, 0, 50, 0, 25, 0, 0, 0, 0, true)],
    ['solo'],
  ),
  'QUIGONJINN': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Special Damage, Potency"], 'PvP'),
      createOptimizationPlan('Omicron', 0, 0, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 25, 25, 50, 0, 0, 0, 0, true),
    ],
    ['QGJ'],
    DamageType.mixed
  ),
  'R2D2_LEGENDARY': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 5, 5, 100, 0, 25, 10, 0, 0, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 1', 10, -5, 100, 25, 25, 0, 25, 0, 50, 0, 0, 0, 0, true)
    ],
    ['Trashcan', 'R2z2', 'SuperStar2D2'],
    DamageType.mixed
  ),
  'RANGETROOPER': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'PvP')],
    ['Troopers']
  ),
  'RESISTANCEPILOT': createCharacterSettings(
    [toRenamed(optimizationStrategy["Slow Crit, Physical Damage, Potency"], 'PvP')],
    ['RP']
  ),
  'RESISTANCETROOPER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 10, 100, 25, 0, 50, 0, 100, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 1', 0, -5, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ],
    ['RT', 'res trooper']
  ),
  'REY': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 25, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 1', 0, -5, 90, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ],
    ['scav rey']
  ),
  'REYJEDITRAINING': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 20, 0, 20, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 1', 0, -5, 90, 100, 50, 0, 50, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR p1 C3PO', 0, -5, 90, 100, 60, 60, 50, 0, 0, 0, 0, 0, 0, true)
    ],
    ['JTR', 'RJT', 'Jedi Rey', 'Jey Z']
  ),
  'ROSETICO': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 5, 100, 50, 30, 0, 20, 20, 25, 0, 0, 0, 0, true)],
    [],
    DamageType.mixed
  ),
  'ROYALGUARD': createCharacterSettings(
    [
      createOptimizationPlan('Tanky', 50, 50, 25, 0, 0, 25, 0, 0, 0, 5, 5, 0, 0, true),
      createOptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ],
    ['RG', 'Red Guard']
  ),
  'SABINEWRENS3': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP'),
      createOptimizationPlan('hSTR Phase 2', 20, 20, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'SANASTARROS': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 50, 5, 0, 0, 20, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'SAVAGEOPRESS': createCharacterSettings(
    [
      createOptimizationPlan('PvP/Omicron', 100, 0, 0, 0, 0, 0, 10, 0, 0, 50, 0, 0, 0, true),
      createOptimizationPlan('Balanced', 50, 0, 100, 25, 25, 25, 25, 0, 25, 12.5, 12.5, 0, 0, true),
    ],
    ['zavage']
  ),
  'SAWGERRERA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 20, 0, 100, 0, 20, 0, 20, 0, 0, 0, 0, 0, 0, true),
    ],
  ),
  'SCARIFREBEL': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 20, 20, 100, 0, 25, 10, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('AdRad', 30, 20, 100, 0, 25, 10, 0, 0, 0, 10, 0, 0, 0, true),
      createOptimizationPlan('AdRad w/ Primaries', 30, 20, 100, 0, 25, 10, 0, 0, 0, 10, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Protection %",
        "cross": "Protection %",
      }),
      createOptimizationPlan('hSTR Phase 2', 20, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ],
    ['Rogue 1', 'SRP'],
  ),
  'SCOUTTROOPER_V3': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 5, 10, 100, 0, 30, 10, 15, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 5, 10, 100, 0, 30, 10, 15, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Potency %",
      }),
      createOptimizationPlan('PvP w/ Primaries & Set', 5, 10, 100, 0, 30, 10, 15, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Potency %",
      }, {
        "Speed %": 1,
        "Potency %": 1,
      }),
    ],
    ['Rogue 1', 'SRP']
  ),
  'SECONDSISTER': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 5, 100, 75, 0, 0, 0, 100, 30, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'SEVENTHSISTER': createCharacterSettings(
    [createOptimizationPlan('PvP', 20, 10, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, true)],
  ),
  'SHAAKTI': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 25, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Nuke', 25, 25, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('KAM', 20, 10, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('KAM/CA', 20, 10, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, true),
    ],
  ),
  'SHORETROOPER': createCharacterSettings(
    [
      createOptimizationPlan('Speedy Tank', 50, 50, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['ShT', 'Troopers', 'Imperial Grancor Maneuver']
  ),
  'SITHASSASSIN': createCharacterSettings(
    [toRenamed(optimizationStrategy["Special Damage with Potency"], 'PvP')],
    ['SA', 'Sassy']
  ),
  'SITHMARAUDER': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP')],
    ['SM']
  ),
  'SITHPALPATINE': createCharacterSettings(
    [createOptimizationPlan('PvP', 40, 5, 100, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, true)],
    ['SEE'],
    DamageType.special
  ),
  'SITHTROOPER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 25, 25, 50, 0, 0, 15, 0, 0, 0, 25, 25, 0, 0, true),
      createOptimizationPlan('DR Lead', 25, 50, 15, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['SiT', 'Nightmare']
  ),
  'SMUGGLERCHEWBACCA': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvE'),
      createOptimizationPlan('PvP', 0, 0, 100, 80, 25, 0, 60, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Vets']
  ),
  'SMUGGLERHAN': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvE'),
      createOptimizationPlan('PvP', 0, 0, 100, 80, 25, 0, 60, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Vets']
  ),
  'SNOWTROOPER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('Iden Lead', 10, 10, 50, 100, 10, 0, 30, 0, 25, 0, 0, 0, 0, true),
    ],
    ['Troopers'],
  ),
  'STAP': createCharacterSettings(
    [
      createOptimizationPlan('Default', 0, 0, 100, 10, 10, 0, 50, 0, 10, 0, 0, 0, 0, true,
        {
          "arrow": "Speed",
          "triangle": "Critical Damage %",
          "cross": "Offense %",
        }, {
          "Speed %": 1,
        }
      ),
    ],
  ),
  'STARKILLER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 25, 0, 100, 75, 0, 0, 50, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 25, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
      }),
      createOptimizationPlan('Speedy', 10, 0, 100, 50, 0, 0, 30, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Speedy w/ Primaries', 10, 0, 100, 50, 0, 0, 30, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
      }),
    ],
  ),
  'STORMTROOPER': createCharacterSettings(
    [
      createOptimizationPlan('Speedy Tank', 25, 25, 50, 0, 0, 25, 0, 0, 0, 25, 25, 0, 0, true),
      createOptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Iden Lead', 0, 75, 50, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, true),
      createOptimizationPlan('Iden Lead w/ Primaries', 0, 100, 50, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, true, {
        "arrow": "Defense %",
        "triangle": "Defense %",
        "cross": "Defense %",
      }),
    ],
    ['Troopers'],
  ),
  'STORMTROOPERHAN': createCharacterSettings(
    [createOptimizationPlan('PvP', 25, 50, 50, 0, 100, 10, 0, 0, 0, 20, 0, 0, 0, true)],
    ['STHan']
  ),
  'SUNFAC': createCharacterSettings(
    [createOptimizationPlan('Tanky', 40, 40, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)]
  ),
  'SUPREMELEADERKYLOREN': createCharacterSettings(
    [
      createOptimizationPlan('PvP - Speed', 10, 0, 100, 50, 0, 0, 30, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP - Offense', 20, 0, 100, 100, 0, 0, 40, 0, 0, 0, 0, 0, 0, true),
    ],
  ),
  'T3_M4': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 10, 100, 0, 25, 10, 0, 10, 10, 0, 0, 0, 0, true),
      createOptimizationPlan('Damage', 10, 20, 100, 50, 50, 10, 0, 20, 25, 0, 0, 0, 0, true),
      createOptimizationPlan('Nuke', 10, 50, 100, 0, 25, 10, 0, 0, 10, 0, 0, 0, 0, true),
    ],
    [],
    DamageType.special
  ),
  'TALIA': createCharacterSettings(
    [
      toRenamed(optimizationStrategy["Speed, Crit, and Mixed Damage"], 'PvP'),
      createOptimizationPlan('hSTR Phase 4', 0, 0, 0, 0, 0, 0, 100, 100, 100, 0, 0, 0, 0, true),
    ],
    ['NS', 'hSTR NS'],
    DamageType.mixed
  ),
  'TARFFUL': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 30, 0, 100, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 30, 0, 100, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries & Set', 30, 0, 100, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }, {
        "Defense %": 3,
      }),
    ],
  ),
  'TEEBO': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 0, 100, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 10, 0, 100, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Potency %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 10, 0, 100, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Potency %",
        "circle": "Health %",
      }, {
        "Potency %": 3,
      }),
    ],
    ['Teebotine', 'Murderbears']
  ),
  'THEMANDALORIAN': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 5, 5, 100, 15, 0, 0, 5, 0, 30, 0, 0, 0, 0, true),
      createOptimizationPlan('Relic 7', 0, 0, 100, 80, 0, 0, 20, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('Non-relic', 0, 0, 100, 80, 0, 0, 10, 0, 20, 0, 0, 0, 0, true),
    ],
  ),
  'THEMANDALORIANBESKARARMOR': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 5, 100, 0, 15, 0, 30, 0, 0, 0, 0, 0, 0, true)],
  ),
  'THIRDSISTER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 30, 5, 100, 50, 0, 0, 50, 0, 0, 5, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 30, 5, 100, 0, 0, 0, 50, 0, 0, 5, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "circle": "Health %",
        "cross": "Health %",
      }),
    ],
  ),
  'TIEFIGHTERPILOT': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvP')],
    ['TFP', 'Auto Lightzader']
  ),
  'TRENCH': createCharacterSettings(
    [createOptimizationPlan('PvP', 20, 10, 100, 0, 30, 0, 0, 20, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'TRIPLEZERO': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 0, 30, 0, 0, 20, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'TUSKENCHIEFTAIN': createCharacterSettings(
    [createOptimizationPlan('PvP', 15, 10, 100, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0, true)],
  ),
  'TUSKENHUNTRESS': createCharacterSettings(
    [createOptimizationPlan('PvP', 0, 0, 100, 75, 10, 0, 40, 0, 10, 0, 0, 0, 0, true)],
  ),
  'TUSKENRAIDER': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvE')],
  ),
  'TUSKENSHAMAN': createCharacterSettings(
    [createOptimizationPlan('PvP', 10, 5, 100, 0, 30, 10, 0, 0, 0, 0, 0, 0, 0, true)],
  ),
  'UGNAUGHT': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Mixed Damage, Potency"], 'PvE')],
    [],
    DamageType.mixed
  ),
  'UNDERCOVERLANDO': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 0, 100, 50, 0, 0, 25, 0, 25, 0, 0, 0, 0, true)],
  ),
  'URORRURRR': createCharacterSettings(
    [createOptimizationPlan('PvP', 10, 20, 100, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, true)],
  ),
  'VADER': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 100, 40, 0, 20, 0, 20, 0, 0, 0, 0, true),
      createOptimizationPlan('Raids', 0, 0, 100, 50, 25, 0, 25, 0, 25, 0, 0, 0, 0, true),
    ],
    ['Auto Lightzader', 'Wampanader', 'Nightmare'],
  ),
  'VEERS': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Mixed Damage, Potency"], 'PvP')],
    ['Troopers'],
    DamageType.mixed
  ),
  'VISASMARR': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 25, 0, 100, 50, 0, 25, 50, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('Healer', 50, 0, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('hSTR Phase 1', 25, -5, 0, 100, 0, 0, 50, 0, 75, 0, 0, 0, 0, true),
    ],
  ),
  'WAMPA': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 0, 80, 100, 10, 0, 50, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('Omicron', 100, 0, 75, 0, 0, 75, 50, 0, 0, 20, 0, 0, 0, true),
      createOptimizationPlan('Omicron/Health', 100, 0, 75, 0, 0, 10, 10, 0, 0, 10, 0, 0, 0, true),
      createOptimizationPlan('Omicron/Tenacity', 30, 0, 15, 0, 0, 100, 30, 0, 0, 20, 0, 0, 0, true),
      createOptimizationPlan('Raids', 10, 0, 80, 100, 10, 0, 50, 0, 0, 0, 0, 0, 0, true),
    ],
    ['beast', 'Wampanader'],
  ),
  'WATTAMBOR': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 30, 0, 100, 0, 25, 10, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'WEDGEANTILLES': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, and Physical Damage"], 'PvP')],
    ['Wiggs', 'chiggs', 'SuperStar2D2']
  ),
  'WICKET': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 5, 0, 100, 100, 0, 0, 40, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 5, 0, 100, 100, 0, 0, 40, 0, 50, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Offense %",
        "circle": "Health %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 5, 0, 100, 100, 0, 0, 60, 0, 50, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Offense %",
        "circle": "Health %",
      }, {
        "Critical Damage %": 1,
        "Health %": 1,
      }),
      createOptimizationPlan('hSTR Phase 2', 0, 0, 80, 50, 0, 0, 100, 0, 10, 0, 0, 0, 0, true),
    ],
    ['Murderbears'],
  ),
  'YOUNGCHEWBACCA': createCharacterSettings(
    [
      createOptimizationPlan('PvE', 50, 0, 100, 50, 0, 0, 25, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('Tanky', 100, 0, 50, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, true),
    ],
    ['Dwight', 'solo'],
  ),
  'YOUNGHAN': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 10, 0, 100, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true),
      createOptimizationPlan('HAAT', 0, 0, 80, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, true),
    ],
    ['YOLO', 'solo', 'Jim'],
  ),
  'YOUNGLANDO': createCharacterSettings(
    [toRenamed(optimizationStrategy["Speed, Crit, Physical Damage, Potency"], 'PvE')],
    ['solo']
  ),
  'ZAALBAR': createCharacterSettings(
    [createOptimizationPlan('PvP', 50, 50, 25, 0, 25, 50, 0, 0, 0, 0, 0, 0, 50, true)],
  ),
  'ZAMWESELL': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 0, 0, 100, 40, 50, 0, 25, 0, 40, 0, 0, 0, 0, true),
      createOptimizationPlan('Omicron', 10, 10, 100, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, true),
    ],
  ),
  'ZEBS3': createCharacterSettings(
    [
      createOptimizationPlan('PvP', 40, 0, 100, 0, 50, 0, 20, 0, 0, 0, 0, 0, 0, true),
      createOptimizationPlan('PvP w/ Primaries', 40, 0, 100, 0, 50, 0, 20, 0, 0, 0, 0, 0, 0, true, {
        "cross": "Potency %",
      }),
      createOptimizationPlan('PvP w/ Primaries and Sets', 40, 0, 100, 0, 50, 0, 20, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "cross": "Potency %",
      }, {
        "Health %": 3,
      }),
    ],
  ),
  'ZORIIBLISS_V2': createCharacterSettings(
    [createOptimizationPlan('PvP', 5, 10, 100, 50, 10, 0, 20, 0, 0, 0, 0, 0, 0, true)],
  ),
};

for (let charID in characterSettings) {
  Object.freeze(characterSettings[charID as CharacterNames]);
}

Object.freeze(characterSettings);

export { characterSettings };
