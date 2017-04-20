
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * trigger the `callback` function, until the `delay` amount of milliseconds has passed since the last call. 
 * All arguments are passed to the `callback` function.
 * @param callback
 * @param delay - Delay in milliseconds. 
 * @returns {Function}
 */
export function debounce(callback: (...args: any[]) => void, delay: number): (...args: any[]) => void;