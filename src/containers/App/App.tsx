// react
import React, { PureComponent, Suspense } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, ConnectedProps } from "react-redux";
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
import type * as UITypes from "../../components/types";

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


class App extends PureComponent<Props> {

  constructor(props: Props) {
    super(props);

    // If an ally code is passed in to the app, then fetch data for that ally code immediately
    const queryParams = new URLSearchParams(document.location.search);

    if (queryParams.has('allyCode')) {
      if (queryParams.has('SessionID') && queryParams.has('NoPull')) {
        props.setHotUtilsSessionId(queryParams.get('allyCode')!, queryParams.get('SessionID')!);
      } else if (queryParams.has('SessionID')) {
        props.refreshPlayerData(queryParams.get('allyCode')!, true, queryParams.get('SessionID'), false);
      } else if (!queryParams.has('NoPull')) {
        props.refreshPlayerData(queryParams.get('allyCode')!, true, null);
      }
    }


    // Remove the query string after reading anything we needed from it.
    window.history.replaceState({}, document.title, document.location.href.split('?')[0]);

    // Check the current version of the app against the API
    props.checkVersion();

//    this.escapeListener = this.escapeListener.bind(this);
  }

  escapeListener = ({key}: React.KeyboardEvent<HTMLDivElement>) => {
    if (key === 'Escape' && this.props.isModalCancelable) {
      this.props.hideModal();
    }
  };
/*
  componentDidMount() {
    document.addEventListener('keyup', this.escapeListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.escapeListener);
  }
*/


  render() {
    const instructionsScreen = this.props.profile === PlayerProfile.Default;

    return <Suspense fallback= "loading">
      <div className={'App'} onKeyPress={this.escapeListener}>
      {this.header(!instructionsScreen)}
      <div className={'app-body'}>
        {!instructionsScreen && 'explore' === this.props.section &&
          <ExploreView />
        }
        {!instructionsScreen && 'optimize' === this.props.section &&
          <OptimizerView />
        }
        {!instructionsScreen && 'settings' === this.props.section &&
          <SettingsView />
        }
        {'help' === this.props.section &&
          <HelpView />
        }
        {'about' === this.props.section &&
          <AboutView />
        }
        <FlashMessage />
        <ErrorModal />
        <Modal show={this.props.displayModal}
          className={this.props.modalClass}
          content={this.props.modalContent}
          cancelable={this.props.isModalCancelable} />
        <Spinner isVisible={this.props.isBusy} />
      </div>
    </div>
    </Suspense>;
  }

  header(showActions: boolean) {

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
              className={'explore' === this.props.section ? 'active' : ''}
              onClick={() => this.props.changeSection('explore')}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} title={this.props.t('header.NavExploreMods')}/>
            </button>
            <button
              className={'optimize' === this.props.section ? 'active' : ''}
              onClick={() => this.props.changeSection('optimize')}
            >
              <FontAwesomeIcon icon={faWrench} title={this.props.t('header.NavOptimizeMods')}/>
            </button>
            <button
              className={'settings' === this.props.section ? 'active' : ''}
              onClick={() => this.props.changeSection('settings')}
            >
              <FontAwesomeIcon icon={faGear} title={this.props.t('header.NavSettings')}/>
            </button>
            <button
              className={'help' === this.props.section ? 'active' : ''}
              onClick={() => this.props.changeSection('help')}
            >
              <FontAwesomeIcon icon={faQuestion} title={this.props.t('header.NavHelp')}/>
            </button>
            <button
              className={'about' === this.props.section ? 'active' : ''}
              onClick={() => this.props.changeSection('about')}
            >
                <FontAwesomeIcon icon={faInfo} title={this.props.t('header.NavAbout')}/>
            </button>
          </nav>
        }
      </div>
    </header>;
  }
}

interface ReduxProps {
  isBusy: boolean,
  displayModal: boolean,
  modalClass: string,
  modalContent: UITypes.DOMContent,
  isModalCancelable: boolean,
  section: UITypes.Sections,
  profile: PlayerProfile
}

type Props = PropsFromRedux & AttributeProps & WithTranslation<'global-ui'>;
type PropsFromRedux = ConnectedProps<typeof connector>;

type AttributeProps = {
}

const mapStateToProps = (state: IAppState) => {
  const appProps: ReduxProps = {
    isBusy: state.isBusy,
    displayModal: !!state.modal,
    modalClass: state?.modal?.class ?? '',
    modalContent: state?.modal?.content ?? '',
    isModalCancelable: state?.modal?.cancelable ?? false,
    section: state.section,
    profile: state.profile ?? PlayerProfile.Default
  };

  return appProps;
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  changeSection: (newSection: UITypes.Sections) => dispatch(AppModule.actions.changeSection(newSection)),
  refreshPlayerData: (allyCode: string, keepOldMods: boolean, sessionId: string | null, useSession = true) =>
    dispatch(Data.thunks.refreshPlayerData(allyCode, keepOldMods,  sessionId, useSession)),
  setHotUtilsSessionId: (allyCode: string, sessionId: string) => dispatch(Data.thunks.setHotUtilsSessionId(allyCode, sessionId)),
  checkVersion: () => dispatch(Data.thunks.checkVersion()),
  showModal: (clazz: string, content: UITypes.DOMContent) => dispatch(AppModule.actions.showModal(clazz, content)),
  hideModal: () => dispatch(AppModule.actions.hideModal()),
});

let connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(withTranslation('global-ui')(App));
