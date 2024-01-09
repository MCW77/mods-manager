// react
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ThunkDispatch, ThunkResult } from "#/state/reducers/modsOptimizer";

// utils
import formatAllyCode from "#/utils/formatAllyCode";

// modules
import { Data } from '#/state/modules/data';

// components
import { Input } from "#ui/input";


type ComponentProps = {
  setAddMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileAdder = React.memo(
  ({
    setAddMode,
  }: ComponentProps) => {
    const dispatch: ThunkDispatch = useDispatch();
    const [t, i18n] = useTranslation('global-ui');
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFetchFinished, setIsFetchFinished] = useState(false);

    useEffect(
      () => {
        if (isFetchFinished === true) setAddMode(false);
      },
      [isFetchFinished]
    );

    const fetch = (allyCode: string): ThunkResult<Promise<void>> => {
      return async function (dispatch) {
        await dispatch(Data.thunks.refreshPlayerData(allyCode, true, null));
        setIsFetchFinished(true);
//        setAddMode(false);
      };
    }

    return (
      <Input
        type={'text'}
        inputMode={'numeric'}
        placeholder={t('header.ProfileSelectionPlaceholder')}
        size={26}
        ref={inputRef}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Escape') {
            setAddMode(false);
          }
          if (e.key === 'Enter') {
            dispatch(fetch((e.target as HTMLInputElement).value));
          }
          // Don't change the input if the user is trying to select something
          if (window.getSelection() && window.getSelection()!.toString() !== '') {
            return;
          }
          // Don't change the input if the user is hitting the arrow keys
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
            return;
          }

          // Format the input field
          (e.target as HTMLInputElement).value = formatAllyCode((e.target as HTMLInputElement).value);
        }}
      />
    )
  }
);

ProfileAdder.displayName = 'ProfileAdder';

export { ProfileAdder };
