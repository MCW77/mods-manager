// utils
import type * as UtilityTypes from "#/utils/typeHelper";
export const characterNames = [
	"50RT",
	"AAYLASECURA",
	"ADMINISTRATORLANDO",
	"ADMIRALACKBAR",
	"ADMIRALPIETT",
	"ADMIRALRADDUS",
	"AHSOKATANO",
	"AMILYNHOLDO",
	"ANAKINKNIGHT",
	"ARCTROOPER501ST",
	"ARMORER",
	"ASAJVENTRESS",
	"AURRA_SING",
	"BADBATCHECHO",
	"BADBATCHHUNTER",
	"BADBATCHOMEGA",
	"BADBATCHTECH",
	"BADBATCHWRECKER",
	"B1BATTLEDROIDV2",
	"B2SUPERBATTLEDROID",
	"BARRISSOFFEE",
	"BASTILASHAN",
	"BASTILASHANDARK",
	"BATCHERS3",
	"BAYLANSKOLL",
	"BAZEMALBUS",
	"BB8",
	"BENSOLO",
	"BIGGSDARKLIGHTER",
	"BISTAN",
	"BOBAFETT",
	"BOBAFETTSCION",
	"BODHIROOK",
	"BOKATAN",
	"BOOMADIER",
	"BOSSK",
	"BOSSNASS",
	"BOUSHH",
	"BT1",
	"C3POCHEWBACCA",
	"C3POLEGENDARY",
	"CADBANE",
	"CALKESTIS",
	"CANDEROUSORDO",
	"CAPTAINDROGAN",
	"CAPTAINENOCH",
	"CAPTAINREX",
	"CAPTAINTARPALS",
	"CARADUNE",
	"CARTHONASI",
	"CASSIANANDOR",
	"CC2224",
	"CEREJUNDA",
	"CHEWBACCALEGENDARY",
	"CHIEFCHIRPA",
	"CHIEFNEBIT",
	"CHIRRUTIMWE",
	"CHOPPERS3",
	"CLONESERGEANTPHASEI",
	"CLONEWARSCHEWBACCA",
	"COLONELSTARCK",
	"COMMANDERAHSOKA",
	"COMMANDERLUKESKYWALKER",
	"CORUSCANTUNDERWORLDPOLICE",
	"COUNTDOOKU",
	"CROSSHAIRS3",
	"CT5555",
	"CT7567",
	"CT210408",
	"DAKA",
	"DARKTROOPER",
	"DARTHBANE",
	"DARTHMALAK",
	"DARTHMALGUS",
	"DARTHNIHILUS",
	"DARTHREVAN",
	"DARTHSIDIOUS",
	"DARTHSION",
	"DARTHTALON",
	"DARTHTRAYA",
	"DASHRENDAR",
	"DATHCHA",
	"DEATHTROOPER",
	"DEATHTROOPERPERIDEA",
	"DENGAR",
	"DIRECTORKRENNIC",
	"DOCTORAPHRA",
	"DROIDEKA",
	"EETHKOTH",
	"EIGHTHBROTHER",
	"EMBO",
	"EMPERORPALPATINE",
	"ENFYSNEST",
	"EPIXFINN",
	"EPIXPOE",
	"EWOKELDER",
	"EWOKSCOUT",
	"EZRABRIDGERS3",
	"EZRAEXILE",
	"FENNECSHAND",
	"FIFTHBROTHER",
	"FINN",
	"FIRSTORDEREXECUTIONER",
	"FIRSTORDEROFFICERMALE",
	"FIRSTORDERSPECIALFORCESPILOT",
	"FIRSTORDERTIEPILOT",
	"FIRSTORDERTROOPER",
	"FOSITHTROOPER",
	"FULCRUMAHSOKA",
	"GAMORREANGUARD",
	"GARSAXON",
	"GENERALHUX",
	"GENERALKENOBI",
	"GENERALSKYWALKER",
	"GENERALSYNDULLA",
	"GEONOSIANBROODALPHA",
	"GEONOSIANSOLDIER",
	"GEONOSIANSPY",
	"GLAHSOKATANO",
	"GLLEIA",
	"GLREY",
	"GRANDADMIRALTHRAWN",
	"GRANDINQUISITOR",
	"GRANDMASTERLUKE",
	"GRANDMASTERYODA",
	"GRANDMOFFTARKIN",
	"GREATMOTHERS",
	"GREEDO",
	"GREEFKARGA",
	"GRIEVOUS",
	"GUNGANPHALANX",
	"HANSOLO",
	"HERASYNDULLAS3",
	"HERMITYODA",
	"HK47",
	"HONDO",
	"HOTHHAN",
	"HOTHLEIA",
	"HOTHREBELSCOUT",
	"HOTHREBELSOLDIER",
	"HUMANTHUG",
	"HUNTERS3",
	"HUYANG",
	"IDENVERSIOEMPIRE",
	"IG11",
	"IG12",
	"IG86SENTINELDROID",
	"IG88",
	"IMAGUNDI",
	"IMPERIALPROBEDROID",
	"IMPERIALSUPERCOMMANDO",
	"JABBATHEHUTT",
	"JANGOFETT",
	"JARJARBINKS",
	"JAWA",
	"JAWAENGINEER",
	"JAWASCAVENGER",
	"JEDIKNIGHTCAL",
	"JEDIKNIGHTCONSULAR",
	"JEDIKNIGHTGUARDIAN",
	"JEDIKNIGHTLUKE",
	"JEDIKNIGHTREVAN",
	"JEDIMASTERKENOBI",
	"JOCASTANU",
	"JOLEEBINDO",
	"JUHANI",
	"JYNERSO",
	"K2SO",
	"KANANJARRUSS3",
	"KELLERANBEQ",
	"KIADIMUNDI",
	"KITFISTO",
	"KRRSANTAN",
	"KUIIL",
	"KYLEKATARN",
	"KYLOREN",
	"KYLORENUNMASKED",
	"L3_37",
	"LOBOT",
	"LOGRAY",
	"LORDVADER",
	"LUKESKYWALKER",
	"LUMINARAUNDULI",
	"LUTHENRAEL",
	"MACEWINDU",
	"MAGMATROOPER",
	"MAGNAGUARD",
	"MANDALORBOKATAN",
	"MARAJADE",
	"MARROK",
	"MASTERQUIGON",
	"MAUL",
	"MAULS7",
	"MERRIN",
	"MISSIONVAO",
	"MOFFGIDEONS1",
	"MOFFGIDEONS3",
	"MONMOTHMA",
	"MORGANELSBETH",
	"MOTHERTALZIN",
	"NIGHTSISTERACOLYTE",
	"NIGHTSISTERINITIATE",
	"NIGHTSISTERSPIRIT",
	"NIGHTSISTERZOMBIE",
	"NIGHTTROOPER",
	"NINTHSISTER",
	"NUTEGUNRAY",
	"OLDBENKENOBI",
	"OMEGAS3",
	"PADAWANOBIWAN",
	"PADAWANSABINE",
	"PADMEAMIDALA",
	"PAO",
	"PAPLOO",
	"PAZVIZSLA",
	"PHASMA",
	"PLOKOON",
	"POE",
	"POGGLETHELESSER",
	"PRINCESSKNEESAA",
	"PRINCESSLEIA",
	"QIRA",
	"QUEENAMIDALA",
	"QUIGONJINN",
	"R2D2_LEGENDARY",
	"RANGETROOPER",
	"RESISTANCEPILOT",
	"RESISTANCETROOPER",
	"REY",
	"REYJEDITRAINING",
	"ROSETICO",
	"ROYALGUARD",
	"SABINEWRENS3",
	"SANASTARROS",
	"SAVAGEOPRESS",
	"SAWGERRERA",
	"SCARIFREBEL",
	"SCOUTTROOPER_V3",
	"SECONDSISTER",
	"SEVENTHSISTER",
	"SHAAKTI",
	"SHINHATI",
	"SHORETROOPER",
	"SITHASSASSIN",
	"SITHMARAUDER",
	"SITHPALPATINE",
	"SITHTROOPER",
	"SMUGGLERCHEWBACCA",
	"SMUGGLERHAN",
	"SNOWTROOPER",
	"STAP",
	"STARKILLER",
	"STORMTROOPER",
	"STORMTROOPERHAN",
	"SUNFAC",
	"SUPREMELEADERKYLOREN",
	"T3_M4",
	"TALIA",
	"TARFFUL",
	"TARONMALICOS",
	"TEEBO",
	"THEMANDALORIAN",
	"THEMANDALORIANBESKARARMOR",
	"THIRDSISTER",
	"TIEFIGHTERPILOT",
	"TRENCH",
	"TRIPLEZERO",
	"TUSKENCHIEFTAIN",
	"TUSKENHUNTRESS",
	"TUSKENRAIDER",
	"TUSKENSHAMAN",
	"UGNAUGHT",
	"UNDERCOVERLANDO",
	"URORRURRR",
	"VADER",
	"VEERS",
	"VISASMARR",
	"WAMPA",
	"WATTAMBOR",
	"WEDGEANTILLES",
	"WICKET",
	"WRECKERS3",
	"YOUNGCHEWBACCA",
	"YOUNGHAN",
	"YOUNGLANDO",
	"ZAALBAR",
	"ZAMWESELL",
	"ZEBS3",
	"ZORIIBLISS_V2",
] as const;

export type CharacterNames = UtilityTypes.ElementType<typeof characterNames>;
