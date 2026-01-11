// react
import { useTranslation } from "react-i18next";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const modsView$ = stateLoader$.modsView$;

// components
import FilterWidget from "./FilterWidget";
import ViewSetupManager from "./ViewSetupManager";
import ScoreSelector from "./ScoreSelector";
import SortManager from "./SortManager";

import { Label } from "#ui/label";
import { Switch } from "#/components/reactive/Switch";

function ViewSetupWidget() {
	const [t] = useTranslation("explore-ui");

	return (
		<div
			className={`w-28vw m-l-2 p-2 flex flex-col justify-between items-center gap-4
                  bg-background/30 border-2 border-solid border-border`}
		>
			<div className={"flex flex-col justify-between items-center gap-2"}>
				<ViewSetupManager />
				<div className={"flex justify-between items-center"}>
					<Label htmlFor={"group-mods"}>{t("filter.Group")}: </Label>
					<Switch
						id={"group-mods"}
						$checked={
							modsView$.activeViewSetupInActiveCategory.isGroupingEnabled
						}
					/>
				</div>
				<SortManager />
				<ScoreSelector />
			</div>
			<FilterWidget />
		</div>
	);
}

export default ViewSetupWidget;
