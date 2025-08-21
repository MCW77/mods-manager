interface MeasureData {
	name: string;
	max: number;
	min: number;
	avg: number;
	count: number;
	total: number;
}

const times: Record<string, MeasureData> = {};

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
	return typeof (value as { then?: unknown }).then === "function";
}
function isPromise(value: unknown): value is Promise<unknown> {
	return typeof Promise !== "undefined" && value instanceof Promise;
}

export function measureTime<TArgs extends unknown[], TReturn, TThis = unknown>(
	fn: (this: TThis, ...args: TArgs) => TReturn,
	fnName: string,
): (this: TThis, ...args: TArgs) => TReturn {
	function record(time: number) {
		if (!times[fnName]) {
			times[fnName] = {
				name: fnName,
				max: time,
				min: time,
				avg: time,
				total: time,
				count: 1,
			};
			return;
		}
		const { max, min, total, count } = times[fnName];
		times[fnName] = {
			name: fnName,
			max: Math.max(max, time),
			min: Math.min(min, time),
			avg: (total + time) / (1 + count),
			total: total + time,
			count: count + 1,
		};
	}

	function measured(this: TThis, ...args: TArgs): TReturn {
		const start = performance.now();
		const result = fn.apply(this, args);

		if (isPromise(result)) {
			// Native Promise: can use finally
			return (result as Promise<unknown>).finally(() => {
				const end = performance.now();
				record(end - start);
			}) as unknown as TReturn;
		}
		if (isPromiseLike(result)) {
			// Generic thenable: record on both resolve and reject
			return (result as PromiseLike<unknown>).then(
				(value) => {
					const end = performance.now();
					record(end - start);
					return value as unknown;
				},
				(err) => {
					const end = performance.now();
					record(end - start);
					throw err;
				},
			) as unknown as TReturn;
		}

		const end = performance.now();
		record(end - start);
		return result;
	}

	return measured;
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
