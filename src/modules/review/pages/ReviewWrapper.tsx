// react
import { lazy, Suspense } from "react";
import { Show } from "@legendapp/state/react";

// utils
import { useIsTouchDevice } from "#/utils/legend-kit/web/useIsTouchDevice";

// components
// Lazy load the review components based on device type
const ReviewDesktop = lazy(() =>
	import("#/modules/review/pages/Review").then((m) => ({ default: m.default })),
);
const ReviewMobile = lazy(() =>
	import("#/modules/review/pages/ReviewMobile").then((m) => ({
		default: m.default,
	})),
);

// Wrapper component that selects the appropriate Review component based on touch device status
function ReviewWrapper() {
	const isTouchDevice$ = useIsTouchDevice();

	return (
		<Suspense
			fallback={<div className="flex-1 flex items-center justify-center" />}
		>
			<Show if={isTouchDevice$} else={() => <ReviewDesktop />}>
				{() => <ReviewMobile />}
			</Show>
		</Suspense>
	);
}

export default ReviewWrapper;
