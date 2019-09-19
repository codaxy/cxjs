import { Selector } from "../core";
import { ViewMethods, View } from "../data";

export function useStore(): View;

export function useStoreMethods(): ViewMethods;

export function ref(info: any): Selector<any>;