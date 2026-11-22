// react
import type React from "react";
import { useTranslation } from "react-i18next";

// utils
import formatAllycode from "#/utils/formatAllycode";

// state
import { when, type ObservableBoolean } from "@legendapp/state";
import { useObservable } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";
const hotutils$ = stateLoader$.hotutils$;

import { dialog$ } from "#/modules/dialog/state/dialog";
import { settings$ } from "#/modules/settings/state/settings";

// domain
import { refreshPlayerData } from "#/modules/profileFetch/profileFetch";

// components
import { Input } from "#ui/input";

type ComponentProps = {
  isAddingProfile$: ObservableBoolean;
};

const ProfileAdder = ({ isAddingProfile$ }: ComponentProps) => {
  const [t] = useTranslation("global-ui");
  const isFetchFinished$ = useObservable(false);
  isAddingProfile$.onChange(({ value }) => {
    if (value === true) isFetchFinished$.set(false);
  });
  isFetchFinished$.onChange(({ value }) => {
    if (value === true) isAddingProfile$.set(false);
  });

  const fetch = async (allycode: string): Promise<void> => {
    const sessionId = await when(hotutils$.openHotUtilsSignIn());
    if (sessionId === "") {
      dialog$.showFlash(
        <>{t("hotutils.SessionIdNotObtainedTitle")}</>,
        t("hotutils.SessionIdNotObtainedDescription"),
        t("hotutils.Settings"),
        () => {
          settings$.section.set("general");
        },
        "warning",
      );
      isFetchFinished$.set(true);
      return;
    }
    const result = await refreshPlayerData(allycode, true, sessionId === "" ? null : sessionId);
    isFetchFinished$.set(true);
    return result;
  };

  return (
    <Input
      className="w-60"
      type={"text"}
      inputMode={"numeric"}
      placeholder={t("header.ProfileSelectionPlaceholder")}
      size={26}
      onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
          isAddingProfile$.set(false);
        }
        if (e.key === "Enter") {
          void fetch((e.target as HTMLInputElement).value);
        }
        // Don't change the input if the user is trying to select something
        const windowSelection = window.getSelection();
        if (windowSelection?.toString() !== "") {
          return;
        }
        // Don't change the input if the user is hitting the arrow keys
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
          return;
        }

        // Format the input field
        (e.target as HTMLInputElement).value = formatAllycode((e.target as HTMLInputElement).value);
      }}
    />
  );
};

ProfileAdder.displayName = "ProfileAdder";

export default ProfileAdder;
