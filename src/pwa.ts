import { registerSW } from "virtual:pwa-register";

let registration: ServiceWorkerRegistration | undefined;
let resolveRegistration: (() => void) | undefined;
let resolveUpdateReady: (() => void) | undefined;
let updateReady = false;

const registrationReady = new Promise<void>((resolve) => {
	resolveRegistration = resolve;
});

const updateReadyPromise = new Promise<void>((resolve) => {
	resolveUpdateReady = resolve;
});

const updateServiceWorker = registerSW({
	immediate: true,
	onRegisteredSW(_url, currentRegistration) {
		registration = currentRegistration;
		resolveRegistration?.();
	},
	onNeedRefresh() {
		updateReady = true;
		resolveUpdateReady?.();
	},
	onNeedReload() {
		window.location.reload();
	},
});

export async function updateToLatestVersion() {
	await registrationReady;

	if (!updateReady) {
		await registration?.update();
		await updateReadyPromise;
	}

	await updateServiceWorker();
}
