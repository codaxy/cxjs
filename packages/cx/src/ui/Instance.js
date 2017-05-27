var instanceId = 1000;
import {Controller} from './Controller';
import {Debug, prepareFlag, renderFlag, processDataFlag, cleanupFlag, shouldUpdateFlag} from '../util/Debug';
import {GlobalCacheIdentifier} from '../util/GlobalCacheIdentifier';
import {throttle} from '../util/throttle';
import {debounce} from '../util/debounce';
import {batchUpdates} from './batchUpdates';

export class Instance {
   constructor(widget, key) {
      this.widget = widget;
      this.key = key;
      this.id = String(++instanceId);
   }

   setStore(store) {
      this.store = store;
   }

   init(context) {

      //widget is initialized when first instance is initialized
      if (!this.widget.initialized) {
         this.widget.init();
         this.widget.initialized = true;
      }

      this.cached = {};
      if (!this.dataSelector) {
         this.widget.selector.init(this.store);
         this.dataSelector = this.widget.selector.create();
      }

      if (this.widget.controller)
         this.controller = Controller.create(this.widget.controller, {
            widget: this.widget,
            instance: this,
            store: this.store
         });

      if (this.widget.helpers) {
         this.helpers = {};
         for (var cmp in this.widget.helpers) {
            var helper = this.widget.helpers[cmp];
            if (helper) {
               var ins = this.getChild(context, helper, "helper-" + cmp);
               this.helpers[cmp] = ins;
            }
         }
      }

      if (this.widget.components) {
         this.components = {};
         for (var cmp in this.widget.components) {
            var component = this.widget.components[cmp];
            if (component) {
               var ins = this.getChild(context, component, "helper-" + cmp);
               this.components[cmp] = ins;
            }
         }
      }

      this.widget.initInstance(context, this);
      this.widget.initState(context, this);
      this.initialized = true;
   }

   explore(context) {

      if (!this.initialized)
         this.init(context);

      var data = this.dataSelector(this.store.getData());
      this.visible = this.widget.checkVisible(context, this, data);

      if (!this.visible) {
         if (this.destroyTracked)
            this.instanceCache.sweep();
         delete this.instanceCache;
         return false;
      }

      if (this.instanceCache)
         this.instanceCache.mark();

      //controller may reconfigure the widget and need to go before shouldUpdate calculation
      var contextController = context.controller;
      this.parentOptions = context.parentOptions;

      if (!this.controller && context.controller) {
         this.controller = context.controller;
      }

      this.destroyTracked = false;

      if (this.controller) {
         if (this.widget.controller) {
            this.controller.explore(context);
            if (this.controller.onDestroy)
               this.trackDestroy();
         }
         context.controller = this.controller;
      }

      if (this.widget.onDestroy)
         this.trackDestroy();

      this.pure = this.widget.pure;
      this.rawData = data;

      this.shouldUpdate = this.rawData !== this.cached.rawData
         || this.cached.state !== this.state
         || this.cached.widgetVersion !== this.widget.version
         || this.cached.globalCacheIdentifier !== GlobalCacheIdentifier.get()
         || !this.widget.memoize
         || this.childStateDirty;

      if (this.shouldUpdate) {
         this.data = {...this.rawData};
         this.widget.prepareData(context, this);
         Debug.log(processDataFlag, this.widget);
      }

      if (this.helpers) {
         for (var cmp in this.helpers)
            this.helpers[cmp].explore(context);
      }

      this.widget.explore(context, this, data);

      if (this.widget.onExplore)
         this.widget.onExplore(context, this);

      if (this.widget.isContent) {
         if (context.contentPlaceholder) {
            var placeholder = context.contentPlaceholder[this.widget.putInto];
            if (placeholder)
               placeholder(this);
         }

         if (!context.content)
            context.content = {};
         context.content[this.widget.putInto] = this;
      }

      if (this.widget.outerLayout) {
         this.outerLayout = this.parent.getChild(context, this.widget.outerLayout, null, this.store);
         this.shouldRenderContent = false; //render layout until this is set
         if (!context.content)
            context.content = {};
         var body = context.content['body'];
         context.content['body'] = this;
         this.outerLayout.explore(context);
         if (this.outerLayout.shouldUpdate)
            this.shouldUpdate = true;
         context.content['body'] = body;
      }

      context.controller = contextController;

      if (this.shouldUpdate)
         this.parent.shouldUpdate = true;

      if (!this.pure)
         this.parent.pure = false;

      return true;
   }

