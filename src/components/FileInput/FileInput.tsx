// react
import React, { useRef } from "react";

// styles
import './FileInput.css';

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";


type ComponentProps = {
  className?: string,
  icon: IconDefinition;
  label: string,
  handler: (f: File) => void
};

const FileInput = React.memo(
  ({className = '',
    icon,
    label,
    handler,
  }: ComponentProps) => {
    const fileInput = useRef<HTMLInputElement>(null);
    return (
      <label className={`file button ${className}`}>
        <FontAwesomeIcon icon={icon} title={label}/>
        <input
          type={'file'}
          ref={fileInput}
          onChange={() => {
            if (fileInput.current && fileInput.current!.files) {
              handler(fileInput.current!.files[0]);
            }
          }}
        />
        {label}
      </label>
    );
  }
);

FileInput.displayName = 'FileInput';

export { FileInput };
