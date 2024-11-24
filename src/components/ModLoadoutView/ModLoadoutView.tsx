// react
import React from "react";

// styles
import "./ModLoadoutView.css";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const optimizationSettings$ = stateLoader$.optimizationSettings$;

// domain
import type * as Character from "#/domain/Character";
import * as ModLoadout from "#/domain/ModLoadout";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";

// components
import { ModImage } from "#/components/ModImage/ModImage";
import { ModStats } from "#/components/ModStats/ModStats";

type ComponentProps = {
	modLoadout: ModLoadout.ModLoadout;
	showAvatars: boolean;
	assignedCharacter?: Character.Character;
	assignedTarget?: OptimizationPlan;
};

const ModLoadoutView = React.memo(
	({
		modLoadout,
		showAvatars = false,
		assignedCharacter,
		assignedTarget,
	}: ComponentProps) => {
		const usedSlots = ModLoadout.getUsedSlots(modLoadout);
		let modDetails = null;
		if (ModLoadout.hasSlots(modLoadout, usedSlots)) {
			modDetails = usedSlots.map((slot) => (
				<div className={`mod ${slot}`} key={modLoadout[slot]?.id}>
					{assignedTarget &&
						optimizationSettings$.shouldLevelMod(
							modLoadout[slot],
							assignedTarget,
						) && <span className={"icon level active"} />}
					{assignedTarget &&
						optimizationSettings$.shouldSliceMod(
							modLoadout[slot],
							assignedTarget,
						) && <span className={"icon slice active"} />}
					<ModImage
						mod={modLoadout[slot]}
						showAvatar={showAvatars}
						className={
							assignedCharacter &&
							modLoadout[slot].characterID === assignedCharacter.id
								? "no-move"
								: ""
						}
					/>
					<ModStats
						mod={modLoadout[slot]}
						showAvatar
						assignedTarget={assignedTarget}
					/>
				</div>
			));
		}
		return <div className={"mod-set-view"}>{modDetails}</div>;
	},
);

ModLoadoutView.displayName = "ModLoadoutView";

export { ModLoadoutView };
