// react
import { useTranslation } from "react-i18next";

// state
import { reactive, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const modsView$ = stateLoader$.modsView$;

// domain
import { modScores } from "#/domain/Mod.js";

// components
import { Label } from "#ui/label.jsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select.jsx";

const ReactiveSelect = reactive(Select);

const ScoreSelector = () => {
	const [t] = useTranslation("explore-ui");
	const modScore = use$(modsView$.activeViewSetupInActiveCategory.modScore);

	return (
		<div className={"flex items-center gap-2"}>
			<Label className={"min-w-fit"} htmlFor={"score-select"}>
				{t("filter.ScoreHeadline")}:
			</Label>
			<ReactiveSelect
				$value={() => modScore}
				onValueChange={(value) => {
					modsView$.activeViewSetupInActiveCategory.modScore.set(value);
				}}
			>
				<SelectTrigger
					className={"w-40 h-4 px-2 mx-2 inline-flex"}
					id={"score-select"}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent
					className={"w-8 min-w-40"}
					position={"popper"}
					sideOffset={5}
				>
					{modScores.map((modScore) => (
						<SelectItem
							className={"w-40"}
							key={modScore.name}
							title={modScore.description}
							value={modScore.name}
						>
							{modScore.displayName}
						</SelectItem>
					))}
				</SelectContent>
			</ReactiveSelect>
		</div>
	);
};

ScoreSelector.displayName = "ScoreSelector";

export default ScoreSelector;
