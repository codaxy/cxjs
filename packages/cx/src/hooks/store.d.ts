import { Selector } from "../core";
import { StoreMethods, View } from "../data";

export function useStore(): View;

export function useStoreMethods(): StoreMethods;

export function ref(info: any): Selector<any>;