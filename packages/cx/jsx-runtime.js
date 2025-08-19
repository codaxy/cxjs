import { isArray, isFunction, isString, isUndefined } from "./util";
import { HtmlElement } from "./widgets";

export function jsx(typeName, props, key) {
   if (isArray(typeName)) return typeName;

   // if (isFunction(typeName) && isUndefined(props))
   //    return createFunctionalComponent((config) => typeName(flattenProps(config)));

   if (typeName.type || typeName.$type) return typeName;

   if (props.children && isArray(props.children) && props.children.length == 0) props.children = null;

   if (props.children && props.children.length == 1) props.children = props.children[0];

   if (typeName == "cx") return props.children;

   if (isString(typeName) && typeName[0] == typeName[0].toLowerCase()) {
      props.tag = typeName;
      typeName = HtmlElement;
   }

   return {
      $type: typeName,
      ...props,
      jsxAttributes: props && Object.keys(props),
   };
}

export const jsxs = jsx;
