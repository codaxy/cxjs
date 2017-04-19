
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * `delay` milliseconds.
 * @param {Function} callback
 * @param {number} delay - Delay in milliseconds. 
 * @returns {Function}
 */
export function debounce(callback: Function, delay: number): (...args: any[]) => void;