// react
import React, { useRef } from "react";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";


type ComponentProps = {
  accept?: string,
  className?: string,
  icon: IconDefinition,
  label: string,
  handler: (f: File) => void
};

const FileInput = React.memo(
  ({
    accept = '',
    className = '',
    icon,
    label,
    handler,
  }: ComponentProps) => {
    const fileInput = useRef<HTMLInputElement>(null);
    return (
      <label className={`file button ${className}`}>
        <FontAwesomeIcon icon={icon} title={label}/>
        <input
          accept={accept}
          className={`sr-only`}
          ref={fileInput}
          type="file"
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
