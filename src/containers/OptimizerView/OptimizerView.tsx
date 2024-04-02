// react
import React from "react";
import { useSelector } from "react-redux";

// state
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// modules
import { Storage } from "#/state/modules/storage";

// components
import { Switch } from "@legendapp/state/react";

// containers
import { CharacterEditForm } from "#/containers/CharacterEditForm/CharacterEditForm";
import CharacterEditView from "#/containers/CharacterEditView/CharacterEditView";
import Review from "#/containers/Review/Review";


const OptimizerView = React.memo(
  () => {
    const characters = useSelector(Storage.selectors.selectCharactersInActiveProfile);

    return (
      <div className={'flex items-stretch overflow-hidden flex-grow-1'}>
        <Switch value={optimizerView$.view}>
          {{
            "basic": () => <CharacterEditView/>,
            "edit": () => <CharacterEditForm
              character={characters[optimizerView$.currentCharacter.id.get()]}
              target={optimizerView$.currentCharacter.target.get()}/>,
            "review": () => <Review/>,
          }}
        </Switch>
      </div>
    )
  }
);

OptimizerView.displayName = 'OptimizerView';

export { OptimizerView };
