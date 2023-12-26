// react
import { ThunkDispatch } from '../state/reducers/modsOptimizer';

// modules
import { App } from "#/state/modules/app";

/**
 * Read a file as input and pass its contents to another function for processing
 * @param fileInput The uploaded file
 * @param handleResult Function string => *
 * @param dispatch ThunkDispatch
 */
export const readFile = (fileInput: Blob, handleResult: (textInFile: string) => void, dispatch: ThunkDispatch) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const fileData: string = event?.target?.result as string ?? '';
      handleResult(fileData);
    } catch (e) {
      dispatch(App.actions.showError((e as Error).message));
    }
  };

  reader.readAsText(fileInput);
}
