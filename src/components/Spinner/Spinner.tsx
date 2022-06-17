// react
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// styles
import './Spinner.css';

// state
import { IAppState } from '../../state/storage';


class Spinner extends React.PureComponent<Props> {
  render() {
    if (!this.props.show) {
      return null;
    }

    return <div className={'overlay'}>
      <div className={'spinner'}/>
    </div>
  }
}

type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;

type ComponentProps = {
  show: boolean;
}

const mapStateToProps = (state: IAppState) => {
  return {}
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
})

let connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Spinner);
