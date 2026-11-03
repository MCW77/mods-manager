import type { Observable } from "@legendapp/state";
import { useMount, useObservable } from "@legendapp/state/react";

type Orientations = "landscape" | "portrait";

function orientationFromMediaQueryListEvent(
	e: MediaQueryListEvent | MediaQueryList,
): Orientations {
	return e.matches ? "landscape" : "portrait";
}
function getStatusOnFirstRenderBeforeMount() {
	return typeof window === "undefined"
		? "landscape"
		: window.matchMedia("(orientation: landscape)").matches
			? "landscape"
			: "portrait";
}

function useOrientation(): Observable<Orientations> {
	const orientation$ = useObservable<Orientations>(
		getStatusOnFirstRenderBeforeMount(),
	);

	useMount(() => {
		const mql = window.matchMedia("(orientation: landscape)");
		// Update in case the initial check was done before window was available
		orientation$.set(orientationFromMediaQueryListEvent(mql));
		const orientationChangeHandler = (e: MediaQueryListEvent) =>
			orientation$.set(orientationFromMediaQueryListEvent(e));
		mql.addEventListener("change", orientationChangeHandler);
		return () => mql.removeEventListener("change", orientationChangeHandler);
	});

	return orientation$;
}

export { useOrientation };
