// react
import type React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";


// state
import { observer, useObservable } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";

// modules
import { Storage } from "#/state/modules/storage";

// domain
import type { CharacterNames } from "#/constants/characterSettings";
import { ModsFilter } from "../domain/ModsFilter";

// components
import { GroupedMods } from "#/modules/modsView/components/GroupedMods";
import { useRef } from "react";

const CategoryView: React.FC = observer(() => {
  const counter = useRef(0);
  console.log(`CategoryView render: (${modsView$.activeCategory.get()})`, counter.current++);

  const [t] = useTranslation("global-ui");
  const profile = useSelector(Storage.selectors.selectActiveProfile);
  const activeViewSetupInActiveCategory = structuredClone(modsView$.activeViewSetupInActiveCategory.get());
  activeViewSetupInActiveCategory.filterById["*QuickFilter*"] = modsView$.quickFilter.get();
  const modsFilter = new ModsFilter(activeViewSetupInActiveCategory);
  console.log("modsFilter: ");
  console.dir(modsFilter);
  const filterResult = modsFilter.applyModsViewOptions(profile.mods);
  const filteredMods = filterResult[0];
  const mods = [];
  for (const modsInGroup of Object.values(filteredMods)) {
    if (modsInGroup.length > 0) mods.push(modsInGroup);
  }
  const groupedMods = mods.sort((mods1, mods2) => mods1.length - mods2.length);
  console.log("groupedMods: ", groupedMods);

  return (
    <GroupedMods
      groupedMods={groupedMods}
      assignedMods={{} as Record<string, CharacterNames>}
      allModsCount={profile.mods.length}
      displayedModsCount={filterResult[1]}
    />
  );
});

CategoryView.displayName = "CategoryView";

export { CategoryView };


/*
  const modsFilter$ = useObservable(() => {
    console.log("modsFilter$ before: ", modsFilter$.peek());
    const result = new ModsFilter(modsView$.activeViewSetupInActiveCategory.get());
    console.log("modsFilter$ after: ", result);
    return result;
  });
  const filterResult$ = useObservable(() => {
    console.log("filterResult$: ", filterResult$.peek());
    const result = modsFilter$.peek().applyModsViewOptions(profile.mods);
    return result;
  });
  const groupedMods = useObservable(() => {
    const filteredMods = filterResult$.peek()[0];
    const mods = [];
    for (const modsInGroup of Object.values(filteredMods)) {
      if (modsInGroup.length > 0) mods.push(modsInGroup);
    }
    const sortedGroups = mods.sort((mods1, mods2) => mods1.length - mods2.length);
    console.log("groupedMods: ", sortedGroups);
    return sortedGroups;
  })
*/