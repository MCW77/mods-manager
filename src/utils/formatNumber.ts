export const formatNumber = (num: number) => {
	return num.toLocaleString(navigator.language, { useGrouping: true });
};
