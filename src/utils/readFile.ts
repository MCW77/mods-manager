/**
 * Read a file as input and pass its contents to another function for processing
 * @param fileInput The uploaded file
 * @param handleResult Function string => *
 * @param handleError Function Error => *
 */
export const readFile = (
	fileInput: Blob,
	handleSuccess: (textInFile: string) => void,
	handleError: (e: Error) => void,
) => {
	const reader = new FileReader();

	reader.onload = (event) => {
		try {
			const fileData: string = (event?.target?.result as string) ?? "";
			handleSuccess(fileData);
		} catch (e) {
			handleError(e as Error);
		}
	};

	reader.readAsText(fileInput);
};
