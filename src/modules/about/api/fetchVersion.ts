const post = async (url = "", data = {}, extras = {}) => {
	const response = await fetch(
		url,
		Object.assign(
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
				mode: "cors",
			},
			extras,
		) as RequestInit,
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
		const response = await post(
			"https://api-test.mods-manager.pages.dev/version",
			{},
		);
		return response.version;
	} catch (error) {
		throw new Error(
			"Error fetching the current version. Please check to make sure that you are on the latest version",
			{ cause: error },
		);
	}
}

export { fetchVersion };
