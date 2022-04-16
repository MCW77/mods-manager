import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import "./HelpView.css";

class HelpView extends React.PureComponent<Props> {
  render() {
    return [
      <div className={'Help-page'} key={'help'}>
      </div>  
    ];
  }
}

type Props = WithTranslation<['global-ui']>;

export default withTranslation(['global-ui'])(HelpView);
