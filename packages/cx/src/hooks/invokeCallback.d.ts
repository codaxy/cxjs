import { Instance } from "./../ui/Instance.d";
import { isFunction } from "../util/isFunction";
import { isString } from "../util/isString";

export function invokeCallback(instance: Instance, callback: string | ((...args: any) => any), ...args: any[]): any;
