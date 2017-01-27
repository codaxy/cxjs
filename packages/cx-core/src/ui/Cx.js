import {Widget, VDOM, getContent} from './Widget';
import {Instance} from './Instance';
import {RenderingContext} from './RenderingContext';

export class Cx extends VDOM.Component {
   constructor(props) {
      super(props);

      this.widget = Widget.create(props.widget || props.items[0]);

      if (this.props.parentInstance) {
         this.parentInstance = this.props.parentInstance;
         this.store = this.parentInstance.store;
      }
      else {
         this.parentInstance = new Instance(this.widget, 0);
         this.store = props.store;
      }

      if (!this.store)
         throw new Error('Cx component requires store.');
   }

   render() {
      if (!this.widget)
         return null;

      let context = new RenderingContext(this.props.options);
      let instance = this.parentInstance.getChild(this.context, this.widget, null, this.store);

      return <CxProps context={context} instance={instance}/>
   }

   componentDidMount() {
      if (this.props.subscribe) {
         this.unsubscribe = this.store.subscribe(() => {
            if (VDOM.DOM.unstable_batchedUpdates) {
               VDOM.DOM.unstable_batchedUpdates(() => {
                  this.setState({data: this.store.getData()});
               })
            }
            else
               this.setState({data: this.store.getData()});
         });
      }
   }

   componentWillUnmount() {
      if (this.unsubscribe)
         this.unsubscribe();
   }
}

Cx.prototype.subscribe = false;

class CxProps extends VDOM.Component {

   constructor(props) {
      super(props);
      this.componentWillReceiveProps(props);
   }

   componentWillReceiveProps(props) {
      let {context, instance} = props;
      if (instance.explore(context))
         instance.prepare(context);
   }

   render() {
      let {context, instance} = this.props;
      let result = instance.render(context);
      return getContent(result);
   }

   componentDidUpdate() {
      let {context, instance} = this.props;
      instance.cleanup(context);
   }
}
