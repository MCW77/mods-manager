// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { For, observer, reactive } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";

// components
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

const ReactiveSelect = reactive(Select);

const FilterManager = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
    const activeViewSetupInActiveCategory = modsView$.activeViewSetupInActiveCategory.get();


		return (
      <div className={"filters"}>
        <ReactiveSelect
          $value={() => modsView$.idOfSelectedFilterInActiveCategory.get()}
          onValueChange={(value) => {
            modsView$.idOfSelectedFilterInActiveCategory.set(value);
          }}
        >
          <SelectTrigger
            className={"w-40 h-4 px-2 mx-2 inline-flex"}
            id={"selected-filter"}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            className={"w-8 min-w-40"}
            position={"popper"}
            sideOffset={5}
          >
            {

              <For each={modsView$.activeViewSetupInActiveCategory.filterById}>
                {(filter$) => {
                  const id = filter$.id.get();
                  return (
                  <SelectItem
                  className={"w-40"}
                  key={id}
                  value={id}
                >
                  {id}
                </SelectItem>
                )}}
              </For>
            }
            <SelectItem
                className={"w-40"}
                key={"*QuickFilter*"}
                value={"*QuickFilter*"}
              >
                {"QuickEdit"}
              </SelectItem>
          </SelectContent>
        </ReactiveSelect>
      </div>
		);
	}),
);

FilterManager.displayName = "FilterManager";

export { FilterManager };





