# Performance Benchmark Script

Use this with the integrated browser automation tools. It does not require a Playwright package in this repo.

The script below runs 10 optimizations, collects `[PERF]` console payloads, aggregates the values across runs, and returns a collapsible markdown block that can be copied into chat and appended to `,performance-log.md` in the project root.

```ts
const perfPrefix = "[PERF] ";
const maxRuns = 10;
const captured = [];
const runBoundaries = [];

function median(values) {
	if (values.length === 0) return null;
	const sorted = [...values].sort((left, right) => left - right);
	const middle = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0
		? (sorted[middle - 1] + sorted[middle]) / 2
		: sorted[middle];
}

function formatNumber(value) {
	return typeof value === "number" ? value.toFixed(2) : "n/a";
}

function formatRunTimestamp(date = new Date()) {
	const pad = (value) => String(value).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function toMarkdown(summary, optimizeWithRestrictions, targetStats) {
	const performanceTable = [
		"| Function | Median total ms | Median avg ms | Median min ms | Median max ms | Median count |",
		"| --- | ---: | ---: | ---: | ---: | ---: |",
	];

	const rows = summary.map((entry) => {
		return `| ${entry.fnName} | ${formatNumber(entry.medianTotal)} | ${formatNumber(entry.medianAvg)} | ${formatNumber(entry.medianMin)} | ${formatNumber(entry.medianMax)} | ${formatNumber(entry.medianCount)} |`;
	});

	return [
		"<details>",
		`<summary>Performance log: ${formatRunTimestamp()}</summary>`,
		"",
		`Optimize with primary and set restrictions: ${optimizeWithRestrictions}`,
		"",
		"Targetstats:",
		"| Stat | Min | Max |",
		"| --- | ---: | ---: |",
		...targetStats.map((targetStat) => {
			return `| ${targetStat.stat} | ${targetStat.min} | ${targetStat.max} |`;
		}),
		...(targetStats.length === 0 ? ["|  |  |  |"] : []),
		"",
		"Performance summary:",
		...performanceTable,
		...rows,
		"",
		"</details>",
	].join("\n");
}

async function getTargetStats() {
	const selectedCharacterArticle = page.locator("article").first();
	await selectedCharacterArticle.getByRole("button", { name: "Edit" }).click();
	await page.getByRole("tab", { name: "Target Stats" }).click();

	const targetStatCards = page
		.locator('[class*="group/card"]')
		.filter({ has: page.locator('input[type="number"]') });

	await targetStatCards.first().waitFor({
		state: "visible",
		timeout: 5000,
	});

	const targetStats = [];
	const targetStatCount = await targetStatCards.count();

	for (let index = 0; index < targetStatCount; index += 1) {
		const targetStatCard = targetStatCards.nth(index);
		const statSelector = targetStatCard.getByRole("combobox").first();
		const numberInputs = targetStatCard.locator('input[type="number"]');

		targetStats.push({
			stat: (await statSelector.textContent())?.trim() ?? "",
			min: await numberInputs.nth(0).inputValue(),
			max: await numberInputs.nth(1).inputValue(),
		});
	}

	await page.getByRole("button", { name: "Cancel" }).click();

	return targetStats;
}

async function getOptimizeWithRestrictionsSetting() {
	await page.getByRole("tab", { name: "Settings" }).click();
	await page.getByRole("tab", { name: "Mod Optimizer" }).click();

	const optimizeWithRestrictionsToggle = page.locator(
		'input[id^="optimize-with-restrictions-toggle"]',
	);

	await optimizeWithRestrictionsToggle.waitFor({
		state: "visible",
		timeout: 5000,
	});

	return optimizeWithRestrictionsToggle.isChecked();
}

async function ensureOptimizeModsView() {
	await page.getByRole("tab", { name: "Optimize my mods" }).click();

	const optimizeModsButton = page.getByRole("button", { name: "Optimize Mods" });
	const changeSelectionButton = page.getByRole("button", {
		name: "Change my selection",
	});

	for (let attempt = 0; attempt < 20; attempt += 1) {
		if (await optimizeModsButton.isVisible()) {
			return;
		}

		if (await changeSelectionButton.isVisible()) {
			await changeSelectionButton.click();
			await optimizeModsButton.waitFor({
				state: "visible",
				timeout: 5000,
			});
			return;
		}

		await page.waitForTimeout(250);
	}

	await optimizeModsButton.waitFor({
		state: "visible",
		timeout: 5000,
	});
}

page.on("console", (message) => {
	const text = message.text();
	if (!text.startsWith(perfPrefix)) return;
	try {
		const payload = JSON.parse(text.slice(perfPrefix.length));
		if (payload.kind === "measure") {
			captured.push(payload);
		}
	} catch {
		// Ignore malformed performance lines.
	}
});

const optimizeWithRestrictions = await getOptimizeWithRestrictionsSetting();
await ensureOptimizeModsView();
const targetStats = await getTargetStats();
await ensureOptimizeModsView();

for (let runIndex = 0; runIndex < maxRuns; runIndex += 1) {
	const startIndex = captured.length;
	await page.getByRole("button", { name: "Optimize Mods" }).click();
	await page.getByRole("button", { name: "Change my selection" }).waitFor({
		state: "visible",
		timeout: 120000,
	});
	await page.getByRole("button", { name: "Change my selection" }).click();
	await page.getByRole("button", { name: "Optimize Mods" }).waitFor({
		state: "visible",
		timeout: 5000,
	});
	runBoundaries.push({ run: runIndex + 1, messages: captured.slice(startIndex) });
}

const byFunction = new Map();

for (const run of runBoundaries) {
	for (const entry of run.messages) {
		const existing = byFunction.get(entry.fnName) ?? {
			fnName: entry.fnName,
			min: [],
			max: [],
			avg: [],
			total: [],
			count: [],
			runsSeen: 0,
		};

		existing.min.push(entry.min);
		existing.max.push(entry.max);
		existing.avg.push(entry.avg);
		existing.total.push(entry.total);
		existing.count.push(entry.count);
		existing.runsSeen += 1;
		byFunction.set(entry.fnName, existing);
	}
}

const summary = Array.from(byFunction.values())
	.sort((left, right) => left.fnName.localeCompare(right.fnName))
	.map((group) => ({
		fnName: group.fnName,
		runsSeen: group.runsSeen,
		medianMin: median(group.min),
		medianMax: median(group.max),
		medianAvg: median(group.avg),
		medianTotal: median(group.total),
		medianCount: median(group.count),
	}));

return {
	runsCompleted: runBoundaries.length,
	perfMessagesCaptured: captured.length,
	summary,
	targetStats,
	markdown: toMarkdown(summary, optimizeWithRestrictions, targetStats),
	appendTarget: ",performance-log.md",
};
```

After the run, append the returned `markdown` value to `,performance-log.md` in the project root.
