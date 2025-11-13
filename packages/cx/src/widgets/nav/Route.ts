import { Widget } from "../../ui/Widget";
import { PureContainerBase, PureContainerConfig } from "../../ui/PureContainer";
import RouteMatcher from "route-parser";
import { ReadOnlyDataView } from "../../data/ReadOnlyDataView";
import { routeAppend } from "../../util/routeAppend";
import { StringProp, BooleanProp, Prop } from "../../ui/Prop";
import { RenderingContext } from "../../ui/RenderingContext";
import { Instance } from "../../ui/Instance";

export interface RouteConfig extends PureContainerConfig {
   /** Url binding. Bind this to the global `url` variable. */
   url?: StringProp;

   /** Target route, e.g. `~/user/:userId`. All routes should start with `~/`. */
   route?: string;

   /** Target route, e.g. `~/user/:userId`. All routes should start with `~/`. */
   path?: string;

   /** Name used to expose local data. Defaults to `$route`. */
   recordName?: string;

   /** Match route even if given `route` is only a prefix of the current `url`. */
   prefix?: BooleanProp;

   /** Parameters mapping */
   params?: Prop<any>;

   /** Parameter name mapping */
   map?: Record<string, string>;
}

// Base class for extending with custom Config types
export class RouteBase<Config extends RouteConfig = RouteConfig> extends PureContainerBase<Config> {
   declare url?: string;
   declare route: string;
   declare path?: string;
   declare prefix?: boolean;
   declare recordName: string;
   declare params?: Prop<any>;
   declare map?: Record<string, string>;
   declare matcher?: any;
   init() {
      if (this.path) this.route = this.path;

      super.init();

      if (this.route && this.route[0] !== "+")
         this.matcher = new RouteMatcher(this.route + (this.prefix ? "(*remainder)" : ""));
   }

   initInstance(context: RenderingContext, instance: Instance) {
      instance.store = new ReadOnlyDataView({
         store: instance.parentStore,
      });
      super.initInstance(context, instance);
   }

   applyParentStore(instance: Instance) {
      instance.store.setStore(instance.parentStore);
   }

   declareData(...args: any[]): void {
      super.declareData(...args, {
         url: undefined,
      });
   }

   checkVisible(context: RenderingContext, instance: Instance, data: any) {
      if (!data.visible) return false;

      if (data.url !== instance.cached.url) {
         instance.cached.url = data.url;
         let matcher = this.matcher;
         let route = this.route;
         if (this.route[0] === "+") {
            route = routeAppend(context.lastRoute.route, this.route.substring(1));
            if (!instance.cached.matcher || instance.cached.route !== route)
               instance.cached.matcher = new RouteMatcher(route + (this.prefix ? "(*remainder)" : ""));
            matcher = instance.cached.matcher;
         }
         instance.cached.result = matcher.match(data.url);
         instance.cached.matcher = matcher;
         instance.cached.route = data.route = route;
      }
      if (!instance.cached.result) return false;

      return super.checkVisible(context, instance, data);
   }

   prepareData(context: RenderingContext, instance: Instance) {
      super.prepareData(context, instance);

      const { store, cached } = instance;

      (store as ReadOnlyDataView).setData({
         [this.recordName]: cached.result,
      });

      //TODO: Replace comparison with deepEquals
      if (this.params && this.params.bind) {
         var params = store.get(this.params.bind);
         if (JSON.stringify(params) != JSON.stringify(cached.result)) {
            store.set(this.params.bind, cached.result);
         }
      }

      if (this.map) {
         for (var key in cached.result) {
            var binding = this.map[key];
            if (binding) store.set(binding, cached.result[key]);
         }
      }
   }

   explore(context: RenderingContext, instance: Instance) {
      context.push("lastRoute", {
         route: instance.cached.route,
         result: instance.cached.result,
         reverse: function (data: any) {
            return instance.cached.matcher.reverse({
               ...instance.cached.result,
               remainder: "",
               ...data,
            });
         },
      });
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: Instance) {
      context.pop("lastRoute");
   }
}

RouteBase.prototype.recordName = "$route";
RouteBase.prototype.prefix = false;

// Closed type for direct usage
export class Route extends RouteBase<RouteConfig> {}

Widget.alias("route", Route);
