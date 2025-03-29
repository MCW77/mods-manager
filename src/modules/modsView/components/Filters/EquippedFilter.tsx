// react
import { useTranslation } from "react-i18next";

// state
import { Memo, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const EquippedFilter = () => {
	const [t] = useTranslation("global-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"equipped-filter1"}>
				Equipped
			</Label>
			<div id={"equipped-filter1"} className="flex flex-row gap-2 flex-wrap">
				<Memo>
					{() => {
						const equippedState = use$(() => {
							const activeFilter = modsView$.activeFilter.get();
							return activeFilter.equipped.equipped;
						});
						const value = equippedState || 0;
						const className =
							value === 1
								? "border-inset bg-[#000040]/100"
								: value === -1
									? "border-inset bg-[#400000]/100 border-[#800000]/100 text-red-500"
									: "text-slate-400";

						return (
							<Button
								className={className}
								size="xs"
								variant={"outline"}
								onClick={() => modsView$.cycleState("equipped", "equipped")}
							>
								{"equipped"}
							</Button>
						);
					}}
				</Memo>
			</div>
		</div>
	);
};

EquippedFilter.displayName = "EquippedFilter";

export default EquippedFilter;
