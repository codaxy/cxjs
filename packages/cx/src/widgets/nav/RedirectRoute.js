import {Widget} from '../../ui/Widget';
import {Route} from './Route';
import {History} from '../../ui/app/History';
import {Url} from '../../ui/app/Url';
import {routeAppend} from "../../util/routeAppend";

export class RedirectRoute extends Route
{
   checkVisible(context, instance, data) {

      if (!data.visible)
         return false;

      if (!data.url && !data.route)
         return true;

      return super.checkVisible(context, instance, data);
   }

   declareData() {
      super.declareData(...arguments, {
         redirect: undefined
      });
   }

   prepareData(context, instance) {
      super.prepareData(...arguments);

      var {data} = instance;

      if (data.redirect && data.redirect[0] === '+')
         data.redirect = routeAppend(context.lastRoute.reverse(), data.redirect.substring(1));

      if (data.redirect && History.store)
         History.replaceState({}, null, Url.resolve(data.redirect));
      else
         instance.set('url', data.redirect);
   }
}

Widget.alias('redirect-route', RedirectRoute);