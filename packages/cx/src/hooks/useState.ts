import { getCurrentInstance } from "../ui/createFunctionalComponent";
import { Ref } from "../data/Ref";

let key: number = 0;

export function useState<T = any>(defaultValue?: T): Ref<T> {
   let instance = getCurrentInstance();
   let storeKey = "_state" + ++key;
   instance.setState({
      [storeKey]: defaultValue,
   });

   return new Ref<T>({
      get: (): T => instance.state[storeKey],
      set: (value: T): boolean => {
         instance.setState({ [storeKey]: value });
         return true;
      },
   });
}
