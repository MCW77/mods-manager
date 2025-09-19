// utils
import * as v from "valibot";

const DatacronSchema = v.object({
	id: v.string(),
	setId: v.number(),
	templateId: v.string(),
	tag: v.array(v.string()),
	affix: v.array(
		v.object({
			targetRule: v.string(),
			abilityId: v.string(),
			statType: v.number(),
			statValue: v.number(),
			tag: v.array(v.string()),
			requiredUnitTier: v.number(),
			requiredRelicTier: v.number(),
			scopeIcon: v.string(),
		}),
	),

	locked: v.boolean(),
	rerollIndex: v.number(),
	focused: v.boolean(),
	rerollCount: v.number(),
});

const StatSchema = v.object({
	stat: v.object({
		unitStatId: v.number(),
	}),
	unscaledRollValue: v.array(v.number()),
});

const ModSchema = v.pipe(
	v.object({
		id: v.string(),
		inLoadout: v.boolean(),
		loadouts: v.nullable(
			v.array(
				v.object({
					loadoutName: v.string(),
					tabName: v.string(),
				}),
			),
		),
		locked: v.boolean(),
		secondaryStat: v.array(StatSchema),
	}),
	v.transform((data) => {
		let speedRemainder = 0;
		const speedStat = data.secondaryStat.find(
			(stat) => stat.stat.unitStatId === 5,
		);
		if (speedStat) {
			const totalSpeed = speedStat.unscaledRollValue.reduce((a, b) => a + b, 0);
			speedRemainder = Math.round(((totalSpeed / 100000) % 1) * 100) / 100;
		}
		return {
			id: data.id,
			inLoadout: data.inLoadout,
			loadouts: data.loadouts,
			locked: data.locked,
			speedRemainder,
		};
	}),
);

const ModsSchema = v.object({
	mods: v.array(ModSchema),
});

const ProfileSummarySchema = v.pipe(
	v.object({
		allyCode: v.number(),
		guildName: v.nullable(v.string()),
		name: v.string(),
	}),
	v.transform((data) => ({
		allycode: data.allyCode,
		guildName: data.guildName,
		name: data.name,
	})),
);

const SkillSchema = v.object({
	id: v.string(),
	isZeta: v.boolean(),
	tier: v.number(),
	tiers: v.number(),
});

const UnitSchema = v.object({
	baseId: v.string(),
	zetaCount: v.number(),
	omiCount: v.number(),
	twOmiCount: v.number(),
	gacOmiCount: v.number(),
	tbOmiCount: v.number(),
	cqOmiCount: v.number(),
	zetas: v.nullable(v.array(v.string())),
	omis: v.nullable(v.array(v.string())),
	skills: v.array(SkillSchema),
});

const UnitsSchema = v.object({
	summary: v.object({
		zetaCount: v.number(),
		omiCount: v.number(),
		twOmiCount: v.number(),
		gacOmiCount: v.number(),
		tbOmiCount: v.number(),
		cqOmiCount: v.number(),
		relic0Count: v.number(),
		relic1Count: v.number(),
		relic2Count: v.number(),
		relic3Count: v.number(),
		relic4Count: v.number(),
		relic5Count: v.number(),
		relic6Count: v.number(),
		relic7Count: v.number(),
		relic8Count: v.number(),
		relic9Count: v.number(),
		g11Count: v.number(),
		g12Count: v.number(),
		g13Count: v.number(),
		mod6Dot: v.number(),
		speed25: v.number(),
		speed20: v.number(),
		speed15: v.number(),
		speed10: v.number(),
		offensePercent4: v.number(),
		offensePercent6: v.number(),
		plusSpeed: v.number(),
		star7Count: v.number(),
		ultimateGLCount: v.number(),
		characterGP65: v.number(),
		characterGP80: v.number(),
		glCount: v.number(),
		modScore: v.number(),
		gearScore: v.number(),
		totalScore: v.number(),
	}),
	units: v.array(UnitSchema),
});

const FetchedFullGIMOProfileSchema = v.object({
	datacrons: v.array(DatacronSchema),
	mods: ModsSchema,
	summary: ProfileSummarySchema,
	units: UnitsSchema,
});

const FetchedFullGIMOProfileResponseSchema = v.object({
	data: FetchedFullGIMOProfileSchema,
	errorMessage: v.nullable(v.string()),
	errorSeverity: v.number(),
	responseCode: v.number(),
	responseMessage: v.string(),
});

type FetchedFullGIMOProfile = v.InferOutput<
	typeof FetchedFullGIMOProfileSchema
>;

export { type FetchedFullGIMOProfile, FetchedFullGIMOProfileResponseSchema };
