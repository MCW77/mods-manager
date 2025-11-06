type ResolveHandler = (value: IDBDatabase | PromiseLike<IDBDatabase>) => void;
type RejectHandler = () => void;
export function defer() {
	let res: ResolveHandler = (
		_value: IDBDatabase | PromiseLike<IDBDatabase>,
	) => {};
	let rej: RejectHandler = () => {};

	interface DBPromise extends Promise<IDBDatabase> {
		resolve: (value: IDBDatabase | PromiseLike<IDBDatabase>) => void;
		reject: () => void;
	}

	const promise: DBPromise = Object.assign(
		new Promise<IDBDatabase>(
			(resolve: ResolveHandler, reject: RejectHandler) => {
				res = resolve;
				rej = reject;
			},
		),
		{
			resolve: (_value: IDBDatabase | PromiseLike<IDBDatabase>) => {},
			reject: () => {},
		},
	);

	promise.resolve = res;
	promise.reject = rej;

	return promise;
}
