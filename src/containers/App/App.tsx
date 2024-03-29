// react
import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// styles
import './boilerplate.css';
import './App.css';
import {
  faGear,
  faInfo,
  faMagnifyingGlass,
  faQuestion,
  faWrench,
} from '@fortawesome/free-solid-svg-icons'

// modules
import { App as AppModule } from '../../state/modules/app';
import { Data } from '../../state/modules/data';
import { Storage } from '../../state/modules/storage';

// domain
import { PlayerProfile } from '../../domain/PlayerProfile';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FlashMessage } from "../../components/Modal/FlashMessage";
import { Modal } from "../../components/Modal/Modal";
import { ProfilesManager } from '../../components/ProfilesManager/ProfilesManager';
import { Spinner } from "../../components/Spinner/Spinner";

// containers
import { AboutView } from '../AboutView/AboutView';
import { ErrorModal } from "../ErrorModal/ErrorModal";
import ExploreView from "../ExploreView/ExploreView";
import { HelpView } from '../HelpView/HelpView';
import { OptimizerView } from '../OptimizerView/OptimizerView';
import { SettingsView } from '../SettingsView/SettingsView';



const App = React.memo(
  () => {
    const dispatch: ThunkDispatch = useDispatch();
    const [t, i18n] = useTranslation('global-ui');
    const isBusy= useSelector(AppModule.selectors.selectIsBusy);
    const displayModal = useSelector(AppModule.selectors.selectIsModalVisible);
    const modalClass = useSelector(AppModule.selectors.selectModalClasses);
    const modalContent = useSelector(AppModule.selectors.selectModalContent);
    const isModalCancelable = useSelector(AppModule.selectors.selectIsModalCancelable);
    const section = useSelector(AppModule.selectors.selectSection);
    const profile = useSelector(Storage.selectors.selectActiveProfile);

    const instructionsScreen = profile === PlayerProfile.Default;

    const handleEscape = ({key}: React.KeyboardEvent<HTMLDivElement>) => {
      if (key === 'Escape' && isModalCancelable) {
        dispatch(AppModule.actions.hideModal());
      }
    };

    const header = (showActions: boolean) => {

      return <header className={'App-header'}>
        <img className={'App-title'} src={'../../img/gold-crit-dmg-arrow-mod-cropped.png'}>
        </img>
        <div className="rows">
          <div className={'top-row'}>
            <div className={'m-auto'}>
              <div>
                <ProfilesManager />
              </div>
            </div>
          </div>
          {showActions &&
            <nav>
              <button
                className={'explore' === section ? 'active' : ''}
                onClick={() => dispatch(AppModule.actions.changeSection('explore'))}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} title={t('header.NavExploreMods')}/>
              </button>
              <button
                className={'optimize' === section ? 'active' : ''}
                onClick={() => dispatch(AppModule.actions.changeSection('optimize'))}
              >
                <FontAwesomeIcon icon={faWrench} title={t('header.NavOptimizeMods')}/>
              </button>
              <button
                className={'settings' === section ? 'active' : ''}
                onClick={() => dispatch(AppModule.actions.changeSection('settings'))}
              >
                <FontAwesomeIcon icon={faGear} title={t('header.NavSettings')}/>
              </button>
              <button
                className={'help' === section ? 'active' : ''}
                onClick={() => dispatch(AppModule.actions.changeSection('help'))}
              >
                <FontAwesomeIcon icon={faQuestion} title={t('header.NavHelp')}/>
              </button>
              <button
                className={'about' === section ? 'active' : ''}
                onClick={() => dispatch(AppModule.actions.changeSection('about'))}
              >
                  <FontAwesomeIcon icon={faInfo} title={t('header.NavAbout')}/>
              </button>
            </nav>
          }
        </div>
      </header>;
    }

    console.log('rendering APP');

    useEffect(
      () => {
        const queryParams = new URLSearchParams(document.location.search);

        if (queryParams.has('allyCode')) {
          const allycode = queryParams.get('allyCode')!;

          if (queryParams.has('SessionID')) {
            const sessionId = queryParams.get('SessionID')!
            if (queryParams.has('NoPull')) {
              dispatch(Data.thunks.setHotUtilsSessionId(allycode, sessionId));
            } else {
              dispatch(Data.thunks.refreshPlayerData(allycode, true, sessionId, false));
            }
          } else if (!queryParams.has('NoPull')) {
            dispatch(Data.thunks.refreshPlayerData(allycode, true, null));
          }
        }

        // Remove the query string after reading anything we needed from it.
        window.history.replaceState({}, document.title, document.location.href.split('?')[0]);

        // Check the current version of the app against the API
        dispatch(Data.thunks.checkVersion());
      },
      [],
    );

    return (
      <Suspense fallback={<Spinner isVisible={true}/>}>
        <div className={'App'} onKeyDown={handleEscape}>
          {header(!instructionsScreen)}
          <div className={'app-body'}>
            {!instructionsScreen && 'explore' === section &&
              <ExploreView />
            }
            {!instructionsScreen && 'optimize' === section &&
              <OptimizerView />
            }
            {!instructionsScreen && 'settings' === section &&
              <SettingsView />
            }
            {'help' === section &&
              <HelpView />
            }
            {'about' === section &&
              <AboutView />
            }
            <FlashMessage />
            <ErrorModal />
            <Modal show={displayModal}
              className={modalClass}
              content={modalContent}
              cancelable={isModalCancelable} />
            <Spinner isVisible={isBusy} />
          </div>
        </div>
      </Suspense>
    );
  }
);

App.displayName = 'App';

export { App };
