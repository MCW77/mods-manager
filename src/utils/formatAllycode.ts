// utils
import cleanAllycode from "./cleanAllycode";

/**
 * Format an ally code to follow the ###-###-### format shown in-game
 * @param allycode string
 */
export default function formatAllycode(allycode: string) {
	// Take only numbers
	const cleanedAllycode = cleanAllycode(allycode)
		// Take only the first 9 digits
		.substr(0, 9);

	// Split the numbers into chunks of 3
	const allycodeChunks = cleanedAllycode.match(/\d{1,3}/g) || [];

	// Add dashes between each and set the value back on the field
	return allycodeChunks.join("\u2011");
}
