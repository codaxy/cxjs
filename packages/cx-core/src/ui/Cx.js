import {Widget, VDOM} from './Widget';
import {Instance} from './Instance';

export class Cx extends VDOM.Component
{
   constructor(props) {
      super(props);

      if (props.items)
         this.widget = Widget.create(props.widget || props.items[0]);

      if (!props.parentInstance && !props.store)
         throw new Error('Neither store or parentInstance props are provided to the Cx component');
   }

   getParentInstance() {
      if (this.props.parentInstance)
         return this.props.parentInstance;

      if (this.parentInstance)
         return this.parentInstance;

      this.parentInstance = new Instance(this.widget, 0);
   }

   render() {
      if (!this.widget)
         return null;

      var parentInstance = this.getParentInstance();
      return parentInstance.prepareRenderCleanupChild(this.widget, this.props.store || parentInstance.store);
   }
}
