import {getCurrentInstance} from "../ui/Cx";

export function useStore() {
   return getCurrentInstance().store;
}

export function ref(name, defaultValue) {
   return useStore().ref(name, defaultValue);
}
