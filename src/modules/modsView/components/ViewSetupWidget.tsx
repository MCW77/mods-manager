// react
import type React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// state
import { observer, reactive } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";

// modules
import { Storage } from "#/state/modules/storage";

// components
import { FilterWidget } from "./FilterWidget";
import { ViewSetupManager } from "./ViewSetupManager";
import { Label } from "#ui/label";
import { Switch } from "#ui/switch";
import { ScoreSelector } from "./ScoreSelector";
import { SortManager } from "./SortManager";

const ReactiveSwitch = reactive(Switch);

const ViewSetupWidget: React.FC = observer(() => {
  const [t] = useTranslation("explore-ui");
  const profile = useSelector(Storage.selectors.selectActiveProfile);

  return (
    <div className={`w-28vw m-l-2 p-2 flex flex-col justify-between items-center gap-4
                  bg-slate-950/30 border-2 border-solid border-slate-200 dark:border-slate-800`}>
      <div className={"flex flex-col justify-between items-center gap-2"}>
        <ViewSetupManager />
        <div className={"flex justify-between items-center"}>
          <Label htmlFor={"group-mods"}>Group mods: </Label>
          <ReactiveSwitch
            id={"group-mods"}
            $checked={modsView$.activeViewSetupInActiveCategory.get().isGroupingEnabled}
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

export { ViewSetupWidget };
