// state
import { useValue } from "@legendapp/state/react";
import { statistics$ } from "../state/statistics";

// components
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	type TooltipContentProps,
	Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip } from "#ui/charts";
import { Item, ItemContent, ItemTitle } from "#ui/item";

function CustomTooltip({ active, payload, label }: TooltipContentProps) {
	const firstPayload = payload?.[0];
	const isVisible = active && firstPayload != null;
	return (
		<div
			className="custom-tooltip"
			style={{
				visibility: isVisible ? "visible" : "hidden",
			}}
		>
			{isVisible && (
				<Item className="bg-black">
					<ItemContent>
						<ItemTitle>{`Speed ${label}`}</ItemTitle>
						<div className="flex flex-col">
							<div>square: {firstPayload.payload.square}</div>
							<div>arrow: {firstPayload.payload.arrow}</div>
							<div>diamond: {firstPayload.payload.diamond}</div>
							<div>triangle: {firstPayload.payload.triangle}</div>
							<div>circle: {firstPayload.payload.circle}</div>
							<div>cross: {firstPayload.payload.cross}</div>
						</div>
					</ItemContent>
				</Item>
			)}
		</div>
	);
}

function createCustomTooltip() {
	return (props: TooltipContentProps) => {
		return <CustomTooltip {...props} />;
	};
}

function ModSlots() {
	const slotDistribution = useValue(statistics$.modsBySlot);
	const chartConfig = {
		speed: {
			label: "#",
			color: "lightblue",
		},
		square: {
			label: "Square",
			color: "red",
		},
		arrow: {
			label: "Arrow",
			color: "gold",
		},
		diamond: {
			label: "Diamond",
			color: "cyan",
		},
		triangle: {
			label: "Triangle",
			color: "violet",
		},
		circle: {
			label: "Circle",
			color: "blue",
		},
		cross: {
			label: "Cross",
			color: "green",
		},
	} satisfies ChartConfig;

	return (
		<Card className="w-fit">
			<CardHeader>
				<CardTitle>Mods By Shape</CardTitle>
			</CardHeader>
			<CardContent className="min-h-0">
				<ChartContainer
					config={chartConfig}
					style={{ width: "100%", maxWidth: "480px", minHeight: "300px" }}
				>
					<BarChart<{
						speed: number;
						square: number;
						arrow: number;
						diamond: number;
						triangle: number;
						circle: number;
						cross: number;
					}>
						accessibilityLayer
						barSize={24}
						barCategoryGap={3}
						data={slotDistribution}
						margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
						responsive
					>
						<XAxis<{
							speed: number;
							square: number;
							arrow: number;
							diamond: number;
							triangle: number;
							circle: number;
							cross: number;
						}>
							domain={["dataMin-1", "dataMax+1"]}
							allowDataOverflow={true}
							ticks={[5, 10, 15, 20, 25, 30]}
							type="number"
							dataKey="speed"
							tickLine={false}
							tickMargin={10}
						/>
						<YAxis
							width="auto"
							label={{ value: "#", position: "insideLeft" }}
						/>
						<Bar
							dataKey="square"
							fill="var(--color-square)"
							radius={4}
							stackId={"a"}
						/>
						<Bar
							dataKey="arrow"
							fill="var(--color-arrow)"
							radius={4}
							stackId={"a"}
						/>
						<Bar
							dataKey="diamond"
							fill="var(--color-diamond)"
							radius={4}
							stackId={"a"}
						/>
						<Bar
							dataKey="triangle"
							fill="var(--color-triangle)"
							radius={4}
							stackId={"a"}
						/>
						<Bar
							dataKey="circle"
							fill="var(--color-circle)"
							radius={4}
							stackId={"a"}
						/>
						<Bar
							dataKey="cross"
							fill="var(--color-cross)"
							radius={4}
							stackId={"a"}
							label={{ position: "top" }}
						/>
						<Legend position={"right"} />
						<ChartTooltip content={createCustomTooltip()} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export { ModSlots };
