// react
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

// styles
import {
  faCircleLeft,
} from '@fortawesome/free-solid-svg-icons';

// utils
import { match } from 'ts-pattern';

// state
import { IAppState } from '../../state/storage';

// modules
import { App } from '../../state/modules/app';
import { Help } from '../../state/modules/help';

// domain
import { HelpSections } from '../../domain/HelpSections';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '#/components/ui/button';
import { Label } from '#/components/ui/label';


const HelpView = () => {
  const previousSection = useSelector(
    (state: IAppState) => state.previousSection
  );
  const helpPosition = useSelector(Help.selectors.selectHelpPosition);
  const helpSection = helpPosition.section;
  const helpTopic = helpPosition.topic;
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation('help-ui');
  const [currentSection, changeCurrentSection] = useState(helpSection);
  const [currentTopic, changeCurrentTopic] = useState(helpTopic);

  const topicsBySection: Record<HelpSections, number[]> = {
    general: [1, 2, 3, 4, 5],
    profiles: [1, 2, 3, 4, 5],
    explorer: [1, 2],
    optimizer: [1, 2, 3, 4],
    editor: [1, 2, 3],
  };

  const sectionElements: Record<string, React.RefObject<HTMLButtonElement>> = {
    general: React.createRef<HTMLButtonElement>(),
    profiles: React.createRef<HTMLButtonElement>(),
    explorer: React.createRef<HTMLButtonElement>(),
    optimizer: React.createRef<HTMLButtonElement>(),
    editor: React.createRef<HTMLButtonElement>(),
  };

  const topicCSS = 'prose m-x-auto max-w-[80ch] flex flex-col items-center text-balance';

  const renderSection = (sectionName: HelpSections) => {
    return (
      <Button
        variant={'ghost'}
        role={'tab'}
        aria-selected={sectionName === currentSection}
        className={'rounded-xl p-2 m-1 border border-solid border-white aria-selected:border-yellow-300'}
        ref={sectionElements[sectionName]}
        onClick={() => {
          changeCurrentTopic(0);
          changeCurrentSection(sectionName);
        }}
      >
        {t(`${sectionName}.Title`)}
      </Button>
    );
  };

  const renderTopics = () => {
    if (currentTopic !== 0) return null;

    return topicsBySection[currentSection].map((topic: number) => {
      return (
        <h1
          key={`${currentSection}-${topic}`}
          onClick={() => changeCurrentTopic(topic)}
        >
          {t(`${currentSection}.topics.${topic}`, '')}
        </h1>
      );
    });
  };

  const renderTopic = () => {
    return match([currentSection, currentTopic])
      .with(['optimizer', 1], () => renderGlobalOptimizationSettingsTopic())
      .with(['optimizer', 2], () => renderCharacterTemplatesTopic())
      .with(['optimizer', 3], () => renderAutoGenerationTopic())
      .with(['editor', 3], () => renderOptimizationPlanEditorWeightsTopic())
      .with(['profiles', 4], () => renderFetchUnequippedModsWithHUTopic())
      .otherwise(() => {
        const title = t(
          `${currentSection}.topicById.${currentTopic}.Headline`,
          '',
        ) as string;
        let counter = 1;
        const paragraphs: string[] = [];
        let paragraph = t(
          `${currentSection}.topicById.${currentTopic}.${counter}`,
          '',
        ) as string;
        while (paragraph !== '') {
          paragraphs.push(paragraph);
          counter++;
          paragraph = t(
            `${currentSection}.topicById.${currentTopic}.${counter}`,
            ''
          );
        }

        return (
          <div className={topicCSS}>
            {title !== '' && <h2>{title}</h2>}
            {paragraphs.map((p, index: number) => (
              <p key={`help-topic-paragraph-${index}`}>{p}</p>
            ))}
          </div>
        );
      });
  };

  const renderOptimizationPlanEditorWeightsTopic = () => {
    const topicPath = `editor.topicById.3.`;
    return (
      <div className={topicCSS}>
        <h2>{t(`${topicPath}Headline`)}</h2>
        <div>
          {t(`${topicPath}1`)}
        </div>
        <div>
          <p>
            {t(`${topicPath}2`)}
          </p>
          <p>
            {t(`${topicPath}3`)}
          </p>
        </div>
      </div>
    );
  }
  /**
   * Renders a help description for pulling unequipped mods with HotUtils
   */
   const renderFetchUnequippedModsWithHUTopic = () => {
    return <div className={topicCSS}>
      <p>
        {t(`profiles.topicById.4.1`)} {t(`profiles.topicById.4.2`)}
      </p>
      <p>
        <strong>{t(`profiles.topicById.4.3`)}</strong><br />
        {t(`profiles.topicById.4.4`)} {t(`profiles.topicById.4.5`)} {t(`profiles.topicById.4.6`)}
      </p>
      <p><a href={'https://www.hotutils.com/'} target={'_blank'} rel={'noopener noreferrer'}>
        https://www.hotutils.com/
      </a></p>
      <p><img className={'w-full'} src={'/img/hotsauce512.png'} alt={'hotsauce'} /></p>
    </div>;
  }

  const renderGlobalOptimizationSettingsTopic = () => {
    return (
      <div className={topicCSS}>
        <h2>{t(`optimizer.topicById.1.Headline`)}</h2>
        <div>
          {t(`optimizer.topicById.1.1`)}
        </div>
        <div>
          <p>
            <strong>{t(`optimizer.topicById.1.2`)}</strong> - {t(`optimizer.topicById.1.3`)}
          </p>
          <p>
            <strong>{t(`optimizer.topicById.1.4`)}</strong> - {t(`optimizer.topicById.1.5`)}
          </p>
          <p>
            <strong>{t(`optimizer.topicById.1.6`)}</strong> - {t(`optimizer.topicById.1.7`)}
          </p>
        </div>
      </div>
    );
  };

  const renderCharacterTemplatesTopic = () => {
    return (
      <div className={topicCSS}>
        <h2>{t(`optimizer.topicById.2.Headline`)}</h2>
        <p>
          {t(`optimizer.topicById.2.1`)}
          <strong>{t(`optimizer.topicById.2.2`)}</strong>{t(`optimizer.topicById.2.3`)}
          <strong>{t(`optimizer.topicById.2.4`)}</strong>{t(`optimizer.topicById.2.5`)}
        </p>
        <h3>{t(`optimizer.topicById.2.6`)}</h3>
        <p>
          <strong>{t(`optimizer.topicById.2.7`)}</strong> - {t(`optimizer.topicById.2.8`)}
          <br />
          <strong>{t(`optimizer.topicById.2.9`)}</strong> - {t(`optimizer.topicById.2.10`)}
          <br />
          <strong>{t(`optimizer.topicById.2.11`)}</strong> - {t(`optimizer.topicById.2.12`)}
          <br />
          <strong>{t(`optimizer.topicById.2.13`)}</strong> - {t(`optimizer.topicById.2.14`)}
        </p>
        <h3>{t(`optimizer.topicById.2.15`)}</h3>
        <p>
          <strong>{t(`optimizer.topicById.2.16`)}</strong> - {t(`optimizer.topicById.2.17`)}
          <br />
          <strong>{t(`optimizer.topicById.2.18`)}</strong> - {t(`optimizer.topicById.2.19`)}
          <br />
          <strong>{t(`optimizer.topicById.2.20`)}</strong> - {t(`optimizer.topicById.2.21`)}
        </p>
      </div>
    );
  }

  const renderAutoGenerationTopic = () => {
    return (
      <div className={topicCSS}>
        <h1>{t(`optimizer.topicById.3.Headline`)}</h1>
        <p>
          {t(`optimizer.topicById.3.1`)}
        </p>
        <h2>{t(`optimizer.topicById.3.2`)}</h2>
        <section>
          <Label>{t(`optimizer.topicById.3.3`)}:</Label>
          <p>{t(`optimizer.topicById.3.4`)}</p>
          <Label>{t(`optimizer.topicById.3.5`)}:</Label>
          <p>{t(`optimizer.topicById.3.6`)}</p>
          <Label>{t(`optimizer.topicById.3.7`)}:</Label>
          <p>{t(`optimizer.topicById.3.8`)}</p>
          <Label>{t(`optimizer.topicById.3.9`)}:</Label>
          <p>{t(`optimizer.topicById.3.10`)}</p>
        </section>
      </div>
    );
  }

  return (
    <div className={'w-full flex flex-col'}>
      <nav className="flex flex-wrap justify-evenly p-4">
        {previousSection !== 'help' && (
          <div className="m-1 p-2 rounded-xl">
            <FontAwesomeIcon
              icon={faCircleLeft}
              title={`Go back`}
              onClick={() => dispatch(App.actions.changeSection(previousSection))}
            />
          </div>
        )}

        {renderSection('general')}
        {renderSection('profiles')}
        {renderSection('explorer')}
        {renderSection('optimizer')}
        {renderSection('editor')}
      </nav>
      <div className={topicCSS + ' text-center'}>
        {currentTopic === 0 ? renderTopics() : null}
      </div>
      <div className={'overflow-y-auto'}>
        {currentTopic !== 0 ? renderTopic() : null}
      </div>
    </div>
  );
};

HelpView.displayName = 'HelpView';

export { HelpView };
