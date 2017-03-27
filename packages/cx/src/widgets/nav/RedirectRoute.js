import {Widget} from '../../ui/Widget';
import {Route} from './Route';
import {History} from '../../ui/app/History';
import {Url} from '../../ui/app/Url';

export class RedirectRoute extends Route
{
   declareData() {
      super.declareData(...arguments, {
         redirect: undefined
      });
   }

   prepareData(context, instance) {
      super.prepareData(...arguments);

      var {data} = instance;

      if (data.redirect && History.store)
         History.replaceState({}, null, Url.resolve(data.redirect));
      else
         instance.set('url', data.redirect);
   }
}

Widget.alias('redirect-route', RedirectRoute);