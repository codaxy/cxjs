import {Widget} from '../ui/Widget';
import {Store} from '../data/Store';
import {Instance} from '../ui/Instance';

export function startAppLoop(parentDOMElement, store, widget, options) {

   if (!parentDOMElement || parentDOMElement.nodeType !== 1)
      throw new Error('First argument to startAppLoop should be a valid DOM element.');

   widget = Widget.create(widget);

   if (!store)
      store = new Store();

   var parentInstance = new Instance(widget, 'root');
   parentInstance.setStore(store);

   var render = function () {
      widget.mount(parentDOMElement, store, options, parentInstance);
   };

   var renderPending = false;
   var schedule = function () {
      if (!renderPending) {
         requestAnimationFrame(() => {
            renderPending = false;
            render();
         });
         renderPending = true;
      }
   };
   let subscription = store.subscribe(schedule);
   render();
   return subscription;
}