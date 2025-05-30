export type ElementType<T extends ReadonlyArray<unknown>> =
	T extends ReadonlyArray<infer ElementType> ? ElementType : never;

export type Indexed<T> = {
	[key in keyof T]: T[key];
};

export type ExcludeMatchingProperties<T, V> = Pick<
	T,
	{ [K in keyof T]-?: T[K] extends V ? never : K }[keyof T]
>;

export type ExpandRecursively<T> = T extends object
	? T extends Function
		? T
		: T extends infer O
			? { [K in keyof O]: ExpandRecursively<O[K]> }
			: never
	: T;

export type ExpandRecursivelyNoFuncs<T> = ExpandRecursively<
	ExcludeMatchingProperties<T, Function>
>;

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
export type PrettifyRecursively<T> = T extends object
	? T extends Function
		? T
		: T extends infer O
			? { [K in keyof O]: PrettifyRecursively<O[K]> }
			: never
	: T;
