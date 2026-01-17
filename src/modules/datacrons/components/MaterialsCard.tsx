// utils
import { formatTimespan } from "../utils/formatTimespan";

// react
import { For, useValue } from "@legendapp/state/react";

// state
import { currencies$ } from "#/modules/currencies/state/currencies";
import { datacrons$ } from "../state/datacrons";
import { materials$ } from "#/modules/materials/state/materials";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import DatacronSets from "../DatacronSets.json";

// components
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#ui/card";
import { Label } from "#ui/label";

function RemainingTime({ id }: { id: number }) {
	const remainingTime$ = () =>
		formatTimespan(
			((DatacronSets as Record<string, { expirationTimeMs: number }>)[`${id}`]
				?.expirationTimeMs ?? 0) - profilesManagement$.now.get(),
		);
	const remainingTime = useValue(remainingTime$);
	return <span>expires in {remainingTime}</span>;
}

interface DatacronSetMaterialsProps {
	id: number;
}

function DatacronSetMaterials({ id }: DatacronSetMaterialsProps) {
	const name = datacrons$.availableDatacronSets.get().get(id)?.name || "";
	const reroll1Key = `datacron_set_${id}_reroll_1`;
	const reroll2Key = `datacron_set_${id}_reroll_2`;
	const reroll3Key = `datacron_set_${id}_reroll_3`;
	const upgrade1Key = `datacron_set_${id}_upgrade_1`;
	const upgrade2Key = `datacron_set_${id}_upgrade_2`;
	const upgrade3Key = `datacron_set_${id}_upgrade_3`;
	const upgrade1 = (
		DatacronSets as Record<
			string,
			{ setMaterials: Record<string, { displayName: string; icon: string }> }
		>
	)[`${id}`]?.setMaterials[upgrade1Key];
	const upgrade2 = (
		DatacronSets as Record<
			string,
			{ setMaterials: Record<string, { displayName: string; icon: string }> }
		>
	)[`${id}`]?.setMaterials[upgrade2Key];
	const upgrade3 = (
		DatacronSets as Record<
			string,
			{ setMaterials: Record<string, { displayName: string; icon: string }> }
		>
	)[`${id}`]?.setMaterials[upgrade3Key];
	const reroll1 = (
		DatacronSets as Record<
			string,
			{ setMaterials: Record<string, { displayName: string; icon: string }> }
		>
	)[`${id}`]?.setMaterials[reroll1Key];
	const reroll2 = (
		DatacronSets as Record<
			string,
			{ setMaterials: Record<string, { displayName: string; icon: string }> }
		>
	)[`${id}`]?.setMaterials[reroll2Key];
	const reroll3 = (
		DatacronSets as Record<
			string,
			{ setMaterials: Record<string, { displayName: string; icon: string }> }
		>
	)[`${id}`]?.setMaterials[reroll3Key];
	const upgrade1Quantity = useValue(
		() =>
			materials$.materialByIdForActiveAllycode.get().get(upgrade1Key)
				?.quantity || 0,
	);
	const upgrade2Quantity = useValue(
		() =>
			materials$.materialByIdForActiveAllycode.get().get(upgrade2Key)
				?.quantity || 0,
	);
	const upgrade3Quantity = useValue(
		() =>
			materials$.materialByIdForActiveAllycode.get().get(upgrade3Key)
				?.quantity || 0,
	);
	const reroll1Quantity = useValue(
		() =>
			materials$.materialByIdForActiveAllycode.get().get(reroll1Key)
				?.quantity || 0,
	);
	const reroll2Quantity = useValue(
		() =>
			materials$.materialByIdForActiveAllycode.get().get(reroll2Key)
				?.quantity || 0,
	);
	const reroll3Quantity = useValue(
		() =>
			materials$.materialByIdForActiveAllycode.get().get(reroll3Key)
				?.quantity || 0,
	);

	return (
		<Card className="rounded-none flex-1 min-w-[300px]">
			<CardHeader>
				<CardTitle>
					Set {id}: {name}
				</CardTitle>
				<CardDescription>
					<RemainingTime id={id} />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4">
					<Card className="border-none">
						<CardHeader className="p-0 p-b-2">
							<CardTitle>Upgrade</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="flex flex-col gap-2 whitespace-nowrap">
								<Label>
									{upgrade1?.displayName}: {upgrade1Quantity}
								</Label>
								<Label>
									{upgrade2?.displayName}: {upgrade2Quantity}
								</Label>
								<Label>
									{upgrade3?.displayName}: {upgrade3Quantity}
								</Label>
							</div>
						</CardContent>
					</Card>
					<Card className="border-none">
						<CardHeader className="p-0 p-b-2">
							<CardTitle>Reroll</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="flex flex-col gap-2 whitespace-nowrap">
								<Label>
									{reroll1?.displayName}: {reroll1Quantity}
								</Label>
								<Label>
									{reroll2?.displayName}: {reroll2Quantity}
								</Label>
								<Label>
									{reroll3?.displayName}: {reroll3Quantity}
								</Label>
							</div>
						</CardContent>
					</Card>
				</div>
			</CardContent>
		</Card>
	);
}

interface MaterialsCardProps {
	showInfo: boolean;
}

function MaterialsCard({ showInfo }: MaterialsCardProps) {
	const credits = useValue(
		() =>
			currencies$.currencyByIdForActiveAllycode.get()?.get("40")?.quantity || 0,
	);
	if (!showInfo) return null;
	return (
		<Card className="">
			<CardHeader>
				<CardTitle>Materials</CardTitle>
			</CardHeader>
			<CardContent className="">
				<div className="flex flex-col gap-4">
					<div className="flex border-1 items-center p-2 gap-2">
						Credits:
						<img
							src="/img/tex.icon_currency_datacron.webp"
							alt="credits"
							width="32"
							height="32"
						/>
						{`${(credits / 1000000).toFixed(1)}M/100M`}
					</div>
					<div className="flex flex-wrap gap-4">
						<For
							each={datacrons$.availableDatacronSets}
							item={DatacronSetMaterials}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
export default MaterialsCard;
