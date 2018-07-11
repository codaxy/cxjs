import {Component} from './Component';
import {CSSHelper} from './CSSHelper';
import './CSS';
import {StructuredSelector} from '../data/StructuredSelector';
import {parseStyle} from '../util/parseStyle';
import {isString} from '../util/isString';
import {isDefined} from '../util/isDefined';
import {isArray} from '../util/isArray';
import {Console} from '../util/Console';

import {VDOM as vdom} from './VDOM';
export const VDOM = vdom;


var widgetId = 100;

export class Widget extends Component {

   constructor(config) {
      super(config);
      this.widgetId = widgetId++;

      if (isArray(this.jsxSpread)) {
         if (!this.jsxAttributes)
            this.jsxAttributes = [];

         this.jsxSpread.forEach(spread => {
            for (var key in spread) {
               this[key] = spread[key];
               this.jsxAttributes.push(key);
            }
         })
      }
   }

   init() {
      if (this.styles)
      this.style = this.styles;

      if (this.styled)
         this.style = parseStyle(this.style);
      else if (this.style) {
         Console.warn('Components that allow use of the style attribute should set styled = true on their prototype. This will be an error in future versions.');
         this.style = parseStyle(this.style);
         this.styled = true;
      }

      if (typeof this.if !== 'undefined')
         this.visible = this.if;

      this.declareData();

      if (this.outerLayout) {
         if (isArray(this.outerLayout))
            throw new Error('Only single element outer layout is supported.');
         //TODO: better handle the case when outer layout is an array. How to get around circular dependency to PureContainer
         this.outerLayout = Widget.create(this.outerLayout);
      }

      if (this.contentFor)
         this.putInto = this.contentFor;

      if (this.putInto)
         this.isContent = true;

      if (isString(this.CSS))
         this.CSS = CSSHelper.get(this.CSS);

      this.initHelpers();
      this.initComponents();

      this.initialized = true;
   }

   initComponents() {
      if (arguments.length > 0) {
         this.components = Object.assign(...arguments);
         for (var k in this.components)
            if (!this.components[k])
               delete this.components[k];
      }
   }

   initHelpers() {
      if (arguments.length > 0) {
         this.helpers = Object.assign(...arguments);
      }
   }

   declareData() {
      let options = {};

      if (this.styled)
         options.class = options.className = options.style = {structured: true};

      var props = {
         visible: undefined,
         mod: {
            structured: true
         },
         ...options
      };

      Object.assign(props, ...arguments);
      this.selector = new StructuredSelector({props: props, values: this});
      this.nameMap = this.selector.nameMap;
   }

   prepareCSS(context, {data}) {
      data.classNames = this.CSS.expand(
         this.CSS.block(this.baseClass, data.mod, data.stateMods),
         data.class,
         data.className
      );
      data.style = parseStyle(data.style);
   }

   prepareData(context, instance) {
      if (this.styled)
         this.prepareCSS(context, instance);
   }

   initInstance(context, instance) {
      if (this.onInit)
         this.onInit(context, instance)
   }

   initState(context, instance) {}

   checkVisible(context, instance, data) {
      return data.visible;
   }

   explore(context, instance) {
      if (this.components)
         instance.components = {};
      for (let cmp in this.components) {
         let ins = instance.getChild(context, this.components[cmp], "cmp-" + cmp, instance.store);
         if (ins.scheduleExploreIfVisible(context))
            instance.components[cmp] = ins;
      }
   }

   render(context, instance, key) {
      throw new Error("Widget's render method should be overridden. This error can happen if you forgot to import the component before using it.");
   }

   update() {
      this.version = (this.version || 0) + 1;
   }

   static resetCounter() {
      widgetId = 100;
   }
}

Widget.prototype.visible = true;
Widget.prototype.memoize = true; //cache rendered content and use it if possible
Widget.prototype.CSS = 'cx';
Widget.prototype.styled = false;

Widget.namespace = 'ui.';
Widget.lazyInit = true;
Widget.optimizePrepare = true;

Widget.factory = (type, config, more) => 
{
   throw new Error(`Invalid widget type: ${type}.`);
};

export function contentAppend(result, w, prependSpace) {
   if (w == null || w === false)
      return false;
   if (isArray(w))
      w.forEach(c => contentAppend(result, c));
   else if (isDefined(w.content) && !w.atomic)
      return contentAppend(result, w.content);
   else {
      if (prependSpace)
         result.push(' ');
      result.push(w);
   }
   return true;
}

export function getContentArray(x) {
   let result = [];
   contentAppend(result, x);
   return result;
}


export function getContent(x) {
   let result = getContentArray(x);
   if (result.length == 0)
      return null;
   if (result.length == 1)
      return result[0];
   return result;
}

