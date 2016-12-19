import {Widget} from '../../ui/Widget';
import {PureContainer} from '../../ui/PureContainer';
import RouteMatcher from 'route-parser';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';

export class Route extends PureContainer
{
   init() {
      if (this.path)
         this.route = this.path;

      super.init();

      this.matcher = new RouteMatcher(this.route);
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
         instance.cached.result = this.matcher.match(data.url);
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
}

Route.prototype.recordName = '$route';

Widget.alias('route', Route);