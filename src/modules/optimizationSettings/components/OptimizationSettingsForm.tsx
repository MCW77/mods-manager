// react
import { useId } from "react";
import { useTranslation } from "react-i18next";

// state
import { observer, useValue } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;

// components
import { SingleValueSlider } from "#/components/SingleValueSlider/SingleValueSlider";
import { Input } from "#/components/reactive/Input";
import { Label } from "#ui/label";

const OptimizationSettingsForm: React.FC = observer(() => {
	const [t] = useTranslation("settings-ui");
	const threshold1Id = useId();
	const threshold2Id = useId();
	const lockUnselectedId = useId();
	const forceCompleteSetsId = useId();
	const simulate6EId = useId();
	const simulateLevel15Id = useId();
	const optimizeWithRestrictionsId = useId();
	const allycode = useValue(profilesManagement$.profiles.activeAllycode);
	const modChangeThreshold = useValue(
		optimizationSettings$.settingsByProfile[allycode].modChangeThreshold,
	);

	const globalCSS =
		"grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
	const labelCSS = "grid-col-[labels] grid-row-auto" as const;
	const inputCSS = "grid-col-[controls] grid-row-auto" as const;

	return (
		<div className={globalCSS}>
			<Label className={labelCSS} htmlFor={`threshold2-${threshold2Id}`}>
				{t("optimizer.global.Threshold")}:
			</Label>
			<div className={`${inputCSS} flex gap-2`}>
				<SingleValueSlider
					className={"min-w-[120px]"}
					id={`threshold1-${threshold1Id}`}
					min={0}
					max={100}
					step={1}
					singleValue={modChangeThreshold}
					onSingleChange={(threshold: number) => {
						optimizationSettings$.settingsByProfile[
							allycode
						].modChangeThreshold.set(threshold);
					}}
				/>
				<Input
					className={"w-20"}
					id={`threshold2-${threshold2Id}`}
					min={0}
					max={100}
					type="number"
					$value={
						optimizationSettings$.settingsByProfile[allycode].modChangeThreshold
					}
				/>
			</div>
			<Label
				className={labelCSS}
				htmlFor={`lock-unselected-${lockUnselectedId}`}
			>
				{t("optimizer.global.LockUnselected")}:
			</Label>
			<Input
				className={inputCSS}
				id={`lock-unselected-${lockUnselectedId}`}
				type="checkbox"
				$value={
					optimizationSettings$.settingsByProfile[allycode]
						.lockUnselectedCharacters
				}
			/>
			<Label
				className={labelCSS}
				htmlFor={`force-complete-sets-${forceCompleteSetsId}`}
			>
				{t("optimizer.global.NoModSetsBreak")}:
			</Label>
			<Input
				className={inputCSS}
				id={`force-complete-sets-${forceCompleteSetsId}`}
				type="checkbox"
				$value={
					optimizationSettings$.settingsByProfile[allycode].forceCompleteSets
				}
			/>
			<Label className={labelCSS} htmlFor={`simulate-6e-${simulate6EId}`}>
				{t("optimizer.global.Simulate6E")}
			</Label>
			<Input
				className={inputCSS}
				id={`simulate-6e-${simulate6EId}`}
				type="checkbox"
				$value={
					optimizationSettings$.settingsByProfile[allycode].simulate6EModSlice
				}
			/>
			<Label
				className={labelCSS}
				htmlFor={`simulate-level-15-${simulateLevel15Id}`}
			>
				{t("optimizer.global.SimulateLevel15")}
			</Label>
			<Input
				className={inputCSS}
				id={`simulate-level-15-${simulateLevel15Id}`}
				type="checkbox"
				$value={
					optimizationSettings$.settingsByProfile[allycode].simulateLevel15Mods
				}
			/>
			<Label
				className="p-r-2"
				htmlFor={`optimize-with-restrictions-toggle-${optimizeWithRestrictionsId}`}
			>
				Optimize with primary and set restrictions
			</Label>
			<Input
				className={inputCSS}
				id={`optimize-with-restrictions-toggle-${optimizeWithRestrictionsId}`}
				type="checkbox"
				$value={
					optimizationSettings$.settingsByProfile[allycode]
						.optimizeWithPrimaryAndSetRestrictions
				}
			/>
		</div>
	);
});

OptimizationSettingsForm.displayName = "OptimizationSettingsForm";

export default OptimizationSettingsForm;