   prepare(context) {

      if (!this.visible)
         return;

      //clear the flag here as children are going to be rendered soon
      this.childStateDirty = false;

      if (this.widget.controller && this.controller)
         this.controller.prepare(context);

      if (this.shouldUpdate || !this.pure) {

         if (this.helpers)
            for (var cmp in this.helpers) {
               var helper = this.helpers[cmp];
               helper.prepare(context);
               if (helper.shouldUpdate)
                  this.shouldUpdate = true;
            }

         Debug.log(prepareFlag, this.widget);
         this.widget.prepare(context, this);
      }

      if (this.shouldUpdate) {
         this.parent.shouldUpdate = true;
         Debug.log(shouldUpdateFlag, this.widget, this.shouldUpdate);
      }

      if (this.outerLayout && this.widget.outerLayout)
         this.outerLayout.prepare(context);
   }

   render(context, keyPrefix) {

      if (!this.visible)
         return;

      if (this.widget.isContent && !this.shouldRenderContent)
         return;

      if (this.outerLayout && this.widget.outerLayout && !this.shouldRenderContent)
         return this.outerLayout.render(context, keyPrefix);

      let vdom = this.widget.memoize && this.shouldUpdate === false && this.cached.vdom
         ? this.cached.vdom
         : renderResultFix(this.widget.render(context, this, (keyPrefix != null ? keyPrefix + '-' : '') + this.widget.widgetId));

      if (this.widget.memoize)
         this.cached.vdom = vdom;

      if (this.shouldUpdate)
         Debug.log(renderFlag, this.widget, (keyPrefix != null ? keyPrefix + '-' : '') + this.widget.widgetId);

      return vdom;
   }

   cleanup(context) {

      if (!this.visible)
         return;

      this.cached.rawData = this.rawData;
      this.cached.state = this.state;
      this.cached.widgetVersion = this.widget.version;
      this.cached.visible = true;
      this.cached.globalCacheIdentifier = GlobalCacheIdentifier.get();

      if (this.outerLayout) {
         if (this.widget.outerLayout)
            this.outerLayout.cleanup(context);
         else
            delete this.outerLayout;
      }

      if (this.pure && !this.shouldUpdate)
         return;

      Debug.log(cleanupFlag, this.widget);

      if (this.components)
         for (var cmp in this.components)
            this.components[cmp].cleanup(context);

      this.widget.cleanup(context, this);

      if (this.helpers)
         for (var cmp in this.helpers)
            this.helpers[cmp].cleanup(context);

      if (this.widget.controller && this.controller)
         this.controller.cleanup(context);

      if (this.instanceCache)
         this.instanceCache.sweep();
   }

   trackDestroy() {
      if (!this.destroyTracked) {
         this.destroyTracked = true;
         if (this.parent)
            this.parent.trackDestroyableChild(this);
      }
   }

   trackDestroyableChild(child) {
      this.instanceCache.trackDestroy(child);
      this.trackDestroy();
   }

   destroy() {
      if (this.widget.onDestroy)
         this.widget.onDestroy(instance);

      if (this.widget.controller)
         this.controller.onDestroy();
   }

