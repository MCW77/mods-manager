// react
import { memo } from "react";
import { useTranslation } from "react-i18next";

// state
import {
	For,
	observer,
	Show,
	use$,
	useObservable,
} from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import { type Mod, modScores } from "#/domain/Mod";

// components
import { Separator } from "#ui/separator";

type ComponentProps = {
	mod: Mod;
};

const ModScores = observer(
	memo(({ mod }: ComponentProps) => {
		const [t, i18n] = useTranslation("domain");
		const scoreName = use$(modsView$.activeViewSetupInActiveCategory.modScore);
		const secondariesCount$ = useObservable(
			() => mod.secondaryStats.length > 0,
		);
		const secondaryStats$ = useObservable(() => mod.secondaryStats);

		return (
			<div>
				<h4>{t("Score_other")}</h4>
				<ul className="p-l-0 text-[#c5f5f5]">
					<Show if={secondariesCount$} else={() => <li key={"0"}>None</li>}>
						<For each={secondaryStats$}>
							{(stat$) => {
								const id = use$(stat$.id);
								const scoreText = use$(() => stat$.score.get().show());

								return (
									<li key={id} className={`class-${stat$.score.getClass()}`}>
										{scoreText}
									</li>
								);
							}}
						</For>
					</Show>
					<Separator className={"m-y-1 border-foreground"} decorative />
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

export default ModScores;
