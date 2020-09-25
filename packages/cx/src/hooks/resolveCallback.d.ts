import { Instance } from "./../ui/Instance.d";

export function resolveCallback(callback: string | ((...args) => any), instance?: Instance): (...args) => any;
