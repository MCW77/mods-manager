// react
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { observer } from "@legendapp/state/react";

// styles
import {
  faArrowsRotate,
  faFire,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// state
import { dialog$ } from "#/modules/dialog/state/dialog";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// modules
import { Data } from '#/state/modules/data';
import { Storage } from '#/state/modules/storage';

//components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ProfileAdder } from "#/components/ProfileAdder/ProfileAdder";
import { ProfileSelector } from "#/components/ProfileSelector/ProfileSelector";
import { Button } from "#ui/button";

const ProfilesManager = observer(React.memo(
  () => {
    const dispatch: ThunkDispatch = useDispatch();
    const allycode = profilesManagement$.profiles.activeAllycode.get();
    const profiles = profilesManagement$.profiles.playernameByAllycode.get();
    const profile = useSelector(Storage.selectors.selectActiveProfile);
    const hotUtilsSubscription = useSelector(Storage.selectors.selectHotUtilsSubscription);
    const [isAddingAProfile, setIsAddingAProfile] = useState(Object.keys(profiles).length === 0)
    const [t, i18n] = useTranslation('global-ui');

    /**
     * Renders a modal stating that pulling unequipped mods using HotUtils will log you out of the game
    */
    const fetchUnequippedModal = () => {
      return <div className={'max-w-[40rem] prose dark:prose-invert'}>
        <h1>Fetch your unequipped mods using HotUtils</h1>
        <p>
          This will fetch all of your player data, including unequipped mods by using HotUtils.
          Please note that <strong className={'gold'}>
            this action will log you out of Galaxy of Heroes if you are currently logged in
          </strong>.
        </p>
        <p>
          <strong>Use at your own risk!</strong> HotUtils functionality breaks the terms of service for Star Wars:
          Galaxy of Heroes. You assume all risk in using this tool. Grandivory's Mods Optimizer is not associated with
          HotUtils.
        </p>
        <div className={'actions flex gap-2 justify-center'}>
          <Button
            type={'button'}
            variant={'destructive'}
            className={''}
            onClick={() => dialog$.hide()}
          >
            Cancel
          </Button>
          <Button
            type={'button'}
            onClick={() => {
              dialog$.hide();
              dispatch(Data.thunks.refreshPlayerData(
                allycode,
                true,
                profile?.hotUtilsSessionId ?? null
              ));
            }}
          >
            Fetch my data
          </Button>
        </div>
      </div >;
    }

    return (
      <div className="flex items-center">
        <FontAwesomeIcon icon={faUser} className="m-r-1"/>
        {
          isAddingAProfile ?
            <ProfileAdder setAddMode={setIsAddingAProfile} />
          :
            <ProfileSelector setAddMode={setIsAddingAProfile} />
        }
        {allycode &&
          <>
            <div className="inline align-middle">
              <Button
                className={'m-l-2'}
                type={'button'}
                variant={'outline'}
                size={'icon'}
                onClick={() => {
                  dispatch(Data.thunks.refreshPlayerData(
                    allycode,
                    true,
                    null
                  ));
                }}
              >
                <FontAwesomeIcon icon={faArrowsRotate} title={`${t('header.Fetch')}`}/>
              </Button>
              {
                hotUtilsSubscription &&
                profile &&
                profile.hotUtilsSessionId &&

                <Button
                  size={'icon'}
                  type={'button'}
                  variant={'outline'}
                  disabled={!(
                    hotUtilsSubscription &&
                    profile &&
                    profile.hotUtilsSessionId
                  )}
                  onClick={() => {
                    if (hotUtilsSubscription && profile?.hotUtilsSessionId) {
                      dialog$.show(fetchUnequippedModal());
                    }
                  }}
                >
                  <span className="fa-layers">
                    <FontAwesomeIcon icon={faArrowsRotate} title={`${t('header.FetchHot')}`}/>
                    <FontAwesomeIcon icon={faFire} size="sm" transform="shrink-1 right-14 down-15" color="Red"/>
                  </span>
                </Button>
              }
            </div>
          </>
        }
      </div>
    )
  }
));

ProfilesManager.displayName = 'ProfilesManager';

export { ProfilesManager };
