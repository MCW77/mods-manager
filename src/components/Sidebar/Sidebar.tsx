import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from 'state/reducers/modsOptimizer';

import "./Sidebar.css";

import { toggleSidebar } from "../../state/actions/app";

import { IAppState } from "state/storage";
import * as UITypes from 'components/types';



class Sidebar extends React.PureComponent<Props> {
  render() {
    return <div className="sidebar-wrapper">
      <div className={`sidebar ${this.props.showSidebar ? 'show' : 'hide'}`} key={'sidebar'}>
        {this.props.content}
      </div>
      <button className={`toggle-sidebar ${this.props.showSidebar ? 'hide' : 'show'}`}
        onClick={() => { this.props.toggleSidebar() }}>
      </button>
    </div>;
  }
}
type ComponentProps = {
  content: UITypes.DOMContent;
}
type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;

const mapStateToProps = (state: IAppState) => ({
  showSidebar: state.showSidebar
});

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  toggleSidebar: () => dispatch(toggleSidebar())
});

const connector = connect(mapStateToProps, mapDispatchToProps); 
export default connector(Sidebar);
