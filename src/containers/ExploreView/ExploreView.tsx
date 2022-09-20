// react
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// styles
import {
  faAnglesDown,
  faAnglesUp,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import './ExploreView.css';

// utils
import { forEach } from 'lodash-es';

// state
import { IAppState } from '../../state/storage';

// actions
import {
  hideModal,
  showModal,
} from '../../state/actions/app';

// thunks
import {
  deleteMods,
} from '../../state/thunks/storage';

// domain
import { CharacterNames } from '../../constants/characterSettings';
import { ModsFilter } from '../../modules/modExploration/domain/ModsFilter';

import { Characters } from '../../domain/Character';
import { Mod } from '../../domain/Mod';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DOMContent } from '../../components/types';

import { FlexSidebar } from '../../components/FlexSidebar/FlexSidebar';
import { ModDetail } from '../../components/ModDetail/ModDetail';
import ModFilter from '../../components/ModFilter/ModFilter';
import { RenderIfVisible } from '../../components/RenderIfVisible/RenderIfVisible';


type AssignedMods = {
  [key: string]: CharacterNames
}

class ExploreView extends React.PureComponent<Props> {
  modGroupToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cl = (e.currentTarget as HTMLDivElement).nextElementSibling
      ?.classList;
    if (cl) {
      cl.toggle("collapsed");
    }
  };

  render() {
    const modsElement = React.createRef<HTMLDivElement>();
    const modGroupsElement = React.createRef<HTMLDivElement>();

    const modElements = (mods: Mod[]) => {
      return mods.map((mod) => {
        const assignedCharacter = this.props.assignedMods[mod.id]
          ? this.props.characters[this.props.assignedMods[mod.id]]
          : null;
        return (
          <RenderIfVisible
            defaultHeight={278}
            key={`RIV-${mod.id}`}
            visibleOffset={4000}
            root={modGroupsElement}
          >
            <ModDetail
              mod={mod}
              assignedCharacter={assignedCharacter}
              showAssigned
            />
          </RenderIfVisible>
        );
      });
    };

    let groupedMods = [];
    for (let key in this.props.displayedMods) {
      if (this.props.displayedMods[key].length > 0)
      groupedMods.push(this.props.displayedMods[key]);
    }
    groupedMods = groupedMods.sort(
      (mods1: Mod[], mods2: Mod[]) => mods1.length - mods2.length
    );

    const modGroups = groupedMods.map((mods: Mod[]) => {
      return (
        <div className="modgroup" key={`modgroup-${mods[0].slot}-${mods[0].set}-${mods[0].primaryStat.getDisplayType()}`}>
          <div className="modgroupheader" onClick={this.modGroupToggle}>
            <span>{this.props.t(`domain:Slot`)}: {this.props.t(`domain:slots.name.${mods[0].slot}`)}</span>
            <span>{this.props.t(`domain:Set`)}: {this.props.t(`domain:stats.${mods[0].set}`)}</span>
            <span>{this.props.t(`domain:Primary`)}: {this.props.t(`domain:stats.${mods[0].primaryStat.getDisplayType()}`)}</span>
            <span> ({this.props.t(`domain:ModWithCount`, {count: mods.length})})</span>
          </div>
          <div className="modgroupmods">{modElements(mods)}</div>
        </div>
      );
    });

    return (
      <FlexSidebar
        sidebarContent={ExploreView.sidebar()}
        mainContent={
          <div
            id="mods"
            key={"mods"}
            ref={modsElement}
          >
            <div id="modsheader">
              <div>
                {this.props.t(`explore-ui:ModsShown`, {'actual': this.props.displayedModsCount, 'max': this.props.modCount})}
                &nbsp;
                <button
                  className={"small red"}
                  onClick={() => {
                    this.props.showModal(this.deleteModsModal());
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} title={this.props.t(`explore-ui:DeleteButton`)}/>
                </button>
              </div>
              <div id="modgroupsactions">
                <button
                  className="small"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    forEach(
                      modsElement.current?.getElementsByClassName("modgroupmods"),
                      (modgroup) => {
                        modgroup.classList.remove("collapsed");
                      }
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faAnglesDown} title={this.props.t('explore-ui:Expand')}/>
                </button>
                <button
                  className="small"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    forEach(
                      modsElement.current?.getElementsByClassName("modgroupmods"),
                      (modgroup) => {
                        modgroup.classList.add("collapsed");
                      }
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faAnglesUp} title={this.props.t('explore-ui:Collapse')}/>
                </button>
              </div>
            </div>
            <div id="modgroups" ref={modGroupsElement}>{modGroups}</div>
          </div>
        }
      />
    );
  }

  /**
   * Render the "Are you sure?" modal for deleting all displayed mods
   * @returns {*}
   */
  deleteModsModal() {
    return (
      <div>
        <h2>{this.props.t(`explore-ui:DeleteButton`)}</h2>
        <p>
          {this.props.t(`explore-ui:DeleteAlt1`)}
          <br />
          {this.props.t(`explore-ui:DeleteAlt2`)}
        </p>
        <div className={"actions"}>
          <button
            type={"button"}
            onClick={() => {
              this.props.hideModal();
            }}
          >
            No
          </button>
          <button
            type={"button"}
            onClick={() => {
              for (let [key, mods] of Object.entries(this.props.displayedMods)) {
                this.props.deleteMods(mods);
              }
            }}
            className={"red"}
          >
            Yes, Delete Mods
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render the sidebar content
   * @returns {*}
   */
  static sidebar() {
    return (
      <div className={"filters"} key={"filters"}>
        <ModFilter />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  const profile = state.profile;
  if (profile) {
    const assignedMods: AssignedMods =
      profile.modAssignments && profile.modAssignments.filter
        ? profile.modAssignments
            .filter((x) => null !== x)
            .reduce((acc, { id: characterID, assignedMods: modIds }) => {
              const updatedAssignments = { ...acc };
              modIds.forEach((id) => (updatedAssignments[id] = characterID));
              return updatedAssignments;
            }, {} as AssignedMods)
        : {} as AssignedMods;
        
    let modsFilter = new ModsFilter(state.modsViewOptions);
    const [mods, shownMods] = modsFilter.applyModsViewOptions(profile.mods);

    return {
      characters: profile.characters,
      displayedMods: mods,
      assignedMods: assignedMods,
      modCount: profile.mods.length,
      displayedModsCount: shownMods,
    };
  } else {
    return {
      characters: {} as Characters,
      displayedMods: {},
      assignedMods: {} as AssignedMods,
      modCount: 0,
      displayedModsCount: 0,
    };
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  showModal: (content: DOMContent) => dispatch(showModal("", content)),
  hideModal: () => dispatch(hideModal()),
  deleteMods: (mods: Mod[]) => {
    dispatch(deleteMods(mods));
    dispatch(hideModal());
  },
});

type Props = PropsFromRedux & OwnProps & WithTranslation<['domain', 'explore-ui']>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type OwnProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(withTranslation(['domain', 'explore-ui'])(ExploreView));
