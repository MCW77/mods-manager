// Map dynamic per-version fixtures under ./fixtures/db/v*.ts
const loaders = import.meta.glob("./fixtures/**/v*.ts");

/**
 * Load a fixture by version from a subdirectory under ./fixtures
 * @param version Version number, e.g., 16
 * @param category Subdirectory name under ./fixtures (e.g., 'backup', 'templates'). Defaults to 'backup'.
 */
export async function loadFixture(
	version: number,
	category: "backup" | "db" | "templates" = "backup",
	fixtureName = "defaultFixture",
): Promise<Record<string, unknown>> {
	const key = `./fixtures/${category}/v${version}.ts`;
	const loader = loaders[key];
	if (loader) {
		const mod = (await loader()) as {
			[fixtureName]?: Record<string, unknown>;
		};
		if (mod && "defaultFixture" in mod)
			return mod.defaultFixture as Record<string, unknown>;
		throw new Error(`Fixture module '${key}' must export { defaultFixture }.`);
	}
	throw new Error(
		`Didn't find fixture ${fixtureName} for version v${version} in '${category}'. Create tests/migrations/fixtures/${category}/v${version}.ts exporting { ${fixtureName} }.`,
	);
}
