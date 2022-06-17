// react
import React, { createRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// styles
import "./Spoiler.css";

// state
import { IAppState } from '../../state/storage';


class Spoiler extends React.PureComponent<Props> {
    spoilerContent: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
      super(props);

      this.spoilerContent = createRef<HTMLDivElement>()
    }
    componentDidMount() {
        console.log(this.spoilerContent.current?.scrollHeight);
        this.spoilerContent.current?.style.setProperty('--content-height', this.spoilerContent.current!.scrollHeight + 'px');
    }

    render() {
        return (
            <div className={'spoiler'}>
                <div
                    className={'title'}
                    onClick={e => ((e.target as HTMLDivElement)!.parentNode! as HTMLDivElement).classList.toggle('open')}>
                    {this.props.title}
                </div>
                <div className={'divider'} />
                <div className={'content'} ref={this.spoilerContent}>
                    {this.props.children}
                </div>
            </div>
        );
    }
};

type SpoilerChildrenProps = React.HTMLProps<HTMLDivElement>
type Props = React.PropsWithChildren<PropsFromRedux & ComponentProps>;
type PropsFromRedux = ConnectedProps<typeof connector>;

type ComponentProps = {
  title: string;
}

const mapStateToProps = (state: IAppState) => {
  return {}
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
})

let connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Spoiler);