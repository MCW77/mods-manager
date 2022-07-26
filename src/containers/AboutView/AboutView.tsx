// react
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// styles
import "./AboutView.css";

// selectors
import {
  selectVersion,
} from '../../state/reducers/app';


const AboutView = React.memo(
  () => {
    const version = useSelector(selectVersion);
    const [t, i18n] = useTranslation('global-ui');

    return (
      <div className={'About-page'} key={'about'}>
        <div className={'About-title'}>
          <img className={'About-title-image'} src={'../../img/gold-crit-dmg-arrow-mod-cropped.png'}></img>
          <h1 className={'About-title-heading'}>
            Grandivory's Mods Optimizer <span className="subtitle">{t('header.SubtitleFor')} Star Wars: Galaxy of Heroes™</span>
          </h1>
        </div>
        <p>
          Star Wars: Galaxy of Heroes™ is owned by EA and Capital Games. This site is not affiliated with them.
        </p>
        <a href={'https://github.com/grandivory/mods-optimizer'} target={'_blank'} rel={'noopener noreferrer'}>
          Contribute
        </a>
        &nbsp;|&nbsp;
        Ask for help or give feedback on <a href={'https://discord.gg/WFKycSm'} target={'_blank'} rel={'noopener noreferrer'}>
          Discord
        </a>
        &nbsp;| Like the tool? Consider donating to support the developer!&nbsp;
        <a href={'https://paypal.me/grandivory'} target={'_blank'} rel={'noopener noreferrer'} className={'gold'}>
          Paypal
        </a>
        &nbsp;or&nbsp;
        <a href={'https://www.patreon.com/grandivory'} target={'_blank'} rel={'noopener noreferrer'} className={'gold'}>
          Patreon
        </a>
        <div className={'version'}>
            version {version}
        </div>
      </div>
    );
  }
);

AboutView.displayName = 'AboutView';

export default AboutView;
