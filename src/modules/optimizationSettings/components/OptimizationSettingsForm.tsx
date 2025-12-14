// react
import { useId } from "react";
import { useTranslation } from "react-i18next";

// state
import { observer, reactive, useValue } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;

// components
import { SingleValueSlider } from "#/components/SingleValueSlider/SingleValueSlider";
import { Input } from "#ui/input";
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

	const ReactiveInput = reactive(Input);

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
				<ReactiveInput
					className={"w-20"}
					id={`threshold2-${threshold2Id}`}
					min={0}
					max={100}
					type="number"
					$value={
						optimizationSettings$.settingsByProfile[allycode].modChangeThreshold
					}
					onChange={(event) =>
						optimizationSettings$.settingsByProfile[
							allycode
						].modChangeThreshold.set(event.target.valueAsNumber)
					}
				/>
			</div>
			<Label
				className={labelCSS}
				htmlFor={`lock-unselected-${lockUnselectedId}`}
			>
				{t("optimizer.global.LockUnselected")}:
			</Label>
			<ReactiveInput
				className={inputCSS}
				id={`lock-unselected-${lockUnselectedId}`}
				type="checkbox"
				$checked={
					optimizationSettings$.settingsByProfile[allycode]
						.lockUnselectedCharacters
				}
				onChange={(event) =>
					optimizationSettings$.settingsByProfile[
						allycode
					].lockUnselectedCharacters.set(event.target.checked)
				}
			/>
			<Label
				className={labelCSS}
				htmlFor={`force-complete-sets-${forceCompleteSetsId}`}
			>
				{t("optimizer.global.NoModSetsBreak")}:
			</Label>
			<ReactiveInput
				className={inputCSS}
				id={`force-complete-sets-${forceCompleteSetsId}`}
				type="checkbox"
				$checked={
					optimizationSettings$.settingsByProfile[allycode].forceCompleteSets
				}
				onChange={(event) =>
					optimizationSettings$.settingsByProfile[
						allycode
					].forceCompleteSets.set(event.target.checked)
				}
			/>
			<Label className={labelCSS} htmlFor={`simulate-6e-${simulate6EId}`}>
				{t("optimizer.global.Simulate6E")}
			</Label>
			<ReactiveInput
				className={inputCSS}
				id={`simulate-6e-${simulate6EId}`}
				type="checkbox"
				$checked={
					optimizationSettings$.settingsByProfile[allycode].simulate6EModSlice
				}
				onChange={(event) =>
					optimizationSettings$.settingsByProfile[
						allycode
					].simulate6EModSlice.set(event.target.checked)
				}
			/>
			<Label
				className={labelCSS}
				htmlFor={`simulate-level-15-${simulateLevel15Id}`}
			>
				{t("optimizer.global.SimulateLevel15")}
			</Label>
			<ReactiveInput
				className={inputCSS}
				id={`simulate-level-15-${simulateLevel15Id}`}
				type="checkbox"
				$checked={
					optimizationSettings$.settingsByProfile[allycode].simulateLevel15Mods
				}
				onChange={(event) =>
					optimizationSettings$.settingsByProfile[
						allycode
					].simulateLevel15Mods.set(event.target.checked)
				}
			/>
			<Label
				className="p-r-2"
				htmlFor={`optimize-with-restrictions-toggle-${optimizeWithRestrictionsId}`}
			>
				Optimize with primary and set restrictions
			</Label>
			<ReactiveInput
				className={inputCSS}
				id={`optimize-with-restrictions-toggle-${optimizeWithRestrictionsId}`}
				type="checkbox"
				$checked={
					optimizationSettings$.settingsByProfile[allycode]
						.optimizeWithPrimaryAndSetRestrictions
				}
				onChange={(event) =>
					optimizationSettings$.settingsByProfile[
						allycode
					].optimizeWithPrimaryAndSetRestrictions.set(event.target.checked)
				}
			/>
		</div>
	);
});

OptimizationSettingsForm.displayName = "OptimizationSettingsForm";

export default OptimizationSettingsForm;
