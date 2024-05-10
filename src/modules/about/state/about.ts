// state
import { type ObservableObject, observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { dialog$ } from "#/modules/dialog/state/dialog";

// api
import { fetchVersion } from "../api/fetchVersion";

interface About {
	version: string;
	checkVersion: () => void;
}

export const about$: ObservableObject<About> = observable<About>({
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

persistObservable(about$.version, {
	local: {
		name: "About",
		indexedDB: {
			itemID: "version",
		},
	},
});
