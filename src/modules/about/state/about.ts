// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { dialog$ } from "#/modules/dialog/state/dialog";

// api
import { fetchVersion } from "../api/fetchVersion";

// domain
import type { AboutObservable } from "../domain/AboutObservable";

const about$: ObservableObject<AboutObservable> = observable<AboutObservable>({
	version: String(import.meta.env.VITE_VERSION) || "local",
	checkVersion: async () => {
		try {
			const currentVersion = about$.version.get();
			const fetchedVersion = await fetchVersion();
			if (fetchedVersion !== currentVersion) {
				dialog$.showFlash(
					`Newer version available:
            Newest version: ${fetchedVersion}
            Your version: ${currentVersion}`,
					"",
					"Get new version",
					() => window.location.assign(`${location.href}?reload=${Date.now()}`),
					"warning",
				);
			}
		} catch (error) {
			dialog$.showFlash(
				"Checking if new version is available failed",
				"Maybe our server is down or there are connection issues. You can reload the page or just continue using the current version.",
				"Reload page",
				() => window.location.assign(`${location.href}?reload=${Date.now()}`),
				"warning",
			);
		}
	},
});

const syncStatus$ = syncObservable(
	about$.version,
	persistOptions({
		persist: {
			name: "About",
			indexedDB: {
				itemID: "version",
			},
		},
	}),
);
await when(syncStatus$.isPersistLoaded);

export { about$ };
