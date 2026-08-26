// state
import { useObservable, useValue } from "@legendapp/state/react";
import { statistics$ } from "../state/statistics";

// components
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	type TooltipContentProps,
	ReferenceLine,
} from "recharts";
import { Switch } from "#/components/reactive/Switch";
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip } from "#ui/charts";
import { Item, ItemContent, ItemTitle } from "#ui/item";
import { Label } from "#ui/label";

const CustomTooltip = ({
	active,
	payload,
	label,
	isUsingAccumulatedDistribution,
}: TooltipContentProps & { isUsingAccumulatedDistribution: boolean }) => {
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
						<ItemTitle>{`Speed ${label}${isUsingAccumulatedDistribution ? "+" : ""}`}</ItemTitle>
						<div className="flex flex-col">
							<div># 5-dot mods: {firstPayload.payload.count5Dot}</div>
							<div># 6-dot mods: {firstPayload.payload.count6Dot}</div>
							<div>
								# combined:{" "}
								{firstPayload.payload.count5Dot +
									firstPayload.payload.count6Dot}
							</div>
						</div>
					</ItemContent>
				</Item>
			)}
		</div>
	);
};

function createCustomTooltip(isUsingFullDistribution: boolean) {
	return (props: TooltipContentProps) => {
		return (
			<CustomTooltip
				{...props}
				isUsingAccumulatedDistribution={isUsingFullDistribution}
			/>
		);
	};
}

function SpeedCard() {
	const isUsingAccumulatedDistribution$ = useObservable(true);
	const isUsingAccumulatedDistribution = useValue(
		isUsingAccumulatedDistribution$,
	);
	const speedDistribution = useValue(() => {
		const isUsingAccumulatedDistribution =
			isUsingAccumulatedDistribution$.get();
		return isUsingAccumulatedDistribution
			? statistics$.speedDistributionAccumulated.get()
			: statistics$.speedDistributionFull.get();
	});
	const averageSpeed = useValue(statistics$.averageSpeed);
	const chartConfigAccumulated = {
		count: {
			label: "#",
			color: "lightblue",
		},
		count5Dot: {
			label: "#",
			color: "grey",
		},
		count6Dot: {
			label: "#",
			color: "gold",
		},
	} satisfies ChartConfig;

	const chartConfigFull = {
		count5Dot: {
			label: "#",
			color: "grey",
		},
		count6Dot: {
			label: "#",
			color: "gold",
		},
		speed: {
			label: "Speed",
			color: "red",
		},
	} satisfies ChartConfig;

	return (
		<Card className="w-fit">
			<CardHeader className="flex flex-col items-stretch justify-between sm:flex-row">
				<div>
					<CardTitle>Speed 2°</CardTitle>
				</div>
				<div className="flex">
					<Label htmlFor="speed-distribution-switch" className="mr-2">
						Show accumulated speeds
					</Label>
					<Switch
						id="speed-distribution-switch"
						$checked={isUsingAccumulatedDistribution$}
					/>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={
						isUsingAccumulatedDistribution
							? chartConfigAccumulated
							: chartConfigFull
					}
					className="min-h-[200px] w-100"
				>
					<BarChart<{ speed: number; count5Dot: number; count6Dot: number }>
						accessibilityLayer
						barSize={24}
						barCategoryGap={"20px"}
						data={speedDistribution}
						margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
						responsive
					>
						<XAxis<{ speed: number; count5Dot: number; count6Dot: number }>
							domain={["dataMin-1", "dataMax+1"]}
							allowDataOverflow={true}
							ticks={
								isUsingAccumulatedDistribution
									? [10, 15, 20, 25]
									: [5, 10, 15, 20, 25, 30]
							}
							type="number"
							dataKey="speed"
							tickLine={false}
							tickMargin={10}
							tickFormatter={(value) => {
								return isUsingAccumulatedDistribution
									? `${value}+`
									: `${value}`;
							}}
						/>
						<YAxis
							width="auto"
							label={{ value: "#", position: "insideLeft" }}
						/>
						<ChartTooltip
							content={createCustomTooltip(isUsingAccumulatedDistribution)}
						/>
						<Bar
							dataKey="count5Dot"
							fill="var(--color-count5Dot)"
							radius={4}
							stackId={"a"}
						/>
						<Bar
							dataKey="count6Dot"
							fill="var(--color-count6Dot)"
							radius={4}
							stackId={"a"}
							label={{ position: "top" }}
						/>
						<ReferenceLine
							x={averageSpeed}
							strokeWidth={1.5}
							strokeOpacity={0.65}
							label={{
								value: "Average speed 2°",
								fill: "green",
								position: "top",
							}}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export { SpeedCard };
