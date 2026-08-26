// state
import { useValue } from "@legendapp/state/react";
import { statistics$ } from "../state/statistics";
import { ui$ } from "#/modules/ui/state/ui";

// components

import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { Label } from "#ui/label";

function ModQualityCard() {
	const modQualityDSR = useValue(statistics$.modQualityDSR);
	const modQualityHU = useValue(statistics$.modQualityHU);
	const squadGP = useValue(statistics$.squadGP);
	const squadGPFormatted = useValue(() =>
		Intl.NumberFormat(ui$.language.get()).format(squadGP),
	);

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-col items-stretch justify-between sm:flex-row">
				<div>
					<CardTitle>Mod Quality</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col justify-center">
					<div className="flex gap-2 items-center">
						<Label htmlFor="mod-quality-dsr">{"DSR:"}</Label>
						<div id="mod-quality-dsr" className="text-lg font-bold">
							{modQualityDSR.toFixed(2)}
						</div>
					</div>
					<div className="flex gap-2 items-center">
						<Label htmlFor="mod-quality-hu">{"HU:"}</Label>
						<div id="mod-quality-hu" className="text-lg font-bold">
							{modQualityHU.toFixed(2)}
						</div>
					</div>
					<div className="flex gap-2 items-center">
						<Label htmlFor="mod-quality-squad-gp">{"Squad GP:"}</Label>
						<div id="mod-quality-squad-gp">{squadGPFormatted}</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { ModQualityCard };
