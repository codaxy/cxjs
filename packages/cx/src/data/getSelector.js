import { Binding } from "./Binding";
import { Expression } from "./Expression";
import { StringTemplate } from "./StringTemplate";
import { isArray } from "../util/isArray";
import { createStructuredSelector } from "./createStructuredSelector";
import { isSelector } from "./isSelector";
import { isAccessorChain } from "./createAccessorModelProxy";

var undefinedF = () => undefined;
var nullF = () => null;

export function getSelector(config) {
   if (config === undefined) return undefinedF;
   if (config === null) return nullF;

   switch (typeof config) {
      case "object":
         if (isArray(config)) {
            let selectors = config.map((x) => getSelector(x));
            return (data) => selectors.map((elementSelector) => elementSelector(data));
         }

         if (config.bind) return Binding.get(config.bind).value;

         if (config.tpl) return StringTemplate.get(config.tpl);

         if (config.expr) return Expression.get(config.expr);

         if (config.get) return config.get;

         let selectors = {};
         let constants = {};

         for (let key in config) {
            if (isSelector(config[key])) selectors[key] = getSelector(config[key]);
            else constants[key] = config[key];
         }
         return createStructuredSelector(selectors, constants);

      case "function":
         if (isAccessorChain(config)) return Binding.get(config.toString()).value;
         return config;

      default:
         return () => config;
   }
}
