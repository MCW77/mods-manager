const getFetch = async (url = "") => {
	const response = await fetch(
		url,
		Object.assign({
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}) as RequestInit,
	);

	if (response.ok) {
		return response.json();
	}
	return response
		.text()
		.then((errorText) => Promise.reject(new Error(errorText)));
};

async function fetchVersion() {
	try {
		const response = await getFetch("https://mods-manager.pages.dev/version");
		return response.version;
	} catch (error) {
		throw new Error(
			"Error fetching the current version. Please check to make sure that you are on the latest version",
			{ cause: error },
		);
	}
}

export { fetchVersion };
