import { Binding } from "./Binding";
import { Expression } from "./Expression";
import { StringTemplate } from "./StringTemplate";
import { isArray } from "../util/isArray";
import { createStructuredSelector, StructuredSelectorConfig } from "./createStructuredSelector";
import { isSelector } from "./isSelector";
import { isAccessorChain } from "./createAccessorModelProxy";
import { isString } from "../util/isString";
import { hasKey, hasStringAtKey, hasFunctionAtKey } from "../util/hasKey";

type Selector<T> = (data: any) => T;

var undefinedF = () => undefined;
var nullF = () => null;

export function getSelector(config: unknown): Selector<any> {
   if (config === undefined) return undefinedF;
   if (config === null) return nullF;

   switch (typeof config) {
      case "object":
         if (isArray(config)) {
            let selectors = config.map((x) => getSelector(x));
            return (data) => selectors.map((elementSelector) => elementSelector(data));
         }

         //toString converts accessor chains to binding paths
         if (hasKey(config, "bind") && config.bind != null) return Binding.get(config.bind.toString()).value;

         if (hasStringAtKey(config, "tpl")) return StringTemplate.get(config.tpl);

         if (hasStringAtKey(config, "expr")) return Expression.get(config.expr);

         if (hasFunctionAtKey(config, "get")) return config.get;

         let selectors: StructuredSelectorConfig = {};
         let constants: Record<string, any> = {};

         let obj = config as Record<string, any>;
         for (let key in obj) {
            switch (typeof obj[key]) {
               case "bigint":
               case "boolean":
               case "number":
               case "string":
                  constants[key] = obj[key];
                  break;
               default:
                  if (isSelector(obj[key])) selectors[key] = getSelector(obj[key]);
                  else constants[key] = obj[key];
                  break;
            }
         }
         return createStructuredSelector(selectors, constants);

      case "function":
         if (isAccessorChain(config)) return Binding.get(config.toString()).value;
         return config as Selector<any>;

      default:
         return () => config;
   }
}
