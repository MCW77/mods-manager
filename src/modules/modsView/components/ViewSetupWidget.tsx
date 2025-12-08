// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { observer, reactive, useValue } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const modsView$ = stateLoader$.modsView$;

// components
const FilterWidget = lazy(() => import("./FilterWidget.jsx"));
const ViewSetupManager = lazy(() => import("./ViewSetupManager.jsx"));
const ScoreSelector = lazy(() => import("./ScoreSelector.jsx"));
const SortManager = lazy(() => import("./SortManager.jsx"));

import { Label } from "#ui/label.jsx";
import { Switch } from "#ui/switch.jsx";

const ReactiveSwitch = reactive(Switch);

const ViewSetupWidget: React.FC = observer(() => {
	const [t] = useTranslation("explore-ui");
	const isGroupingEnabled = useValue(
		modsView$.activeViewSetupInActiveCategory.isGroupingEnabled,
	);

	return (
		<div
			className={`w-28vw m-l-2 p-2 flex flex-col justify-between items-center gap-4
                  bg-background/30 border-2 border-solid border-border`}
		>
			<div className={"flex flex-col justify-between items-center gap-2"}>
				<ViewSetupManager />
				<div className={"flex justify-between items-center"}>
					<Label htmlFor={"group-mods"}>{t("filter.Group")}: </Label>
					<ReactiveSwitch
						id={"group-mods"}
						$checked={() => isGroupingEnabled}
						onCheckedChange={() =>
							modsView$.activeViewSetupInActiveCategory.isGroupingEnabled.toggle()
						}
					/>
				</div>
				<SortManager />
				<ScoreSelector />
			</div>
			<FilterWidget />
		</div>
	);
});

ViewSetupWidget.displayName = "ViewSetupWidget";

export default ViewSetupWidget;
