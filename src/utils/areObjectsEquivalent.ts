export default function areObjectsEquivalent(
	left: unknown,
	right: unknown,
): boolean {
	// Handle strict equality (includes primitives, same reference, null, undefined)
	if (left === right) {
		return true;
	}

	// Handle null/undefined cases
	if (
		left === null ||
		right === null ||
		left === undefined ||
		right === undefined
	) {
		return left === right;
	}

	// Handle different types
	if (typeof left !== typeof right) {
		return false;
	}

	// Handle primitive types that aren't strictly equal
	if (typeof left !== "object") {
		return false;
	}

	// Handle arrays
	if (Array.isArray(left) && Array.isArray(right)) {
		if (left.length !== right.length) {
			return false;
		}
		return left.every((item, index) =>
			areObjectsEquivalent(item, right[index]),
		);
	}

	// One is array, other isn't
	if (Array.isArray(left) || Array.isArray(right)) {
		return false;
	}

	// Handle plain objects
	const leftObj = left as Record<string, unknown>;
	const rightObj = right as Record<string, unknown>;

	// Get all own property names (including non-enumerable)
	const leftKeys = Object.getOwnPropertyNames(leftObj);
	const rightKeys = Object.getOwnPropertyNames(rightObj);

	// Different number of properties
	if (leftKeys.length !== rightKeys.length) {
		return false;
	}

	// Check if all keys exist in both objects and values are equal
	return leftKeys.every((key) => {
		// Check if the key exists in the right object
		if (!(key in rightObj)) {
			return false;
		}

		// Recursively compare the values
		return areObjectsEquivalent(leftObj[key], rightObj[key]);
	});
}
