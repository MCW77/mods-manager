export async function fetchVersion() {
  try {
    const response = await fetch(
      "https://api.mods-optimizer.swgoh.grandivory.com/versionapi",
      { method: "POST", body: null, mode: "cors" }
    );
    return await response.text();
  } catch (error) {
    throw new Error(
      "Error fetching the current version. Please check to make sure that you are on the latest version"
    );
  }
}
