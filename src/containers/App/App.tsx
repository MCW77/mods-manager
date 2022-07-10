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
  faFile,
  faFileImport,
  faFire,
  faGear,
  faInfo,
  faMagnifyingGlass,
  faPowerOff,
  faQuestion,
  faSave,
  faTrashCan,
  faUser,
  faWrench,
} from '@fortawesome/free-solid-svg-icons'

// utils
import { saveAs } from 'file-saver';
import formatAllyCode from "../../utils/formatAllyCode";

// state
import { IAppState } from '../../state/storage';
import { IUserData } from '../../state/storage/Database';

// actions
import {
  changeSection,
  hideModal,
  showError,
  showModal,
} from "../../state/actions/app";

// thunks
import {
  deleteProfile,
  importC3POProfile,
  reset,
  restoreProgress,
} from "../../state/thunks/app";
import {
  checkVersion,
  refreshPlayerData,
  setHotUtilsSessionId,
} from '../../state/thunks/data';
import {
  exportDatabase,
  loadProfile,
} from '../../state/thunks/storage';

// domain
import { PlayerProfile } from '../../domain/PlayerProfile';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type * as UITypes from "../../components/types";

import { Dropdown } from '../../components/Dropdown/Dropdown';
import { FileInput } from "../../components/FileInput/FileInput";
import FlashMessage from "../../components/Modal/FlashMessage";
import Help from '../../components/Help/Help';
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";

// containers
import AboutView from '../AboutView/AboutView';
import ErrorModal from "../ErrorModal/ErrorModal";
import ExploreView from "../ExploreView/ExploreView";
import HelpView from '../HelpView/HelpView';
import OptimizerView from "../OptimizerView/OptimizerView";
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

  /**
   * Read a file as input and pass its contents to another function for processing
   * @param fileInput The uploaded file
   * @param handleResult Function string => *
   */
  readFile(fileInput: Blob, handleResult: (textInFile: string) => void) {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileData: string = event?.target?.result as string ?? '';
        handleResult(fileData);
      } catch (e) {
        this.props.showError((e as Error).message);
      }
    };

    reader.readAsText(fileInput);
  }

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
        <Spinner show={this.props.isBusy} />
      </div>
    </div></Suspense>;
  }

  /**
   * Renders the header for the application, optionally showing navigation buttons and a reset button
   * @param showActions bool If true, render the "Explore" and "Optimize" buttons and the "Reset Mods Optimizer" button
   * @returns JSX Element
   */
  header(showActions: boolean) {

    let allyCodyInput: HTMLInputElement | null;

    return <header className={'App-header'}>
      <img className={'App-title'} src={'../../img/gold-crit-dmg-arrow-mod-cropped.png'}>
      </img>
      <div className="rows">
        <div className={'top-row'}>
          <div className={'actions'}>
            <div>
            <FontAwesomeIcon icon={faUser} title={`${this.props.t('global-ui:header.Fetch')}`}/>
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
            {this.props.allyCode &&
              <button
                type={'button'}
                className={'red'}
                onClick={() => this.props.showModal('', this.deleteAllyCodeModal())}
              >
                <FontAwesomeIcon icon={faTrashCan} title={`${this.props.t('global-ui:header.ProfileDelete')}`}/>
              </button>
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
                  <FontAwesomeIcon icon={faArrowsRotate} title={`${this.props.t('global-ui:header.Fetch')}`}/>
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
                      <FontAwesomeIcon icon={faArrowsRotate} title={`${this.props.t('global-ui:header.FetchHot')}`}/>
                      <FontAwesomeIcon icon={faFire} size="xs" transform="shrink-6 right-8 down-10" color="Red"/>
                    </span>
                  </button>
                }
                <FileInput
                  label={'Import'}
                  icon={faFileImport}
                  handler={(file) => this.readFile(file, this.props.importC3POProfile)}
                />
              </div>
            }
            </div>
          </div>
          <div className="state-actions">
              <FileInput 
                label={this.props.t('global-ui:header.Restore')}
                icon={faFile}
                handler={(file) => this.readFile(file, this.props.restoreProgress)}
              />
              {showActions &&
                <button
                  type={'button'}
                  onClick={() => {
                    this.props.exportDatabase((progressData: IUserData) => {
                      progressData.version = this.props.version;
                      progressData.allyCode = this.props.allyCode;
                      progressData.profiles.forEach(profile => delete profile.hotUtilsSessionId);
                      const progressDataSerialized = JSON.stringify(progressData);
                      const userData = new Blob([progressDataSerialized], { type: 'application/json;charset=utf-8' });
                      saveAs(userData, `modsOptimizer-${(new Date()).toISOString().slice(0, 10)}.json`);
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faSave} title={this.props.t('global-ui:header.Save')}/>
                </button>
              }
              {showActions &&
                <button
                  type={'button'}
                  className={'red'}
                  onClick={() => this.props.showModal('reset-modal', this.resetModal())}
                >
                  <FontAwesomeIcon icon={faPowerOff} title={this.props.t('global-ui:header.Reset')}/>
                </button>
              }
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
   * Renders the "Are you sure?" modal for resetting the app
   * @returns JSX Element
   */
  resetModal() {
    return <div>
      <h2>Reset the mods optimizer?</h2>
      <p>
        If you click "Reset", everything that the application currently has saved - your mods,
        character configuration, selected characters, etc. - will all be deleted.
        Are you sure that's what you want?
      </p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} className={'red'} onClick={() => this.props.reset()}>Reset</button>
      </div>
    </div>;
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
   * Renders the "Are you sure?" modal for deleting an ally code
   */
  deleteAllyCodeModal() {
    return <div>
      <h2>Delete <strong>{formatAllyCode(this.props.allyCode)}</strong>?</h2>
      <p>This will delete the ally code, all of its mods, character selections, and targets from stored data.</p>
      <p>You will be able to restore the character and mod data by fetching with this ally code again.</p>
      <p>Are you sure you want to delete this code?</p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} className={'red'}
          onClick={() => {
            this.props.hideModal();
            this.props.deleteProfile(this.props.allyCode);
          }}>
          Delete
        </button>
      </div>
    </div>;
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
  error: UITypes.DOMContent | null,
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
    error: state.error,
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
  changeSection: (newSection: UITypes.Sections) => dispatch(changeSection(newSection)),
  refreshPlayerData: (allyCode: string, keepOldMods: boolean, sessionId: string | null, useSession = true) =>
    dispatch(refreshPlayerData(allyCode, keepOldMods,  sessionId, useSession)),
  setHotUtilsSessionId: (allyCode: string, sessionId: string) => dispatch(setHotUtilsSessionId(allyCode, sessionId)),    
  checkVersion: () => dispatch(checkVersion()),
  showModal: (clazz: string, content: UITypes.DOMContent) => dispatch(showModal(clazz, content)),
  hideModal: () => dispatch(hideModal()),
  showError: (message: UITypes.DOMContent) => dispatch(showError(message)),
  reset: () => dispatch(reset()),
  importC3POProfile: (profile: string) => dispatch(importC3POProfile(profile)),
  restoreProgress: (progressData: string) => dispatch(restoreProgress(progressData)),
  switchProfile: (allyCode: string) => dispatch(loadProfile(allyCode)),
  deleteProfile: (allyCode: string) => dispatch(deleteProfile(allyCode)),
  exportDatabase: (callback: (ud: IUserData) => void) => dispatch(exportDatabase(callback))
});

let connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(withTranslation('global-ui')(App));
