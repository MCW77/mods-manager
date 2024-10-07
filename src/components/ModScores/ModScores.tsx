// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { For, observer, Show, useObservable } from "@legendapp/state/react";
import { modsView$ } from "#/modules/modsView/state/modsView";

// domain
import { modScores } from "../../domain/constants/ModScoresConsts";
import type { Mod } from "../../domain/Mod";

// components
import { Separator } from "#ui/separator";

type ComponentProps = {
	mod: Mod;
};

const ModScores = observer(
	React.memo(({ mod }: ComponentProps) => {
		const [t, i18n] = useTranslation("domain");
		const scoreName = modsView$.activeViewSetupInActiveCategory.modScore.get();
		const secondariesCount$ = useObservable(
			() => mod.secondaryStats.length > 0,
		);
		const secondaryStats$ = useObservable(() => mod.secondaryStats);

		return (
			<div>
				<h4>{t("Score_plural")}</h4>
				<ul className="p-l-0 text-[#c5f5f5]">
					<Show if={secondariesCount$} else={() => <li key={"0"}>None</li>}>
						<For each={secondaryStats$}>
							{(stat) => (
								<li
									key={stat.id.get()}
									className={`class-${stat.score.getClass()}`}
								>
									{stat.score.get().show()}
								</li>
							)}
						</For>
					</Show>
					<Separator
						className={"m-y-1 bg-slate-200 dark:bg-slate-200"}
						decorative
					/>
					<Show if={secondariesCount$} else={() => <li key={"5"}>None</li>}>
						{() => (
							<li key={"5"} className={`class-${mod.getClass()}`}>
								{modScores.find((modScore) => modScore.name === scoreName)
									?.isFlatOrPercentage === "IsFlat"
									? `${mod.scores[scoreName]}`
									: `${Math.floor(mod.scores[scoreName] * 100) / 100}%`}
							</li>
						)}
					</Show>
				</ul>
			</div>
		);
	}),
);

ModScores.displayName = "ModScores";

export { ModScores };
