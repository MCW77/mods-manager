export async function onRequest(context) {
	const { request, env } = context;

	// Only handle POST requests
	if (request.method !== "POST") {
		return new Response("Method not allowed", { status: 405 });
	}

	try {
		// Get the request body
		const requestBody = await request.json();

		// Extract the target URL and custom headers from the request
		const { character } = requestBody;

		const templates = await env.MMUT.get(character, "json");

		if (templates === null) {
			const url = `https://swgoh.gg/api/v2/units/${character}/template-data/`;

			const response = await fetch(url, {
				method: "GET",
				headers: {
					"content-type": "application/json",
					"x-gg-bot-access": env["swgohgg-apikey"],
				},
			});

			// Get response data
			const responseData = await response.text();

			// Try to parse as JSON, fall back to text
			let parsedData;
			try {
				parsedData = JSON.parse(responseData);
			} catch {
				parsedData = responseData;
			}
			templates = parsedData.data.templates;
			await env.MMUT.put(character, JSON.stringify(templates));
		}
		return new Response(JSON.stringify(templates), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
