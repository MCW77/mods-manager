// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { observer, reactive, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// components
const FilterWidget = lazy(() => import("./FilterWidget"));
const ViewSetupManager = lazy(() => import("./ViewSetupManager"));
const ScoreSelector = lazy(() => import("./ScoreSelector"));
const SortManager = lazy(() => import("./SortManager"));

import { Label } from "#ui/label";
import { Switch } from "#ui/switch";

const ReactiveSwitch = reactive(Switch);

const ViewSetupWidget: React.FC = observer(() => {
	const [t] = useTranslation("explore-ui");
	const isGroupingEnabled = use$(
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
					<Label htmlFor={"group-mods"}>Group mods: </Label>
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
