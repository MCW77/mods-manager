// state
import { useValue } from "@legendapp/state/react";
import { statistics$ } from "../state/statistics";

// components
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { Label } from "#ui/label";

function OffenseDefenseCard() {
	const defense9OrGreater = useValue(statistics$.defense9OrGreater);
	const defense14OrGreater = useValue(statistics$.defense14OrGreater);
	const offense4OrGreater = useValue(statistics$.offense4OrGreater);
	const offense6OrGreater = useValue(statistics$.offense6OrGreater);

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
							<div className="text-lg font-bold">{offense4OrGreater}</div>
						</div>
						<div className="flex gap-2 items-center">
							<Label htmlFor="offense-greater-than-6">{"Offense >= 6%"}</Label>
							<div className="text-lg font-bold">{offense6OrGreater}</div>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex gap-2 items-center">
							<Label htmlFor="defense-greater-than-9">{"Defense >= 9%"}</Label>
							<div className="text-lg font-bold">{defense9OrGreater}</div>
						</div>
						<div className="flex gap-2 items-center">
							<Label htmlFor="defense-greater-than-14">
								{"Defense >= 14%"}
							</Label>
							<div className="text-lg font-bold">{defense14OrGreater}</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { OffenseDefenseCard };
