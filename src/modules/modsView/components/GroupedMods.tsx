// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { reactive } from "@legendapp/state/react";
import { beginBatch, endBatch, observable } from "@legendapp/state";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

import type { Mod } from "#/domain/Mod";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAnglesUp, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import * as Collapsible from "@radix-ui/react-collapsible";

import { ModDetail } from "#/components/ModDetail/ModDetail";
import { RenderIfVisible } from "#/components/RenderIfVisible/RenderIfVisible";
import { Button } from "#ui/button";
import DeleteModsModal from "./DeleteModsModal";

interface GroupedModsProps {
  allModsCount: number;
  assignedMods: AssignedMods;
  displayedModsCount: number;
  groupedMods: Mod[][];
}

type AssignedMods = Record<string, CharacterNames>;

const ReactiveCollapsible = reactive(Collapsible.Root);

const GroupedMods = ({ groupedMods, assignedMods, allModsCount, displayedModsCount }: GroupedModsProps) => {
  const [t] = useTranslation("explore-ui");
  const [tDomain] = useTranslation("domain");
  const characterById = profilesManagement$.activeProfile.characterById.get();

  const modGroupsElement = React.createRef<HTMLDivElement>();

  type ModGroup = {
    isOpen: boolean;
    key: string;
    mods: Mod[];
  };
  const modGroups: ModGroup[] = [];
  for (const modGroup of groupedMods) {
    modGroups.push({
      isOpen: true,
      key: `${modGroup[0].slot}-${modGroup[0].set}-${modGroup[0].primaryStat.getDisplayType()}`,
      mods: modGroup,
    });
  }
  type ObservableModGroups = {
    modGroups: ModGroup[];
    closeAll: () => void;
    openAll: () => void;
  };

  const modGroups$ = observable<ObservableModGroups>({
    modGroups: modGroups,
    closeAll: () => {
      beginBatch()
      // biome-ignore lint/complexity/noForEach: <explanation>
      modGroups$.modGroups.forEach((group) => {
        group.isOpen.set(false);
      });
      endBatch();
    },
    openAll: () => {
      beginBatch()
      // biome-ignore lint/complexity/noForEach: <explanation>
      modGroups$.modGroups.forEach((group) => {
        group.isOpen.set(true);
      });
      endBatch();
    },
  });


  const modElements = (mods: Mod[]) => {
    return mods.map((mod) => {
      const assignedCharacter = assignedMods[mod.id]
        ? characterById[assignedMods[mod.id]]
        : null;
      return (
        <RenderIfVisible
          className={"w-[21em]"}
          defaultHeight={278}
          key={`RIV-${mod.id}`}
          visibleOffset={4000}
          root={modGroupsElement}
        >
          <ModDetail
            mod={mod}
            assignedCharacter={assignedCharacter}
            showAssigned
          />
        </RenderIfVisible>
      );
    });
  };

  return (
    <div className="flex flex-col grow-1">
      <div className="flex justify-between">
        <div className="flex gap-2 p-l-2 items-center text-sm align-middle">
          {t("ModsShown", {
            actual: displayedModsCount,
            max: allModsCount,
          })}
          &nbsp;
          <Button
            type={"button"}
            size={"sm"}
            variant={"destructive"}
            onClick={() => {
              dialog$.show(<DeleteModsModal groupedMods={groupedMods} />);
            }}
          >
            <FontAwesomeIcon
              icon={faTrashCan}
              title={t("DeleteButton")}
            />
          </Button>
        </div>
        <div className="flex gap-2 justify-center items-center p-t-2 p-r-6">
          <Button
            size={"sm"}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              modGroups$.openAll();
            }}
          >
            <FontAwesomeIcon
              icon={faAnglesDown}
              title={t("Expand")}
            />
          </Button>
          <Button
            size={"sm"}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              modGroups$.closeAll();
            }}
          >
            <FontAwesomeIcon
              icon={faAnglesUp}
              title={t("Collapse")}
            />
          </Button>
        </div>
      </div>
      <div className={"flex"}>
        <span className="basis-20%">
          {tDomain("Slot")}:{" "}
        </span>
        <span className="basis-30%">
          {tDomain("Set")}:{" "}
        </span>
        <span className="basis-30%">
          {tDomain("Primary")}:{" "}
        </span>
        <span className="basis-20%">
          {"#"}
        </span>
      </div>
      <div
        className="flex flex-col overflow-y-auto overscroll-y-contain grow-1"
        ref={modGroupsElement}
      >

        {

          modGroups$.modGroups.map((modGroup) => {
          return (
            <ReactiveCollapsible
              key={`modgroup-${modGroup.key.get()}` }
              $open={modGroup.isOpen}
              onOpenChange={(isOpen) => {
                modGroup.isOpen.set(isOpen);
              }}
            >
              <Collapsible.Trigger className="flex hover:cursor-pointer" asChild>
                <div>
                  <span className="basis-20%">
                    {tDomain(`slots.name.${modGroup.mods[0].slot.get()}`)}
                  </span>
                  <span className="basis-30%">
                    {tDomain(`stats.${modGroup.mods[0].get().set}`)}
                  </span>
                  <span className="basis-30%">
                    {tDomain(
                      `stats.${modGroup.mods[0].primaryStat.get().getDisplayType()}`
                    )}
                  </span>
                  <span className="basis-20%">
                    ({tDomain("ModWithCount", { count: modGroup.get().mods.length })})
                  </span>
                </div>
              </Collapsible.Trigger>
              <Collapsible.Content className="flex flex-row flex-wrap justify-evenly gap-y-4 p-y-2 text-center">
                {modElements(modGroup.mods.get())}
              </Collapsible.Content>
            </ReactiveCollapsible>
          );
		    })}
      </div>
    </div>

  );
}

GroupedMods.displayName = "GroupedMods";

export { GroupedMods }