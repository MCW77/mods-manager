// react
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

// styles
import './HelpView.css';
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

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


type SectionName =
  'explorer'
  | 'general'
  | 'optimizer'
  | 'profiles'
;

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

  const topicsBySection: Record<string, number[]> = {
    general: [1, 2, 3, 4, 5],
    profiles: [1, 2, 3, 4, 5],
    explorer: [1],
    optimizer: [1, 2],
  };

  const sectionElements: Record<string, React.RefObject<HTMLDivElement>> = {
    general: React.createRef<HTMLDivElement>(),
    profiles: React.createRef<HTMLDivElement>(),
    explorer: React.createRef<HTMLDivElement>(),
    optimizer: React.createRef<HTMLDivElement>(),
  };

  const renderSection = (sectionName: SectionName) => {
    let classes = sectionName;
    if (sectionName === currentSection) classes += ` selected`;

    return (
      <div
        className={classes}
        ref={sectionElements[sectionName]}
        onClick={() => {
          changeCurrentTopic(0);
          changeCurrentSection(sectionName);
        }}
      >
        {t(`${sectionName}.Title`)}
      </div>
    );
  };

  const renderTopics = () => {
    if (currentTopic !== 0 || currentSection === '') return null;

    return topicsBySection[currentSection].map((topic: number) => {
      return (
        <span
          className="topic"
          key={`${currentSection}-${topic}`}
          onClick={() => changeCurrentTopic(topic)}
        >
          {t(`${currentSection}.topics.${topic}`, '')}
        </span>
      );
    });
  };

  const renderTopic = () => {
    return match([currentSection, currentTopic])
      .with(['optimizer', 1], () => renderGlobalOptimizationSettingsTopic())
      .with(['optimizer', 2], () => renderCharacterTemplatesTopic())
      .otherwise(() => {
        const title = t(
          `${currentSection}.topicById.${currentTopic}.Headline`,
          ''
        );
        let counter = 1;
        const paragraphs: string[] = [];
        let paragraph = t(
          `${currentSection}.topicById.${currentTopic}.${counter}`,
          ''
        );
        while (paragraph !== '') {
          paragraphs.push(paragraph);
          counter++;
          paragraph = t(
            `${currentSection}.topicById.${currentTopic}.${counter}`,
            ''
          );
        }

        return (
          <div id={`topic-${currentSection}-${currentTopic}`}>
            {title !== '' && <h2>{title}</h2>}
            {paragraphs.map((p, index: number) => (
              <p key={`help-topic-paragraph-${index}`}>{p}</p>
            ))}
          </div>
        );
      });
  };

  const renderGlobalOptimizationSettingsTopic = () => {
    return (
      <div id={`topic-${currentSection}-${currentTopic}`}>
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
      <div id={`topic-${currentSection}-${currentTopic}`}>
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

  return (
    <div className={'Help-page'} key={'help'}>
      <nav className="sections">
        {previousSection !== 'help' && (
          <div className="returnTo">
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
      </nav>
      <div className={'topics'}>
        {currentTopic === 0 ? renderTopics() : null}
      </div>
      <div className={'topic'}>
        {currentTopic !== 0 || currentSection === '' ? renderTopic() : null}
      </div>
    </div>
  );
};

HelpView.displayName = 'HelpView';

export { HelpView };
