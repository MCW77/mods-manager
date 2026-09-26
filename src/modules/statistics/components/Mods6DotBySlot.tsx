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
function Mods6DotBySlot() {
	const mods6DotBySlot = useValue(statistics$.mods6DotBySlot);

	const data = [
		{
			slot: "square",
			label: "Square",
			count: mods6DotBySlot.find((item) => item.slot === "square")?.count ?? 0,
			fill: "red",
		},
		{
			slot: "arrow",
			label: "Arrow",
			count: mods6DotBySlot.find((item) => item.slot === "arrow")?.count ?? 0,
			fill: "gold",
		},
		{
			slot: "diamond",
			label: "Diamond",
			count: mods6DotBySlot.find((item) => item.slot === "diamond")?.count ?? 0,
			fill: "cyan",
		},
		{
			slot: "triangle",
			label: "Triangle",
			count:
				mods6DotBySlot.find((item) => item.slot === "triangle")?.count ?? 0,
			fill: "violet",
		},
		{
			slot: "circle",
			label: "Circle",
			count: mods6DotBySlot.find((item) => item.slot === "circle")?.count ?? 0,
			fill: "blue",
		},
		{
			slot: "cross",
			label: "Cross",
			count: mods6DotBySlot.find((item) => item.slot === "cross")?.count ?? 0,
			fill: "green",
		},
	];

	return (
		<Card className="min-w-0 w-full max-w-[600px]">
			<CardHeader className="flex flex-col items-stretch justify-between sm:flex-row">
				<div>
					<CardTitle>6-Dot Mods by Slot</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="h-[300px]">
				<PieChart<{
					count: number;
					slot: string;
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

export { Mods6DotBySlot };
