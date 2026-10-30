import type { Observable } from "@legendapp/state";
import { useMount, useObservable } from "@legendapp/state/react";

function getStatusOnFirstRenderBeforeMount() {
	return typeof window === "undefined"
		? false
		: window.matchMedia("(pointer: coarse)").matches;
}

function useIsTouchDevice(): Observable<boolean> {
	const isTouchDevice$ = useObservable(getStatusOnFirstRenderBeforeMount());

	useMount(() => {
		const mql = window.matchMedia("(pointer: coarse)");
		// Update in case the initial check was done before window was available
		isTouchDevice$.set(mql.matches);
		const handler = (e: MediaQueryListEvent) => isTouchDevice$.set(e.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	});

	return isTouchDevice$;
}

export { useIsTouchDevice };
