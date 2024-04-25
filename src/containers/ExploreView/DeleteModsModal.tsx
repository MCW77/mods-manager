// react
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// state
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

import { dialog$ } from "#/modules/dialog/state/dialog";

// modules
import { Storage } from "#/state/modules/storage";

// domain
import type { Mod } from "#/domain/Mod";

// components
import { Button } from "#ui/button";

type ComponentProps = {
  groupedMods: Mod[][];
};

const DeleteModsModal = ({groupedMods}:ComponentProps) => {
  const [t] = useTranslation("explore-ui");
  const dispatch: ThunkDispatch = useDispatch();

  return (
    <div>
      <h2>{t("DeleteButton")}</h2>
      <p>
        {t("DeleteAlt1")}
        <br />
        {t("DeleteAlt2")}
      </p>
      <div className={"actions flex gap-2 justify-center p-t-2"}>
        <Button
          type={"button"}
          onClick={() => {
            dialog$.hide();
          }}
        >
          No
        </Button>
        <Button
          type={"button"}
          variant={"destructive"}
          onClick={() => {
            for (const mods of groupedMods) {
              dispatch(Storage.thunks.deleteMods(mods));
            }
            dialog$.hide();
          }}
        >
          Yes, Delete Mods
        </Button>
      </div>
    </div>
  )
}

DeleteModsModal.displayName = 'DeleteModsModal';

export default DeleteModsModal;