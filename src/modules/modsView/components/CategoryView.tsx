// react
import type React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// state
import { observer } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";

// modules
import { Storage } from "#/state/modules/storage";

// hooks
import { useRenderCount } from "#/hooks/useRenderCount";

// domain
import type { CharacterNames } from "#/constants/characterSettings";
import { ModsFilter } from "../domain/ModsFilter";

// components
import { GroupedMods } from "#/modules/modsView/components/GroupedMods";

const CategoryView: React.FC = observer(() => {
  useRenderCount(`CategoryView (${modsView$.activeCategory.peek()})`);
  const [t] = useTranslation("global-ui");
  const profileMods = useSelector(Storage.selectors.selectModsInActiveProfile);
  const activeViewSetupInActiveCategory = structuredClone(modsView$.activeViewSetupInActiveCategory.get());
  activeViewSetupInActiveCategory.filterById.QuickFilter = modsView$.quickFilter.get();
  const modsFilter = new ModsFilter(activeViewSetupInActiveCategory);
  const [filteredMods, modsCount] = modsFilter.applyModsViewOptions(profileMods);

  const mods = [];
  for (const modsInGroup of Object.values(filteredMods)) {
    if (modsInGroup.length > 0) mods.push(modsInGroup);
  }
  const groupedMods = mods.sort((mods1, mods2) => mods1.length - mods2.length);

  return (
    <GroupedMods
      groupedMods={groupedMods}
      assignedMods={{} as Record<string, CharacterNames>}
      allModsCount={profileMods.length}
      displayedModsCount={modsCount}
    />
  );
});

CategoryView.displayName = "CategoryView";

export { CategoryView };
