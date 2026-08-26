// state
import { useValue } from "@legendapp/state/react";
import { statistics$ } from "../state/statistics";

// components
import { PieChart, Pie, Legend, type LegendPayload } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";

function isPayload(
	entry: LegendPayload,
): entry is { payload: { label: string }; value: string | undefined } {
	return (
		entry !== undefined &&
		entry !== null &&
		typeof entry === "object" &&
		Object.hasOwn(entry, "payload") &&
		typeof entry.payload === "object" &&
		Object.hasOwn(entry.payload, "label")
	);
}
function ModsetsCard() {
	const allModsByModset = useValue(statistics$.modsByModset);

	const data = [
		{
			modset: "Health %",
			label: "Health",
			count:
				allModsByModset.find((modset) => modset.modset === "Health %")?.count ??
				0,
			fill: "lightblue",
		},
		{
			modset: "Defense %",
			label: "Defense",
			count:
				allModsByModset.find((modset) => modset.modset === "Defense %")
					?.count ?? 0,
			fill: "blue",
		},
		{
			modset: "Speed %",
			label: "Speed",
			count:
				allModsByModset.find((modset) => modset.modset === "Speed %")?.count ??
				0,
			fill: "gold",
		},
		{
			modset: "Critical Damage %",
			label: "Critical Damage",
			count:
				allModsByModset.find((modset) => modset.modset === "Critical Damage %")
					?.count ?? 0,
			fill: "darkviolet",
		},
		{
			modset: "Critical Chance %",
			label: "Critical Chance",
			count:
				allModsByModset.find((modset) => modset.modset === "Critical Chance %")
					?.count ?? 0,
			fill: "violet",
		},
		{
			modset: "Potency %",
			label: "Potency",
			count:
				allModsByModset.find((modset) => modset.modset === "Potency %")
					?.count ?? 0,
			fill: "pink",
		},
		{
			modset: "Tenacity %",
			label: "Tenacity",
			count:
				allModsByModset.find((modset) => modset.modset === "Tenacity %")
					?.count ?? 0,
			fill: "cyan",
		},
		{
			modset: "Offense %",
			label: "Offense",
			count:
				allModsByModset.find((modset) => modset.modset === "Offense %")
					?.count ?? 0,
			fill: "red",
		},
	];

	return (
		<Card className="min-w-0 w-full max-w-[600px]">
			<CardHeader className="flex flex-col items-stretch justify-between sm:flex-row">
				<div>
					<CardTitle>Modsets</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="h-[300px]">
				<PieChart<{
					count: number;
					modset: string;
					label: string;
					fill: string;
				}>
					style={{
						width: "100%",
						height: "100%",
					}}
					responsive
				>
					<Pie data={data} dataKey="count" label={true} />
					<Legend
						formatter={(_value, entry, _index) => [
							`${isPayload(entry) ? entry.payload.label : ""}`,
						]}
						position={"right"}
					/>
				</PieChart>
			</CardContent>
		</Card>
	);
}

export { ModsetsCard };
