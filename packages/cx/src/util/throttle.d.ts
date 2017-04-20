/**
 * Returns a function, that, after it is invoked, will trigger the `callback` function, 
 * after the `delay` amount of milliseconds has passed. During that time, all subsequent calls are
 * ignored. All arguments are passed to the `callback` function.
 * @param callback
 * @param delay - Delay in milliseconds. 
 * @returns {Function}
 */
export function throttle(callback: (...args: any[]) => void, delay: number): (...args: any[]) => void;