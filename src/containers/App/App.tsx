// react
import React, { PureComponent, Suspense } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// styles
import './boilerplate.css';
import './App.css';
import {
  faArrowsRotate,
  faFire,
  faGear,
  faInfo,
  faMagnifyingGlass,
  faQuestion,
  faUser,
  faWrench,
} from '@fortawesome/free-solid-svg-icons'

// utils
import formatAllyCode from "../../utils/formatAllyCode";

// modules
import { App as AppModule } from '../../state/modules/app';
import { Data } from '../../state/modules/data';
import { Storage } from '../../state/modules/storage';

// domain
import { PlayerProfile } from '../../domain/PlayerProfile';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type * as UITypes from "../../components/types";

import { Dropdown } from '../../components/Dropdown/Dropdown';
import { FlashMessage } from "../../components/Modal/FlashMessage";
import { Modal } from "../../components/Modal/Modal";
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

    return <Suspense fallback= "loading"><div className={'App'} onKeyPress={this.escapeListener}>
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
    </div></Suspense>;
  }

  header(showActions: boolean) {

    let allyCodyInput: HTMLInputElement | null;

    return <header className={'App-header'}>
      <img className={'App-title'} src={'../../img/gold-crit-dmg-arrow-mod-cropped.png'}>
      </img>
      <div className="rows">
        <div className={'top-row'}>
          <div className={'actions'}>
            <div>
            <FontAwesomeIcon icon={faUser} title={`${this.props.t('header.Fetch')}`}/>
            {/* If there is no active ally code, then show the regular input field */}
            {!this.props.allyCode &&
              <input
                id={'ally-code'}
                type={'text'}
                inputMode={'numeric'}
                placeholder={this.props.t('header.ProfileSelectionPlaceholder')}
                size={20}
                ref={input => allyCodyInput = input}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    this.props.refreshPlayerData((e.target as HTMLInputElement).value, true, null);
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
            }
            {/* If there is an active ally code, show a dropdown */}
            {this.props.allyCode &&
              <Dropdown
                id={'ally-code'}
                name={'ally-code'}
                value={this.props.allyCode}
                onChange={e => {
                  const selectedAllyCode = (e.target as HTMLSelectElement).value;
                  if (selectedAllyCode === '') {
                    this.props.showModal('', this.addAllyCodeModal());
                  } else {
                    this.props.switchProfile(selectedAllyCode);
                  }
                }}>
                {
                  Object.entries(this.props.playerProfiles)
                    .map(([allyCode, playerName]) =>
                      <option key={allyCode} value={allyCode}>{playerName}</option>
                    )
                }
                <option key={'new'} value={''}>New Code...</option>
              </Dropdown>
            }
            {
              this.props.allyCode &&
              <div className="fetch-actions">
                <button
                  type={'button'}
                  onClick={() => {
                    this.props.refreshPlayerData(
                      this.props.allyCode || (allyCodyInput?.value ?? ''),
                      true,
                      null
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faArrowsRotate} title={`${this.props.t('header.Fetch')}`}/>
                </button>
                {
                  this.props.hotUtilsSubscription &&
                  this.props.profile &&
                  this.props.profile.hotUtilsSessionId &&

                  <button
                    type={'button'}
                    disabled={!(
                      this.props.hotUtilsSubscription &&
                      this.props.profile &&
                      this.props.profile.hotUtilsSessionId
                    )}
                    onClick={() => {
                      if (this.props.hotUtilsSubscription && this.props.profile?.hotUtilsSessionId) {
                        this.props.showModal('pull-unequipped-modal', this.fetchUnequippedModal())
                      }
                    }}
                  >
                    <span className="fa-layers">
                      <FontAwesomeIcon icon={faArrowsRotate} title={`${this.props.t('header.FetchHot')}`}/>
                      <FontAwesomeIcon icon={faFire} size="xs" transform="shrink-6 right-8 down-10" color="Red"/>
                    </span>
                  </button>
                }
              </div>
            }
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

  /**
   * Renders a modal with a form for adding a new ally code
   */
  addAllyCodeModal() {
    let allyCodeInput: HTMLInputElement;

    return <div className={'add-ally-code-form'}>
      <h4>Add a new Ally Code</h4>
      <label htmlFor={'new-ally-code'}>Ally code: </label>
      <input id={'new-ally-code'} type={'text'} inputMode={'numeric'} size={13} ref={input => allyCodeInput = input!}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            this.props.hideModal();
            this.props.refreshPlayerData((e.target as HTMLInputElement).value, false, null);
          }
          // Don't change the input if the user is trying to select something
          const selection = window.getSelection();
          if (selection && selection.toString() !== '') {
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
      <div className={'actions'}>
        <button type={'button'}
          onClick={() => {
            this.props.hideModal();
            this.props.refreshPlayerData(allyCodeInput.value, false, null);
          }}>
          Fetch my data!
        </button>
      </div>
    </div>
  }


  /**
   * Renders a modal stating that pulling unequipped mods using HotUtils will log you out of the game
   */
  fetchUnequippedModal() {
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
        <button type={'button'} className={'red'} onClick={this.props.hideModal}>Cancel</button>
        <button type={'button'} onClick={() => {
          this.props.hideModal();
          this.props.refreshPlayerData(
            this.props.allyCode,
            true,
            this.props.profile?.hotUtilsSessionId ?? null
          );
        }}>
          Fetch my data
        </button>
      </div>
    </div >;
  }

  /**
   * Renders a help description for pulling unequipped mods with HotUtils
   */
  unequippedModsHelp() {
    return <div className={'help'}>
      <p>
        HotUtils is another tool for SWGOH that allows you to directly modify your game account. One of the advantages
        of being a subscriber to HotUtils is that it can pull all of your mod data, including unequipped mods, at any
        time, and without any cooldown period. Normally, your player and mod data can only be updated once every hour.
      </p>
      <p>
        <strong>Use at your own risk!</strong> HotUtils functionality breaks the terms of service for Star Wars:
        Galaxy of Heroes. You assume all risk in using this tool. Grandivory's Mods Optimizer is not associated with
        HotUtils.
      </p>
      <p><a href={'https://www.hotutils.com/'} target={'_blank'} rel={'noopener noreferrer'}>
        https://www.hotutils.com/
      </a></p>
      <p><img className={'fit'} src={'/img/hotsauce512.png'} alt={'hotsauce'} /></p>
    </div>;
  }
}

interface ReduxProps {
  allyCode: string,
  isBusy: boolean,
  displayModal: boolean,
  modalClass: string,
  modalContent: UITypes.DOMContent,
  isModalCancelable: boolean,
  playerProfiles: {
    [key: string]: string
  },
  section: UITypes.Sections,
  version: string,
  hotUtilsSubscription: boolean,
  profile: PlayerProfile
}

type Props = PropsFromRedux & AttributeProps & WithTranslation<'global-ui'>;
type PropsFromRedux = ConnectedProps<typeof connector>;

type AttributeProps = {
}

const mapStateToProps = (state: IAppState) => {
  const appProps: ReduxProps = {
    allyCode: state.allyCode,
    isBusy: state.isBusy,
    displayModal: !!state.modal,
    modalClass: state?.modal?.class ?? '',
    modalContent: state?.modal?.content ?? '',
    isModalCancelable: state?.modal?.cancelable ?? false,
    playerProfiles: state.playerProfiles,
    section: state.section,
    version: state.version,
    hotUtilsSubscription: state.hotUtilsSubscription,
    profile: state.profile ?? PlayerProfile.Default
  };
//  appProps.profile.hotUtilsSessionId = '4157ABCA-5DE5-4374-A8CD-6ED478F52334';

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
  switchProfile: (allyCode: string) => dispatch(Storage.thunks.loadProfile(allyCode)),
});

let connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(withTranslation('global-ui')(App));
