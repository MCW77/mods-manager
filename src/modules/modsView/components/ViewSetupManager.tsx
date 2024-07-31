// react
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// state
import { For, observer, reactive } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";

// modules
import { Storage } from "#/state/modules/storage";

// components
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { FilterWidget } from "./FilterWidget";

const ReactiveSelect = reactive(Select);

const ViewSetupManager = observer(
	React.memo(() => {
		const dispatch: ThunkDispatch = useDispatch();
		const [t] = useTranslation("global-ui");
		const profile = useSelector(Storage.selectors.selectActiveProfile);
    const activeViewSetupInActiveCategory = modsView$.activeViewSetupInActiveCategory.get();

		return (
      <div className={""}>
        <ReactiveSelect
          $value={modsView$.idOfActiveViewSetupInActiveCategory}
          onValueChange={(value) => {
            modsView$.idOfActiveViewSetupInActiveCategory.set(value);
          }}
        >
          <SelectTrigger
            className={"w-40 h-4 px-2 mx-2 inline-flex"}
            id={"view-setup"}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            className={"w-8 min-w-40"}
            position={"popper"}
            sideOffset={5}
          >
            <For each={modsView$.viewSetupByIdInActiveCategory}>
              {(setup$) => {
                const id = setup$.id.peek();
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
          </SelectContent>
        </ReactiveSelect>
      </div>
		);
	}),
);

ViewSetupManager.displayName = "ViewSetupManager";

export { ViewSetupManager };





