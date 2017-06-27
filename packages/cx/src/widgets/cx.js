import {HtmlElement} from './HtmlElement';
import {VDOM} from '../ui/Widget';

export function cx(typeName, props, ...children) {

   if (Array.isArray(typeName))
      return typeName;

   if (typeof typeName === "function") {
      if (props === undefined) {
         typeName.$cx = true;
         return typeName;
      }
      else if (typeName.$cx && props)
         return cx(typeName({
            ...props,
            children
         }));
   }

   if (typeName.type || typeName.$type)
      return typeName;

   if (children && children.length == 0)
      children = null;

   if (children && children.length == 1)
      children = children[0];

   if (typeName == 'cx')
      return children;

   if (typeName == 'react')
      return react(children);

   if (typeof typeName == 'string' && typeName[0] == typeName[0].toLowerCase()) {
      props = {
         ...props,
         tag: typeName
      };
      typeName = HtmlElement;
   }

   return {
      $type: typeName,
      $props: props,
      jsxAttributes: props && Object.keys(props),
      items: children
   }
}

export function react(config) {
   if (!config || typeof config == 'string' || typeof config == 'number')
      return config;

   if (Array.isArray(config))
      return config.map(react);

   let type = config.$type;

   if (type === HtmlElement) {
      type = config.$props.tag;
      delete config.$props.tag;
   }

   return VDOM.createElement(type, config.$props, react(config.items));
}