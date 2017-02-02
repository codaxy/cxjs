import {Widget, VDOM} from '../Widget';
import {Store} from '../../data/Store';
import {Cx} from '../Cx';

export function startAppLoop(parentDOMElement, store, widget, options) {

   if (!parentDOMElement || parentDOMElement.nodeType !== 1)
      throw new Error('First argument to startAppLoop should be a valid DOM element.');

   widget = Widget.create(widget);

   if (!store)
      store = new Store();

   let root = <Cx store={store} widget={widget} options={options} subscribe={true}/>

   VDOM.DOM.render(root, parentDOMElement);

   return function () {
      VDOM.DOM.unmountComponentAtNode(parentDOMElement);
   }
}