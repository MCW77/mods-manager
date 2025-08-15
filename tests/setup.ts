import { beforeEach, vi } from "vitest";

// Mock navigator.storage (guarded): only define if missing; otherwise spy on estimate
function setupNavigatorStorageMock(): void {
	const ONE_GB = 1024 * 1024 * 1024;
	const resolvedEstimate = { usage: 0, quota: ONE_GB };

	// Avoid direct property access to keep TS happy and bypass non-configurable descriptors
	const hasStorage = "storage" in navigator;
	const existingStorage: unknown = (
		navigator as unknown as { storage?: unknown }
	).storage;

	if (
		hasStorage &&
		existingStorage &&
		typeof (existingStorage as { estimate?: unknown }).estimate === "function"
	) {
		// Spy on existing estimate implementation so calls are predictable
		vi.spyOn(
			existingStorage as { estimate: () => Promise<unknown> },
			"estimate",
		).mockResolvedValue(resolvedEstimate);
	} else if (
		hasStorage &&
		existingStorage &&
		typeof (existingStorage as { estimate?: unknown }).estimate !== "function"
	) {
		// Add estimate if storage exists but lacks the method
		(existingStorage as { estimate: () => Promise<unknown> }).estimate = vi
			.fn()
			.mockResolvedValue(resolvedEstimate);
	} else {
		// No storage on navigator: define a minimal StorageManager stub
		Object.defineProperty(navigator, "storage", {
			value: {
				estimate: vi.fn().mockResolvedValue(resolvedEstimate),
			},
			configurable: true,
		});
	}
}

setupNavigatorStorageMock();

// Reset all mocks before each test
beforeEach(() => {
	vi.clearAllMocks();
});
