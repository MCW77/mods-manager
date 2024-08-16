// react
import React from "react";

// styles
import "./ModLoadoutView.css";

// domain
import type * as ModTypes from "#/domain/types/ModTypes";

import type * as Character from "#/domain/Character";
import type { ModLoadout } from "#/domain/ModLoadout";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { ModImage } from "#/components/ModImage/ModImage";
import { ModStats } from "#/components/ModStats/ModStats";

type ComponentProps = {
	modLoadout: ModLoadout;
	showAvatars: boolean;
	assignedCharacter?: Character.Character;
	assignedTarget?: OptimizationPlan.OptimizationPlan;
};

const ModLoadoutView = React.memo(
	({
		modLoadout,
		showAvatars = false,
		assignedCharacter,
		assignedTarget,
	}: ComponentProps) => {
		const modDetails = (Object.keys(modLoadout) as ModTypes.GIMOSlots[])
			.filter((slot) => null !== modLoadout[slot])
			.map((slot) => (
				<div className={`mod ${slot}`} key={modLoadout[slot]!.id}>
					{assignedCharacter &&
						assignedTarget &&
						modLoadout[slot]!.shouldLevel(assignedTarget) && (
							<span className={"icon level active"} />
						)}
					{assignedCharacter &&
						assignedTarget &&
						modLoadout[slot]!.shouldSlice(
							assignedCharacter,
							assignedTarget,
						) && <span className={"icon slice active"} />}
					<ModImage
						mod={modLoadout[slot]!}
						showAvatar={showAvatars}
						className={
							assignedCharacter &&
							modLoadout[slot]!.characterID === assignedCharacter.id
								? "no-move"
								: ""
						}
					/>
					<ModStats
						mod={modLoadout[slot]!}
						showAvatar
						assignedCharacter={assignedCharacter}
						assignedTarget={assignedTarget}
					/>
				</div>
			));

		return <div className={"mod-set-view"}>{modDetails}</div>;
	},
);

ModLoadoutView.displayName = "ModLoadoutView";

export { ModLoadoutView };
