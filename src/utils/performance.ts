interface MeasureData {
	name: string;
	max: number;
	min: number;
	avg: number;
	count: number;
	total: number;
}

const times: Record<string, MeasureData> = {};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function measureTime<T extends (...args: any[]) => any>(
	fn: T,
	fnName: string,
) {
	return new Proxy(fn, {
		apply(target, thisArg, args: Parameters<T>): ReturnType<T> {
			const start = performance.now();
			const result = Reflect.apply(target, thisArg, args) as ReturnType<T>;
			const end = performance.now();
			const time = end - start;
			if (!times[fnName]) {
				times[fnName] = {
					name: fnName,
					max: time,
					min: time,
					avg: time,
					total: time,
					count: 1,
				};
			} else {
				const { max, min, avg, total, count } = times[fnName];
				times[fnName] = {
					name: fnName,
					max: Math.max(max, time),
					min: Math.min(min, time),
					avg: (total + time) / (1 + count),
					total: total + time,
					count: count + 1,
				};
			}
			return result;
		},
	}) as T;
}

export function logMeasures(fnName: string) {
	const measurement = times[fnName];
	if (!measurement) {
		console.log(`Function ${fnName} was not measured.`);
		return;
	}

	const { max, min, avg, total, count } = measurement;
	console.log(
		`Function ${fnName} took: min: ${min}ms, max: ${max}ms, avg: ${avg}ms, total: ${total}ms, count: ${count}`,
	);
}
