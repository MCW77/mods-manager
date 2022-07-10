// react
import React from "react";

// styles
import './Dropdown.css'


type SelectProps = React.HTMLProps<HTMLSelectElement>

type DropdownProps = {
    name?: string,
    defaultValue?: string | number,
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
} & SelectProps;

const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
    function Dropdown(props, ref) {
        return <div className={'dropdown'}>
            <select {...props} ref={ref} />
        </div>;
    }
);

export { Dropdown };
