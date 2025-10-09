import {isFunction} from './isFunction';
import {isObject} from './isObject';

export function isPromise(x: any): x is Promise<any> {
   return isObject(x) && isFunction(x.then);
}
