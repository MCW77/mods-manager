// react
import type React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer, reactive } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";

// domain
import * as ModScoresConsts from "#/domain/constants/ModScoresConsts";

// components
import { Label } from "#ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#ui/select";

const ReactiveSelect = reactive(Select);

const ScoreSelector: React.FC = observer(() => {
  const [t] = useTranslation("explore-ui");

  return (
    <div >
      <Label htmlFor={"score-select"}>{t("filter.ScoreHeadline")}</Label>
      <ReactiveSelect
        $value={modsView$.activeViewSetupInActiveCategory.get().modScore}
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
          {
            ModScoresConsts.modScores.map(modScore =>
              <SelectItem
                className={"w-40"}
                key={modScore.name}
                title={modScore.description}
                value={modScore.name}
              >
                {modScore.displayName}
              </SelectItem>
          )}
        </SelectContent>
      </ReactiveSelect>
    </div>
  );
});

ScoreSelector.displayName = "ScoreSelector";

export { ScoreSelector };
