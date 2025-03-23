// react
import { useTranslation } from "react-i18next";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import type { TriStateFilterKeys } from "../domain/ModsViewOptions";

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#ui/tooltip";

type SetAllButtonGroupProps = {
	filterKey: TriStateFilterKeys;
};

const SetAllButtonGroup = ({ filterKey }: SetAllButtonGroupProps) => {
	const [t] = useTranslation("explore-ui");

	return (
		<div className={"actions flex gap-1 justify-center items-center"}>
			<Label>All: </Label>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="xxs"
							onClick={() => modsView$.massSetFilter(filterKey, 1)}
						>
							+
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Set all to must be</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="xxs"
							onClick={() => modsView$.massSetFilter(filterKey, 0)}
						>
							o
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Set all to no filter</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="xxs"
							onClick={() => modsView$.massSetFilter(filterKey, -1)}
						>
							-
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Set all to cannot be</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

SetAllButtonGroup.displayName = "SetAllButtonGroup";

export default SetAllButtonGroup;
