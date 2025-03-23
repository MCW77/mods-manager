const categories = [
	"Reveal",
	"Level",
	"Slice5Dot",
	"Slice6E",
	"Slice6Dot",
	"Calibrate",
	"AllMods",
] as const;
type Categories = (typeof categories)[number];

export { categories, type Categories };
