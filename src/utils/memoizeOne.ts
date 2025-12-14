import areInputsEqual from "./are-inputs-equal";

type ThisParamType<T> = T extends (this: infer U, ...args: never) => unknown
	? U
	: unknown;
export type MemoizedFn<
	// biome-ignore lint/suspicious/noExplicitAny: Generic constraint requires any for proper type inference
	TFunc extends (this: any, ...args: any[]) => any,
> = {
	clear: () => void;
	(this: ThisParamType<TFunc>, ...args: Parameters<TFunc>): ReturnType<TFunc>;
};

// biome-ignore lint/suspicious/noExplicitAny: Generic constraint requires any for proper type inference
type Cache<TFunc extends (this: any, ...args: any[]) => any> = {
	lastThis: ThisParamType<TFunc>;
	lastArgs: Parameters<TFunc>;
	lastResult: ReturnType<TFunc>;
};

function memoizeOne<
	// biome-ignore lint/suspicious/noExplicitAny: Generic constraint requires any for proper type inference
	TFunc extends (this: any, ...newArgs: any[]) => any,
>(resultFn: TFunc): MemoizedFn<TFunc> {
	let cache: Cache<TFunc> | null = null;

	// breaking cache when context (this) or arguments change
	function memoized(
		this: ThisParamType<TFunc>,
		...newArgs: Parameters<TFunc>
	): ReturnType<TFunc> {
		if (
			cache &&
			cache.lastThis === this &&
			areInputsEqual(newArgs, cache.lastArgs)
		) {
			return cache.lastResult;
		}

		// Throwing during an assignment aborts the assignment: https://codepen.io/alexreardon/pen/RYKoaz
		// Doing the lastResult assignment first so that if it throws
		// the cache will not be overwritten
		const lastResult = resultFn.apply(this, newArgs) as ReturnType<TFunc>;
		cache = {
			lastResult,
			lastArgs: newArgs,
			lastThis: this,
		};

		return lastResult;
	}

	// Adding the ability to clear the cache of a memoized function
	memoized.clear = function clear() {
		cache = null;
	};

	return memoized;
}

export { memoizeOne };
