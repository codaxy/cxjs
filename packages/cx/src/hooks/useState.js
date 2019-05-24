import {getCurrentInstance} from "../ui/createFunctionalComponent";
import {Ref} from "../data/Ref";

let key = 0;

export function useState(defaultValue) {
   let instance = getCurrentInstance();
   let storeKey = '_state' + (++key);
   instance.setState({
      [storeKey]: defaultValue
   });
   return new Ref({
      get: () => instance.state[storeKey],
      set: value => instance.setState({[storeKey]: value})
   });
}