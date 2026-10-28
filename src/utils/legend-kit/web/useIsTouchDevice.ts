import type { Observable } from "@legendapp/state";
import { useMount, useObservable } from "@legendapp/state/react";

function useIsTouchDevice(): Observable<boolean> {
  const isTouchDevice$ = useObservable(false);

  useMount(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    isTouchDevice$.set(mql.matches);
    const handler = (e: MediaQueryListEvent) => isTouchDevice$.set(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  });

  return isTouchDevice$;
}

export { useIsTouchDevice };
