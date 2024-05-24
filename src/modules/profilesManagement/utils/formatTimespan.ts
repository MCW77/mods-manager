const formatTimespan = (elapsedTime: number): string => {
	const timezoneOffset = new Date(elapsedTime).getTimezoneOffset() * 60000;
	const time = new Date(elapsedTime + timezoneOffset);
	const [days, hours, minutes, seconds] = [
		Math.floor(time.getHours() / 24),
		time.getHours(),
		time.getMinutes(),
		time.getSeconds(),
	];
	const relevantTime =
		days > 0
			? { time: days, unit: "days" }
			: hours > 0
				? { time: hours, unit: "hours" }
				: minutes > 0
					? { time: minutes, unit: "minutes" }
					: { time: seconds, unit: "seconds" };
	if (days === 1) return "Yesterday";
	if (hours === 1) return "An hour ago";
	if (minutes === 1) return "A minute ago";
	if (relevantTime.unit === "seconds") return "Just now";
	return `${relevantTime.time} ${relevantTime.unit} ago`;
};

export { formatTimespan };
