import { Widget } from "../../core";

import { VDOM } from "../../ui/VDOM";
import { VDOM } from "../../ui/Widget";

export class FlyweightTooltipTracker extends Widget {

   initInstance(context, instance) {
      let handler = (e) => this.handleMouseMove(e, instance);
      document.addEventListener("mousemove", handler);
      instance.subscribeOnDestroy(() => {
         document.removeEventListener("mousemove", handler);
      })
   }

   render(context, instance, key) {
      return null;
   }

   handleMouseMove(e, instance) {
      console.log('MM', e);
   }
}


