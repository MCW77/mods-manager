import * as React from 'react';
import * as Redux from 'redux';
import { connect, ConnectedProps } from "react-redux";

import './Help.css';

import { showFlash } from '../../state/actions/app'
import * as UITypes from 'components/types';

class Help extends React.PureComponent<Props> {
    render() {
        return <span className={'icon help'}
            onClick={() =>
                this.props.showFlash(this.props.header, this.props.children)
            }
        />;
    }
}


type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
type ComponentProps = {
  header: string;
  children: UITypes.DOMContent;
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Redux.Dispatch<Redux.AnyAction>) => ({
    showFlash: (header: string, content: UITypes.DOMContent) => dispatch(showFlash(header, content))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Help);
