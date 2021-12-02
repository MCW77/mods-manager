type ResolveHandler = (value: IDBDatabase | PromiseLike<IDBDatabase>) => void;
type RejectHandler = (reason?: any) => void;
export function defer() {
  let res: ResolveHandler = (value: IDBDatabase | PromiseLike<IDBDatabase>) => {};
  let rej: RejectHandler = () => {};

  interface DBPromise extends Promise<IDBDatabase> 
    {
      resolve: (value: IDBDatabase | PromiseLike<IDBDatabase>) => void;
      reject: (reason?: any) => void 
    };

  let promise: DBPromise = Object.assign(
    new Promise<IDBDatabase>((resolve: ResolveHandler, reject: RejectHandler) => {
      res = resolve;
      rej = reject;
    }),
    {
      resolve: (value: IDBDatabase | PromiseLike<IDBDatabase>) => {},
      reject: () => {}
    }
  );

  promise.resolve = res;
  promise.reject = rej;

  return promise;
}