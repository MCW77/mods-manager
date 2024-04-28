// react
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// styles
import {
  faFile,
  faFileExport,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

// utils
import { saveAs } from "file-saver";
import { readFile } from "#/utils/readFile";

// state
import { dialog$ } from "#/modules/dialog/state/dialog";

// modules
import { CharacterEdit } from '#/state/modules/characterEdit';

// domain
import { CharacterTemplates } from "#/domain/CharacterTemplates";

//components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FileInput } from "#/components/FileInput/FileInput";
import { Button } from "#ui/button";

const TemplatesManager = React.memo(
  () => {
    const dispatch: ThunkDispatch = useDispatch();
    const userCharacterTemplates = useSelector(CharacterEdit.selectors.selectUserTemplates);
    const [selectedTemplates, setSelectedTemplates] = useState([] as CharacterTemplates);
    const [t, i18n] = useTranslation('settings-ui');

    return (
      <div className={'templates-manager'}>
        <div className="flex gap-2 items-center">
          <FileInput
            label={'Import'}
            className={"small"}
            icon={faFile}
            handler={(file) =>
              readFile(
                file,
                (templatesString) => {
                  try {
                    const templates = JSON.parse(templatesString);
                    dispatch(CharacterEdit.thunks.saveTemplates(templates));
                  } catch (e) {
                    throw new Error(
                      "Unable to read templates from file. Make sure that you've selected a character templates file"
                    );
                  }
                },
                (error) => dialog$.showError(error.message),
              )
            }
          />
          <Button
            disabled={selectedTemplates.length === 0}
            onClick={() => {
              const templatesSaveObject = selectedTemplates.map(
                ({ id: name, selectedCharacters }) => ({
                  name: name,
                  selectedCharacters: selectedCharacters.map(
                    ({ id, target }) => ({
                      id: id,
                      target: target,
                    })
                  ),
                })
              );
              const templatesSerialized = JSON.stringify(templatesSaveObject);
              const userData = new Blob([templatesSerialized], {
                type: "application/json;charset=utf-8",
              });
              saveAs(
                userData,
                `modsOptimizerTemplates-${new Date()
                  .toISOString()
                  .slice(0, 10)}.json`
              );

            }}
          >
            <FontAwesomeIcon className="m-r-2" icon={faFileExport} title={`Export`}/>
            Export
          </Button>
          <Button
            type={"button"}
            variant={"destructive"}
            disabled={selectedTemplates.length === 0}
            onClick={() => {
              for (const template of selectedTemplates.values()) {
                dispatch(CharacterEdit.thunks.deleteTemplate(template.id));
              }
              setSelectedTemplates([]);
            }}
          >
            <FontAwesomeIcon className="m-r-2" icon={faTrashCan} title={`${t('optimizer.TemplateDelete')}`}/>
            {t('optimizer.templates.Delete')} {" " + selectedTemplates.length}
          </Button>

        </div>
        <div className={'templates'}>
          {userCharacterTemplates.map(
            (template) => (
              <div
                className="group my-0.1rem mx-0 data-[selected=false]:bg-gradient-to-br data-[selected=true]:from-black/0.1 data-[selected=true]:to-white/0.2"
                data-template={template.id}
                key={`template-${template.id}`}
                onClick={(event) => {
                  event.stopPropagation();
                  const target = event.currentTarget as HTMLDivElement;
                  if (target.dataset.template !== undefined && target.dataset.template !== null) {
                    const templateName = target.dataset.template;
                    const selectedTemplate = selectedTemplates.find(template => template.id === templateName);
                    const wasSelected = selectedTemplate !== undefined;
                    const template = userCharacterTemplates.find(template => template.id === templateName);
                    target.classList.toggle('selected');
                    target.dataset.selected = selectedTemplate === undefined ? "true" : "false";
                    if (wasSelected) {
                      setSelectedTemplates(selectedTemplates.toSpliced(selectedTemplates.indexOf(selectedTemplate), 1));
                    } else {
                      setSelectedTemplates([...selectedTemplates, template!]);
                    }
                  }
                }}
              >
                <span className="group-[.selected]:border-l-yellow-300 group-[.selected]:border-l-solid group-[.selected]:border-l-4">&nbsp;</span>
                {template.id}
              </div>
            )
          )}
        </div>
      </div>
    )
  }
);

TemplatesManager.displayName = 'TemplatesManager';

export { TemplatesManager };
