import { Controller } from 'cx/ui';
import {setupGoogleAnalytics, trackPageView} from './ga';

export default class extends Controller {
   init() {
      super.init();

      setupGoogleAnalytics();

      this.addTrigger('GoogleAnalytics', ['hash'], (hash) => {
         trackPageView(`~/${hash}`);
      }, true);
   }
}
