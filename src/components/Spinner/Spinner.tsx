// react
import React from "react";

// styles
import './Spinner.css';


type ComponentProps = {
  isVisible: boolean,
};

const Spinner = React.memo(
  ({
    isVisible = false,
  }: ComponentProps) => {
    if (isVisible === false) return null;

    return (
      <div className={'overlay'}>
        <div className={'spinner'}/>
      </div>
    )
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
