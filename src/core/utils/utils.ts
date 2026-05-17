/**
 * Simple object check.
 * @param obj
 * @returns {boolean}
 */
export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

/**
 * get random number from a range
 *
 * @param min
 * @param max
 * @returns {*}
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
