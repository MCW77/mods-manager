// react
import React from 'react';

// styles
import './Dropdown.css';

type SelectProps = React.HTMLProps<HTMLSelectElement>;

type ComponentProps = {
  name?: string;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
} & SelectProps;

const Dropdown = React.memo(
  React.forwardRef<HTMLSelectElement, ComponentProps>(function Dropdown(
    props,
    ref,
  ) {
    return (
      <div className={'dropdown'}>
        <select {...props} ref={ref} />
      </div>
    );
  }),
);

Dropdown.displayName = 'Dropdown';

export { Dropdown };
