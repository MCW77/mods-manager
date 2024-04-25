import type { SetStats } from "./Stats";

type SetRestrictions = Partial<Record<SetStats.GIMOStatNames, number>>;

// Todo Use below typeguard when ts 5.5 is released
function hasRestrictionOn(
	setRestrictions: SetRestrictions,
	set: SetStats.GIMOStatNames,
) {
	return (
		setRestrictions !== undefined &&
		setRestrictions !== null &&
		set in setRestrictions
	);
}

export { type SetRestrictions, hasRestrictionOn };
