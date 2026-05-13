// react
import { useTranslation } from "react-i18next";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const modsView$ = stateLoader$.modsView$;

// domain
import { modScorers } from "#/modules/modScores/domain/ModScorer";

// components
import { Label } from "#ui/label";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { Select as ReactiveSelect } from "#/components/reactive/Select";

const ScoreSelector = () => {
	const [t] = useTranslation("explore-ui");

	return (
		<div className={"flex items-center gap-2"}>
			<Label className={"min-w-fit"} htmlFor={"score-select"}>
				{t("filter.ScoreHeadline")}:
			</Label>
			<ReactiveSelect
				$value={modsView$.activeViewSetupInActiveCategory.modScore}
			>
				<SelectTrigger
					className={"w-40 h-4 px-2 mx-2 inline-flex"}
					id={"score-select"}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className={"w-8 min-w-40"} sideOffset={5}>
					{Array.from(modScorers.values()).map((modScorer) => (
						<SelectItem
							className={"w-40"}
							key={modScorer.name}
							title={modScorer.description}
							value={modScorer.name}
						>
							{modScorer.displayName}
						</SelectItem>
					))}
				</SelectContent>
			</ReactiveSelect>
		</div>
	);
};

ScoreSelector.displayName = "ScoreSelector";

export default ScoreSelector;
