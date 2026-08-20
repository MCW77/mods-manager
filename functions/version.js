export async function onRequest({ request, env }) {
	const url = new URL(request.url);
	url.pathname = "/version.json";

	return env.ASSETS.fetch(url);
}
