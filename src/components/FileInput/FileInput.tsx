import * as React from "react";

import './FileInput.css';

type Props = {
  className?: string,
  label: string,
  handler: (f: File) => void
};

class FileInput extends React.PureComponent<Props> {
  input: HTMLInputElement | null;
  inputForm: HTMLFormElement | null;

  constructor(props: Props) {
    super(props);
    
    this.input = null;
    this.inputForm = null;
  }

  render(): React.ReactNode {
    const fileHandler = this.props.handler;
    const extraClass = this.props.className || '';

    return (
      <form className={'file-input'} ref={form => this.inputForm = form}>
        <label className={`file button ${extraClass}`}>{this.props.label}
          <input type={'file'} ref={fileInput => this.input = fileInput}
                 onChange={() => {
                   if (this?.input?.files?.[0])
                     fileHandler(this.input.files[0]);
                   if (this.inputForm)
                     this.inputForm.reset();
                 }}/>
        </label>
      </form>
    );
  }
}

export default FileInput;
