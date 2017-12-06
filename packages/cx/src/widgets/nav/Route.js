import {Widget} from '../../ui/Widget';
import {PureContainer} from '../../ui/PureContainer';
import RouteMatcher from 'route-parser';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';
import {routeAppend} from "../../util/routeAppend";

export class Route extends PureContainer {
   init() {
      if (this.path)
         this.route = this.path;

      super.init();

      if (this.route && this.route[0] !== '+')
         this.matcher = new RouteMatcher(this.route + (this.prefix ? '(*remainder)' : ''));
   }

   initInstance(context, instance) {
      super.initInstance(context, instance);
      instance.store = new ReadOnlyDataView({
         store: instance.store
      });
      instance.setStore = store => {
         instance.store.setStore(store);
      };
   }

   declareData() {
      super.declareData(...arguments, {
         url: undefined
      });
   }

   checkVisible(context, instance, data) {

      if (!data.visible)
         return false;

      if (data.url !== instance.cached.url) {
         instance.cached.url = data.url;
         let matcher = this.matcher;
         let route = this.route;
         if (this.route[0] === '+') {
            route = routeAppend(context.lastRoute.route, this.route.substring(1));
            if (!instance.cached.matcher || instance.cached.route !== route)
               instance.cached.matcher = new RouteMatcher(route + (this.prefix ? '(*remainder)' : ''));
            matcher = instance.cached.matcher;
         }
         instance.cached.result = matcher.match(data.url);
         instance.cached.matcher = matcher;
         instance.cached.route = data.route = route;
      }
      if (!instance.cached.result)
         return false;

      return super.checkVisible(context, instance, data);
   }

   prepareData(context, {data, store, cached}) {
      super.prepareData(...arguments);

      store.setData({
         [this.recordName]: cached.result
      });

      //TODO: Replace comparison with deepEquals
      if (this.params && this.params.bind) {
         var params = store.get(this.params.bind);
         if (JSON.stringify(params) != JSON.stringify(cached.result)) {
            store.set(this.params.bind, cached.result);
         }
      }

      if (this.map) {
         for (var key in result) {
            var binding = this.map[key];
            if (binding)
               store.set(binding, result[key]);
         }
      }
   }

   explore(context, instance) {
      context.push('lastRoute', {
         route: instance.cached.route,
         result: instance.cached.result,
         reverse: function (data) {
            return instance.cached.matcher.reverse({
               ...instance.cached.result,
               remainder: '',
               ...data
            })
         }
      });
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop('lastRoute');
   }
}

Route.prototype.recordName = '$route';
Route.prototype.prefix = false;

Widget.alias('route', Route);