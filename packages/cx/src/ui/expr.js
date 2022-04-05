import { Binding } from "../data/Binding";
import { isString } from "../util/isString";

export function expr(text) {
   if (isString(text))
      return {
         expr: text,
      };

   let getters = [];
   let compute = arguments[arguments.length - 1];
   for (let i = 0; i < arguments.length - 1; i++) getters.push(Binding.get(arguments[i]).value);
   return (data) => {
      let argv = getters.map((g) => g(data));
      return compute.apply(this, argv);
   };
}
