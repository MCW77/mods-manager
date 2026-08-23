import { registerSW } from "virtual:pwa-register";

let registration: ServiceWorkerRegistration | undefined;
let resolveRegistration: (() => void) | undefined;

const registrationReady = new Promise<void>((resolve) => {
	resolveRegistration = resolve;
});

const updateServiceWorker = registerSW({
	immediate: true,
	onRegisteredSW(_url, currentRegistration) {
		registration = currentRegistration;
		resolveRegistration?.();
	},
	onNeedReload() {
		window.location.reload();
	},
});

export async function updateToLatestVersion() {
	await registrationReady;
	await registration?.update();
	await updateServiceWorker();
}