   setState(state) {
      var skip = this.state;
      if (this.state)
         for (var k in state) {
            if (this.state[k] !== state[k]) {
               skip = false;
               break;
            }
         }
      if (!skip) {
         this.cached.state = this.state;
         this.state = Object.assign({}, this.state, state);
         let parent = this.parent;
         //notify all parents that child state change to bust up caching
         while (parent) {
            parent.childStateDirty = true;
            parent = parent.parent;
         }
         batchUpdates(() => {
            this.store.notify();
         });
      }
   }

   set(prop, value) {
      let setter = this.setters && this.setters[prop];
      if (setter) {
         setter(value);
         return true;
      }

      let p = this.widget[prop];
      if (p && typeof p == 'object') {
         if (p.debounce) {
            this.definePropertySetter(prop, debounce(value => this.doSet(prop, value), p.debounce));
            this.set(prop, value);
            return true;
         }

         if (p.throttle) {
            this.definePropertySetter(prop, throttle(value => this.doSet(prop, value), p.throttle));
            this.set(prop, value);
            return true;
         }
      }

      return this.doSet(prop, value);
   }

   definePropertySetter(prop, setter) {
      if (!this.setters)
         this.setters = {};
      this.setters[prop] = setter;
   }

   doSet(prop, value) {
      batchUpdates(() => {
         let p = this.widget[prop];
         if (p && typeof p == 'object') {
            if (p.set) {
               if (typeof p.set == 'function') {
                  p.set(value, this);
                  return true;
               }
               else if (typeof p.set == 'string') {
                  this.controller[p.set](value, this);
                  return true;
               }
            }
            else if (p.action) {
               let action = p.action(value, this);
               this.store.dispatch(action);
               return true;
            }
            else if (p.bind) {
               this.store.set(p.bind, value);
               return true;
            }
         }
         return false;
      });
   }

   replaceState(state) {
      this.cached.state = this.state;
      this.state = state;
      this.store.notify();
   }

   getInstanceCache() {
      if (!this.instanceCache)
         this.instanceCache = new InstanceCache(this);
      return this.instanceCache;
   }

   clearChildrenCache() {
      delete this.instanceCache;
   }

   getChild(context, widget, keyPrefix, store) {
      return this.getInstanceCache().getChild(widget, store || this.store, keyPrefix);
   }

   prepareRenderCleanupChild(widget, store, keyPrefix, options) {
      return widget.prepareRenderCleanup(store || this.store, options, keyPrefix, this);
   }

   getJsxEventProps() {
      let {widget} = this;

      if (!Array.isArray(widget.jsxAttributes))
         return null;

      let props = {};
      widget.jsxAttributes.forEach(attr => {
         let callback = widget[attr];
         if (attr.indexOf('on') == 0 && attr.length > 2 && typeof callback == 'function')
            props[attr] = e => callback.call(widget, e, this);
      });
      return props;
   }
}

function renderResultFix(res) {
   return res != null && typeof res.content != 'undefined' ? res : { content: res };
}

export class InstanceCache {

   constructor(parent) {
      this.children = {};
      this.parent = parent;
      this.marked = {};
      this.monitored = null;
   }

   getChild(widget, store, keyPrefix) {
      var key = (keyPrefix != null ? keyPrefix + '-' : '') + widget.widgetId;
      var instance = this.children[key];
      if (!instance) {
         instance = new Instance(widget, key);
         instance.parent = this.parent;
         this.children[key] = instance;
      }
      if (instance.store !== store)
         instance.setStore(store);
      this.marked[key] = instance;
      return instance;
   }

   mark() {
      this.marked = {};
   }

   trackDestroy(instance) {
      if (!this.monitored)
         this.monitored = {};
      this.monitored[instance.key] = instance;
   }

   sweep() {
      this.children = this.marked;
      if (this.monitored) {
         let activeCount = 0;
         for (let key in this.monitored) {
            let child = this.monitored[key];
            if (this.children[key] !== child || !child.visible) {
               child.destroy();
               delete this.monitored[key];
            }
            else
               activeCount++;
         }
         if (activeCount === 0)
            this.monitored = null;
      }
   }
}

