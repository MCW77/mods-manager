// react
import { useMemo } from "react";
import { useSelector } from "react-redux";

// modules
import { Explore } from "#/state/modules/explore";
import { Storage } from "#/state/modules/storage";

// domain
import type { CharacterNames } from "../../constants/characterSettings";
import { ModsFilter } from "../../modules/modExploration/domain/ModsFilter";

import type { Mod } from "../../domain/Mod";

// components
import { FlexSidebar } from "../../components/FlexSidebar/FlexSidebar";
import ModFilter from "../../components/ModFilter/ModFilter";
import { GroupedMods } from "./GroupedMods";

type AssignedMods = {
	[key: string]: CharacterNames;
};

const ExploreView = () => {
  const profile = useSelector(Storage.selectors.selectActiveProfile);
  const modsViewOptions = useSelector(Explore.selectors.selectModsViewOptions);

  let assignedMods: AssignedMods = {};
  let displayedMods: Record<string, Mod[]> = {};
  let modCount = 0;
  let displayedModsCount = 0;

  if (profile) {
    assignedMods =
      profile.modAssignments
        ?.filter((x) => null !== x)
        .reduce((acc, { id: characterID, assignedMods: modIds }) => {
          for (const id of modIds) {
            acc[id] = characterID;
          }
          return acc;
        }, {} as AssignedMods) ?? ({} as AssignedMods);

    const modsFilter = new ModsFilter(modsViewOptions);
    const [mods, shownMods] = modsFilter.applyModsViewOptions(profile.mods);

    displayedMods = mods;
    modCount = profile.mods.length;
    displayedModsCount = shownMods;
  }

  const groupedMods = useMemo(() => {
    const mods = [];
    for (const key in displayedMods) {
      if (displayedMods[key].length > 0)
        mods.push(displayedMods[key]);
    }
    return mods.sort((mods1: Mod[], mods2: Mod[]) => mods1.length - mods2.length);
  }, [displayedMods]);

  return (
    <FlexSidebar
      sidebarContent={sidebar()}
      mainContent={
        <GroupedMods
          groupedMods={groupedMods}
          assignedMods={assignedMods}
          allModsCount={modCount}
          displayedModsCount={displayedModsCount}
        />
      }
    />
  );
};

const sidebar = () => (
  <div className={"w-28vw m-l-2 rounded-lg border-2 border-solid border-slate-200 dark:border-slate-800"} >
    <ModFilter />
  </div>
);

ExploreView.displayName = "ExploreView";

export default ExploreView;
