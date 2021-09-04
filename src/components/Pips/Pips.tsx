import React from 'react';

import './Pips.css';

type Props = {
  pips: number;
}

class Pips extends React.PureComponent<Props> {
  render() {
    const pips = this.props.pips;
    const pipElements = Array.from(Array(pips).keys()).map((_, index) => <span key={index} className='pip'/>);

    return (
      <div className='pips inset'>
        {pipElements}
      </div>
    );
  }
}

export default Pips;
