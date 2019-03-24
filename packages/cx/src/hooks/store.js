import {getCurrentInstance} from "../ui/createFunctionalComponent";

export function useStore() {
   return getCurrentInstance().store;
}

export function useStoreMethods() {
   return getCurrentInstance().store.getMethods();
}

export function ref(name, defaultValue) {
   return useStore().ref(name, defaultValue);
}
