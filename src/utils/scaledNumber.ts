/**
 * Scaled Integer Arithmetic
 *
 * Uses scaled integers to avoid floating-point precision issues.
 * All numbers are stored as integers scaled by SCALE (1,000,000).
 *
 * This provides 6 decimal places of precision, which is sufficient for:
 * - Input values with max 3 decimals (e.g., 14.357, 1.045)
 * - Intermediate calculations that can produce 6+ decimals (e.g., 14.357 × 1.045 = 14.983065)
 * - Max values up to 1,000,000 (safely within Number.MAX_SAFE_INTEGER when scaled)
 *
 * Example:
 * - 14.357 → scaled: 14,357,000
 * - 1.045 → scaled: 1,045,000
 * - Multiplication: 14.357 × 1.045 = 14.983065
 *   - Scaled: (14,357,000 × 1,045,000) / 1,000,000 = 14,983,065
 */

/**
 * Scale factor for converting between regular numbers and scaled integers.
 * Using 10^6 (1 million) provides 6 decimal places of precision.
 */
export const SCALE = 1_000_000;

/**
 * Convert a regular number to a scaled integer.
 * @param value - The number to scale
 * @returns The scaled integer representation
 *
 * @example
 * toScaled(14.357) // Returns 14357000
 * toScaled(1.045)  // Returns 1045000
 */
export function toScaled(value: number): number {
	return Math.round(value * SCALE);
}

/**
 * Convert a scaled integer back to a regular number.
 * @param scaled - The scaled integer
 * @returns The regular number representation
 *
 * @example
 * fromScaled(14357000) // Returns 14.357
 * fromScaled(1045000)  // Returns 1.045
 */
export function fromScaled(scaled: number): number {
	return scaled / SCALE;
}

/**
 * Multiply two scaled integers.
 * @param a - First scaled integer
 * @param b - Second scaled integer
 * @returns The product as a scaled integer
 *
 * @example
 * // 14.357 × 1.045 = 14.983065
 * mulScaled(14357000, 1045000) // Returns 14983065
 */
export function mulScaled(a: number, b: number): number {
	return Math.round((a * b) / SCALE);
}

/**
 * Divide two scaled integers.
 * @param a - Numerator (scaled integer)
 * @param b - Denominator (scaled integer)
 * @returns The quotient as a scaled integer
 *
 * @example
 * // 14.357 ÷ 1.045 = 13.739234...
 * divScaled(14357000, 1045000) // Returns 13739234
 */
export function divScaled(a: number, b: number): number {
	return Math.round((a * SCALE) / b);
}
