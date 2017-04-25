import {HtmlElement} from './HtmlElement';
import {VDOM} from '../ui/Widget';

export function cx(typeName, props, ...children) {

   if (Array.isArray(typeName))
      return typeName;

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
   if (config == null)
      return config;

   if (Array.isArray(config))
      return config.map(config);

   return VDOM.createElement(config.$type, config.$props, react(config.items));
}