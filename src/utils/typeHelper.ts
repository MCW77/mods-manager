type ElementType<T extends ReadonlyArray<unknown>> =
	T extends ReadonlyArray<infer ElementType> ? ElementType : never;

type Indexed<T> = {
	[key in keyof T]: T[key];
};

/*
type ExcludeMatchingProperties<T, V> = Pick<
	T,
	{ [K in keyof T]-?: T[K] extends V ? never : K }[keyof T]
>;

type ExpandRecursively<T> = T extends object
	? T extends (...args: never[]) => unknown
		? T
		: T extends infer O
			? { [K in keyof O]: ExpandRecursively<O[K]> }
			: never
	: T;

type ExpandRecursivelyNoFuncs<T> = ExpandRecursively<
	ExcludeMatchingProperties<T, (...args: never[]) => unknown>
>;

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

type PrettifyRecursively<T> = T extends object
	? T extends (...args: never[]) => unknown
		? T
		: T extends infer O
			? { [K in keyof O]: PrettifyRecursively<O[K]> }
			: never
	: T;
*/

export type { ElementType, Indexed };
