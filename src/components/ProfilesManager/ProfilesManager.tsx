// react
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// styles
import {
  faArrowsRotate,
  faFire,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// modules
import { App } from '#/state/modules/app';
import { Data } from '#/state/modules/data';
import { Storage } from '#/state/modules/storage';

//components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ProfileAdder } from "#/components/ProfileAdder/ProfileAdder";
import { ProfileSelector } from "#/components/ProfileSelector/ProfileSelector";
import { Button } from "#ui/button";


const ProfilesManager = React.memo(
  () => {
    const dispatch: ThunkDispatch = useDispatch();
    const allyCode = useSelector(Storage.selectors.selectAllycode);
    const profiles = useSelector(Storage.selectors.selectPlayerProfiles);
    const profile = useSelector(Storage.selectors.selectActiveProfile);
    const hotUtilsSubscription = useSelector(Storage.selectors.selectHotUtilsSubscription);
    const [isAddingAProfile, setIsAddingAProfile] = useState(Object.keys(profiles).length === 0)
    const [t, i18n] = useTranslation('global-ui');

    /**
     * Renders a modal stating that pulling unequipped mods using HotUtils will log you out of the game
    */
    const fetchUnequippedModal = () => {
      return <div key={'hotutils-move-mods-modal'}>
        <h2>Fetch your unequipped mods using HotUtils</h2>
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
        <div className={'actions'}>
          <Button
            type={'button'}
            variant={'destructive'}
            className={''}
            onClick={() => dispatch(App.actions.hideModal())}
          >
            Cancel
          </Button>
          <Button
            type={'button'}
            onClick={() => {
              dispatch(App.actions.hideModal());
              dispatch(Data.thunks.refreshPlayerData(
                allyCode,
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
        {allyCode &&
          <>
            <div className="inline align-middle">
              <Button
                className={'m-l-2'}
                type={'button'}
                variant={'outline'}
                size={'icon'}
                onClick={() => {
                  dispatch(Data.thunks.refreshPlayerData(
                    allyCode,
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
                  type={'button'}
                  disabled={!(
                    hotUtilsSubscription &&
                    profile &&
                    profile.hotUtilsSessionId
                  )}
                  onClick={() => {
                    if (hotUtilsSubscription && profile?.hotUtilsSessionId) {
                      dispatch(App.actions.showModal('pull-unequipped-modal', fetchUnequippedModal()))
                    }
                  }}
                >
                  <span className="fa-layers">
                    <FontAwesomeIcon icon={faArrowsRotate} title={`${t('header.FetchHot')}`}/>
                    <FontAwesomeIcon icon={faFire} size="xs" transform="shrink-6 right-8 down-10" color="Red"/>
                  </span>
                </Button>
              }
            </div>
          </>
        }
      </div>
    )
  }
);

ProfilesManager.displayName = 'ProfilesManager';

export { ProfilesManager };
