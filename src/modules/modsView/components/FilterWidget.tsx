// react
import type React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// components
import { FilterManager } from "./FilterManager";
import { LevelFilter } from "./Filters/LevelFilter";
import { PrimaryFilter } from "./Filters/PrimaryFilter";
import { RarityFilter } from "./Filters/RarityFilter";
import { SecondaryFilter } from "./Filters/SecondaryFilter";
import { SetFilter } from "./Filters/SetFilter";
import { SlotFilter } from "./Filters/SlotFilter";
import { TierFilter } from "./Filters/TierFilter";
import { Button } from '#ui/button';
import { AssignedFilter } from "./Filters/AssignedFilter";
import { EquippedFilter } from "./Filters/EquippedFilter";

const FilterWidget: React.FC = observer(() => {
  const [t] = useTranslation("explore-ui");
  const profile = profilesManagement$.activeProfile.get();

  return (
    <div className={"flex flex-col justify-between items-center gap-2"}>
      <FilterManager />
      <Button
        size="xs"
        type={'button'}
        onClick={() => modsView$.resetActiveViewSetup()}
      >
        {t('filter.Reset')}
      </Button>
      <div className={"w-full grid grid-cols-[repeat(auto-fit,_minmax(min(6rem,_100%),_1fr))] gap-x-2 gap-y-4"}>
        <SlotFilter />
        <SetFilter />
        <div className="flex flex-col gap-4">
          <LevelFilter />
          <AssignedFilter />
        </div>
        <div className="flex flex-col gap-4">
          <TierFilter />
          <EquippedFilter />
        </div>
        <RarityFilter />
      </div>
      <PrimaryFilter />
      <SecondaryFilter />
    </div>
  );
});

FilterWidget.displayName = "FilterWidget";

export { FilterWidget };
