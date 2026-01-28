import { computable, ComputableSelector } from "../data/computable";
import { MemoSelector } from "../data/Selector";
import { StringTemplate } from "../data/StringTemplate";
import { Tpl } from "./Prop";

export function tpl(text: string): Tpl;
export function tpl<T extends ComputableSelector[]>(...args: [...T, string]): MemoSelector<string>;
export function tpl(...args: any[]): any {
   if (args.length === 1)
      return {
         tpl: args[0],
      };

   let template = args[args.length - 1];
   let formatter = StringTemplate.get(template);
   let selectors = args.slice(0, -1);
   return computable(...selectors, (...values: any[]) => formatter(values));
}