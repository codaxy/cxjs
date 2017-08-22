import {Component} from './Component';
import {CSSHelper} from './CSSHelper';
import './CSS';
import {StructuredSelector} from '../data/StructuredSelector';
import {debug, appDataFlag} from '../util/Debug';
import {parseStyle} from '../util/parseStyle';
import {Timing, now, appLoopFlag, vdomRenderFlag} from '../util/Timing';
import {RenderingContext} from './RenderingContext';
import {isString} from '../util/isString';
import {isDefined} from '../util/isDefined';
import {isArray} from '../util/isArray';

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
      var props = {
         visible: undefined,
         mod: {
            structured: true
         }
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
         if (ins.explore(context))
            instance.components[cmp] = ins;
      }
   }

   prepare(context, instance) {
      if (instance.components)
         for (var cmp in instance.components)
            instance.components[cmp].prepare(context);
   }

   render(context, instance, key) {
      throw new Error('render method should be overridden.');
   }

   cleanup(context, instance) { }

   update() {
      this.version = (this.version || 0) + 1;
   }

   // mount(parentDOMElement, store, options, parentInstance) {
   //    var start = now();
   //    var content = this.prepareRenderCleanup(store, options, null, parentInstance);
   //    if (content) {
   //       var render = now();
   //       VDOM.DOM.render(content, parentDOMElement);
   //       var done = now();
   //       var renderCount = Timing.count(vdomRenderFlag);
   //       Timing.log(vdomRenderFlag, renderCount, 'cx', (render - start).toFixed(2)+'ms', 'vdom', (done - render).toFixed(2)+'ms');
   //    }
   //    else
   //       VDOM.DOM.unmountComponentAtNode(parentDOMElement);
   // }

   prepareRenderCleanup(store, options, key, parentInstance) {
      var instance = parentInstance.getChild(null, this, key, store); //TODO remove context parameter
      return Widget.renderInstance(instance, options);
   }

   static renderInstance(instance, options) {
      var context;
      var start = now();
      var prepareCount = 0, changed;
      var store = instance.store;

      /* sometimes store data is changed during the prepare phase
       and in that case instead of double render only the prepare phase is executed multiple times */
      while (++prepareCount < 3) {
         changed = store.silently(() => {
            context = new RenderingContext(options);
            instance.explore(context);
            instance.prepare(context);
         });
         if (!changed || !Widget.optimizePrepare)
            break;
      }
      if (changed)
         store.notify();

      var afterPrepare = now();

      var content = getContent(instance.render(context));
      var afterRender = now();
      instance.cleanup(context);

      if (process.env.NODE_ENV !== "production") {
         var afterCleanup = now();
         var renderCount = Timing.count(appLoopFlag);
         Timing.log(appLoopFlag, renderCount, context.options.name || 'main', (afterCleanup - start).toFixed(1) + 'ms', 'prepare', (afterPrepare - start).toFixed(1), 'render', (afterRender - afterPrepare).toFixed(1), 'cleanup', (afterCleanup - afterRender).toFixed(1));
         debug(appDataFlag, store.getData());
      }
      return content;
   }

   static resetCounter() {
      widgetId = 100;
   }
}

Widget.prototype.visible = true;
Widget.prototype.memoize = true; //cache rendered content and use it if possible
Widget.prototype.pure = true; //widget does not rely on contextual data
Widget.prototype.CSS = 'cx';

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

