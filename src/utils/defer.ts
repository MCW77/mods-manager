export function defer() {
  var res, rej;

  interface DBPromise extends Promise<IDBDatabase> 
    {
      resolve: (value: IDBDatabase | PromiseLike<IDBDatabase>) => void;
      reject: (reason?: any) => void 
    };

  var promise: DBPromise = new Promise<IDBDatabase>((resolve, reject) => {
      res = resolve;
      rej = reject;
  });

  promise.resolve = res;
  promise.reject = rej;

  return promise;
}