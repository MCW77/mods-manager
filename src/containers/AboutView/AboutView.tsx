import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from "state/reducers/modsOptimizer";
import { withTranslation, WithTranslation } from "react-i18next";

import "./AboutView.css";

import { IAppState } from "state/storage";

class AboutView extends React.PureComponent<Props> {
  render() {
    const modsElement: HTMLDivElement = document.getElementById(
      "mods"
    ) as HTMLDivElement;

    return [
      <div className={'About-page'} key={'about'}>
        <div className={'About-title'}>
          <img className={'About-title-image'} src={'../../img/gold-crit-dmg-arrow-mod-cropped.png'}></img>
          <h1 className={'About-title-heading'}>
            Grandivory's Mods Optimizer <span className="subtitle">{this.props.t('header.SubtitleFor')} Star Wars: Galaxy of Heroes™</span>
          </h1>
        </div>
        Star Wars: Galaxy of Heroes™ is owned by EA and Capital Games. This site is not affiliated with them.<br />
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
            version {this.props.version}
        </div>
      </div>  
    ];
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    version: state.version,
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
});

type Props = PropsFromRedux & OwnProps & WithTranslation<['global-ui']>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type OwnProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(withTranslation(['global-ui'])(AboutView));
