// react
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// modules
import { Storage } from '#/state/modules/storage';

// components
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '#ui/select';


type ComponentProps = {
  setAddMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileSelector = React.memo(
  ({ setAddMode }: ComponentProps) => {
    const dispatch: ThunkDispatch = useDispatch();
    const [t, i18n] = useTranslation('global-ui');
    const profiles = useSelector(Storage.selectors.selectPlayerProfiles);
    const allyCode = useSelector(Storage.selectors.selectAllycode);

    return (
      <Select
        value={allyCode}
        onValueChange={value => {
          if (value === 'new') {
            setAddMode(true);
          } else {
            dispatch(Storage.thunks.loadProfile(value));
          }
        }}
      >
        <SelectTrigger className="w-[180px] accent-blue">
          <SelectValue placeholder={allyCode}/>
        </SelectTrigger>
        <SelectContent className="accent-blue">
          <SelectGroup className="accent-blue">
            {
              Object.entries(profiles)
                .map(([allyCode, playerName]) =>
                  <SelectItem key={allyCode} value={allyCode}>{playerName}</SelectItem>
                )
            }
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup className="accent-blue">
            <SelectItem key="new" value="new">{t('header.ProfileAdderNewCode')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
);

ProfileSelector.displayName = 'ProfileSelector';

export { ProfileSelector };
