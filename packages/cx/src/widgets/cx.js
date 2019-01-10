import {HtmlElement} from './HtmlElement';
import {VDOM} from '../ui/Widget';
import {createComponentFactory, isComponentFactory} from '../util/Component';
import {createFunctionalComponent} from '../ui/createFunctionalComponent'
import {isString} from '../util/isString';
import {isNumber} from '../util/isNumber';
import {isFunction} from '../util/isFunction';
import {isUndefined} from '../util/isUndefined';
import {isArray} from '../util/isArray';

import {flattenProps} from '../ui/flattenProps';

let htmlFactoryCache = {};

function getHtmlElementFactory(tagName) {
   let factory = htmlFactoryCache[tagName];
   if (factory)
      return factory;
   return htmlFactoryCache[tagName] = createComponentFactory(() => {}, config => HtmlElement.create(HtmlElement, {tag: tagName}, flattenProps(config)), {tag: tagName});
}

export function cx(typeName, props, ...children) {

   if (isArray(typeName))
      return typeName;

   if (isFunction(typeName) && isUndefined(props))
      return createFunctionalComponent(config => typeName(flattenProps(config)));

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

   if (isString(typeName) && typeName[0] == typeName[0].toLowerCase())
      typeName = getHtmlElementFactory(typeName);

   return {
      $type: typeName,
      $props: props,
      jsxAttributes: props && Object.keys(props),
      children
   }
}

export function react(config) {
   if (!config || isString(config) || isNumber(config) || VDOM.isValidElement(config))
      return config;

   if (isArray(config))
      return config.map(react);

   let type = config.$type;

   if (isComponentFactory(type) && type.$meta && type.$meta.tag)
      type = type.$meta.tag;

   if (isArray(config.children))
      return VDOM.createElement(type, config.$props, ...config.children.map(react));

   return VDOM.createElement(type, config.$props, react(config.children));
}