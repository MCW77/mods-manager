export async function onRequest(context) {
	const res = await context.env.ASSETS.fetch("/version.json");
	return res;
}
