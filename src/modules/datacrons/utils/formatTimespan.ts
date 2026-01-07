const formatTimespan = (remainingTime: number): string => {
	const totalSeconds = Math.floor(remainingTime / 1000);
	const totalMinutes = Math.floor(totalSeconds / 60);
	const totalHours = Math.floor(totalMinutes / 60);
	const days = Math.floor(totalHours / 24);

	if (days > 0) return `${days} day${days === 1 ? "" : "s"}`;
	if (totalHours > 0) return `${totalHours} hour${totalHours === 1 ? "" : "s"}`;
	if (totalMinutes > 0)
		return `${totalMinutes} minute${totalMinutes === 1 ? "" : "s"}`;
	return "Just now";
};

export { formatTimespan };
