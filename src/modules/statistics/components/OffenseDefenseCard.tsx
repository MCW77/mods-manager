// state
import { useValue } from "@legendapp/state/react";
import { statistics$ } from "../state/statistics";

// components
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { Label } from "#ui/label";

function OffenseDefenseCard() {
	const defenseGreaterThan9 = useValue(statistics$.defenseGreaterThan9);
	const defenseGreaterThan14 = useValue(statistics$.defenseGreaterThan14);
	const offenseGreaterThan4 = useValue(statistics$.offenseGreaterThan4);
	const offenseGreaterThan6 = useValue(statistics$.offenseGreaterThan6);

	return (
		<Card className="w-fit">
			<CardHeader>
				<div>
					<CardTitle>Offense 2° / Defense 2°</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex gap-2">
					<div className="flex flex-col gap-2">
						<div className="flex gap-2 items-center">
							<Label htmlFor="offense-greater-than-4">{"Offense >= 4%"}</Label>
							<div className="text-lg font-bold">{offenseGreaterThan4}</div>
						</div>
						<div className="flex gap-2 items-center">
							<Label htmlFor="offense-greater-than-6">{"Offense >= 6%"}</Label>
							<div className="text-lg font-bold">{offenseGreaterThan6}</div>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex gap-2 items-center">
							<Label htmlFor="defense-greater-than-9">{"Defense >= 9%"}</Label>
							<div className="text-lg font-bold">{defenseGreaterThan9}</div>
						</div>
						<div className="flex gap-2 items-center">
							<Label htmlFor="defense-greater-than-14">
								{"Defense >= 14%"}
							</Label>
							<div className="text-lg font-bold">{defenseGreaterThan14}</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { OffenseDefenseCard };
