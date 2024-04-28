// react
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { Computed, Show, observer, reactive } from "@legendapp/state/react";

// state
import {
	type ObservableComputed,
	type ObservableObject,
	computed,
	observable,
} from "@legendapp/state";

import { dialog$ } from "#/modules/dialog/state/dialog";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";

// components
import { Button } from "#ui/button";
import { Input } from "#ui/input";

interface Templates {
	id: string;
	templates: string[];
	isUnique: ObservableComputed<boolean>;
}

const ReactiveInput = reactive(Input);
const templates$: ObservableObject<Templates> = observable<Templates>({
  id: "",
  templates: [],
  isUnique: computed(() => {
    return !templates$.templates.get().includes(templates$.id.get());
  }),
});

const SaveTemplateModal = observer(() => {
	const dispatch: ThunkDispatch = useDispatch();
  const templates = useSelector(CharacterEdit.selectors.selectUserTemplatesNames);

  useEffect(() => {
    templates$.templates.set(templates);
  }, [templates]);

	return (
		<div className={"flex flex-col gap-2"}>
			<h3>Please enter a name for this character template</h3>
      <Computed>
        {
          () => (
            <ReactiveInput
              type={"text"}
              id={"template-name"}
              placeholder={"Template Name"}
              $value={templates$.id}
              onChange={(event) => {
                templates$.id.set(event.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter" && templates$.id.get() !== "" && templates$.isUnique.get()) {
                  dialog$.hide();
                  dispatch(CharacterEdit.thunks.saveTemplate(templates$.id.get()));
                }
              }}
            />
          )
        }
      </Computed>
			<Show
        if={templates$.isUnique}
        else={<p className={"text-red-600"}>That name has already been taken. Please use a different name.</p>}
      >
        <p className={""}>
			  </p>
      </Show>
			<div className={"flex gap-2 justify-center"}>
				<Button type={"button"} onClick={() => dialog$.hide()}>
					Cancel
				</Button>
				<Button
					type={"button"}
					disabled={!templates$.isUnique.get() || templates$.id.get() === ""}
					onClick={() => {
						dialog$.hide();
						dispatch(CharacterEdit.thunks.saveTemplate(templates$.id.get()));
					}}
				>
					Save
				</Button>
			</div>
		</div>
	);
});

SaveTemplateModal.displayName = "SaveTemplateModal";

export { SaveTemplateModal };
