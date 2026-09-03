// state
import { Show, useValue } from "@legendapp/state/react";
import type { ObservableObject } from "@legendapp/state";
import { statistics$ } from "../state/statistics";

// components
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "#ui/item";
import { Tooltip, TooltipContent, TooltipTrigger } from "#ui/tooltip";

interface MissingModsOfSlotProps {
	slot: string;
	missingMods$: ObservableObject<{
		available5Dot: number;
		available6Dot: number;
		missing5Dot: number;
		missing6Dot: number;
		required5Dot: number;
		required6Dot: number;
	}>;
}
function MissingModsOfSlot({ slot, missingMods$ }: MissingModsOfSlotProps) {
	const missingMods = useValue(missingMods$);
	const carryOver = Math.max(
		0,
		missingMods.available6Dot - missingMods.required6Dot,
	);

	return (
		<Item variant={"muted"} className="flex flex-col gap-2">
			<ItemTitle>{slot}:</ItemTitle>
			<ItemContent>
				<ItemGroup className="flex-row">
					<Tooltip>
						<TooltipTrigger>
							<Item variant={"muted"} size={"xs"} className="flex-nowrap">
								<ItemTitle className="text-nowrap">6-dot:</ItemTitle>
								<ItemContent
									className={`text-lg${missingMods$.missing6Dot.peek() > 0 ? " text-red-500" : ""}`}
								>
									{missingMods.missing6Dot}
								</ItemContent>
								<Show if={() => missingMods$.missing6Dot.peek() === 0}>
									<ItemMedia>
										<Check className="h-4 w-4 text-green-500" />
									</ItemMedia>
								</Show>
							</Item>
						</TooltipTrigger>
						<TooltipContent>
							<div className="flex flex-col gap-2">
								<div>Available 6 dot: {missingMods.available6Dot}</div>
								<div>Required 6 dot: {missingMods.required6Dot}</div>
								<div>Missing 6 dot: {missingMods.missing6Dot}</div>
							</div>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<Item variant={"muted"} className="flex-nowrap">
								<ItemTitle className="text-nowrap">5-dot:</ItemTitle>
								<ItemContent
									className={`text-lg${missingMods$.missing5Dot.peek() > 0 ? " text-red-500" : ""}`}
								>
									{missingMods.missing5Dot}
								</ItemContent>
								<Show if={() => missingMods$.missing5Dot.peek() === 0}>
									<ItemMedia>
										<Check className="h-4 w-4 text-green-500" />
									</ItemMedia>
								</Show>
							</Item>
						</TooltipTrigger>
						<TooltipContent>
							<div className="flex flex-col gap-2">
								<div>
									Available 5 dot: {missingMods.available5Dot + carryOver}
								</div>
								<div>Required 5 dot: {missingMods.required5Dot}</div>
								<div>Missing 5 dot: {missingMods.missing5Dot}</div>
							</div>
						</TooltipContent>
					</Tooltip>
				</ItemGroup>
			</ItemContent>
		</Item>
	);
}

function MissingModsOfSlots() {
	return (
		<Card className="w-fit">
			<CardHeader>
				<div>
					<CardTitle>Missing mods 5/6-dot by slot</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-2">
					<div className="flex flex gap-2">
						<MissingModsOfSlot
							slot="square"
							missingMods$={statistics$.missingModsOfSlot.square}
						/>
						<MissingModsOfSlot
							slot="arrow"
							missingMods$={statistics$.missingModsOfSlot.arrow}
						/>
					</div>
					<div className="flex flex gap-2">
						<MissingModsOfSlot
							slot="diamond"
							missingMods$={statistics$.missingModsOfSlot.diamond}
						/>
						<MissingModsOfSlot
							slot="triangle"
							missingMods$={statistics$.missingModsOfSlot.triangle}
						/>
					</div>
					<div className="flex flex gap-2">
						<MissingModsOfSlot
							slot="circle"
							missingMods$={statistics$.missingModsOfSlot.circle}
						/>
						<MissingModsOfSlot
							slot="cross"
							missingMods$={statistics$.missingModsOfSlot.cross}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { MissingModsOfSlots };
