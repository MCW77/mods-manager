const categories = [
	"AllMods",
	"Calibrate",
	"Level",
	"Reveal",
	"Slice5Dot",
	"Slice6Dot",
	"Slice6E",
] as const;
type Categories = (typeof categories)[number];

export { categories, type Categories };
