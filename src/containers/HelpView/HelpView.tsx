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

// actions
import {
  changeSection,
} from '../../state/actions/app';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const HelpView = () => {
  const previousSection = useSelector(
    (state: IAppState) => state.previousSection
  );
  const helpSection = useSelector((state: IAppState) => state.help.section);
  const helpTopic = useSelector((state: IAppState) => state.help.topic);
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation('help-ui');
  const [currentSection, changeCurrentSection] = useState(helpSection);
  const [currentTopic, changeCurrentTopic] = useState(helpTopic);

  const topicsBySection: Record<string, number[]> = {
    general: [1, 2, 3, 4, 5],
    profiles: [1, 2, 3, 4, 5],
    explorer: [1],
    optimizer: [1],
  };

  const sectionElements: Record<string, React.RefObject<HTMLDivElement>> = {
    general: React.createRef<HTMLDivElement>(),
    profiles: React.createRef<HTMLDivElement>(),
    explorer: React.createRef<HTMLDivElement>(),
    optimizer: React.createRef<HTMLDivElement>(),
  };

  const renderSection = (sectionName: string) => {
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
          {t(`${currentSection}.topics.${topic}`)}
        </span>
      );
    });
  };

  const renderTopic = () => {
    return match([currentSection, currentTopic])
      .with(['optimizer', 1], () => renderGlobalOptimizationSettingsTopic())
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
        <p>
          Global settings are a quick way to make changes that apply to every
          character during an optimization. They always override any
          character-specific settings that you have set.
        </p>
        <ul>
          <li>
            <strong>Threshold to change mods</strong> - As the optimizer is
            running, its normal behavior is to always recommend the absolute
            best mod set it can find, based on the target you have selected. If
            this number is above 0, then the optimizer will only recommend that
            you change mods on a character if the new recommended set is at
            least this much better than what the character previously had, or if
            the character's mods were moved to a character higher in your list
            and needed to be replaced.
          </li>
          <li>
            <strong>Lock all unselected characters</strong> - If this box is
            checked, then no mods will be taken from characters that aren't in
            your selected list. If you have a number of unassigned mods, this
            can be a quick way to make use of them without triggering a major
            remod of your whole roster.
          </li>
          <li>
            <strong>Don't break mod sets</strong> - If this box is checked, the
            optimizer will try to keep mod sets together, so you always get the
            maximum set bonuses. Sometimes it's not possible to do so, either
            because of other restrictions on a character's target or because you
            don't have enough mods left to make a full set. In these cases, the
            optimizer will still drop this restriction to try to recommend the
            best set.
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className={'Help-page'} key={'help'}>
      <nav className="sections">
        {previousSection !== 'help' && (
          <div className="returnTo">
            <FontAwesomeIcon
              icon={faCircleLeft}
              title={`Go back`}
              onClick={() => dispatch(changeSection(previousSection))}
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

export default HelpView;
