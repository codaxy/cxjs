import { Binding } from "../data/Binding";
import { isString } from "../util/isString";

export function expr(text: string): any;
export function expr(...args: any[]): any;
export function expr(...args: any[]): any {
   let text = args[0];
   if (isString(text))
      return {
         expr: text,
      };

   let getters: any[] = [];
   let compute = args[args.length - 1];
   for (let i = 0; i < args.length - 1; i++) getters.push(Binding.get(args[i]).value);
   return (data: any) => {
      let argv = getters.map((g) => g(data));
      return compute.apply(this, argv);
   };
}
