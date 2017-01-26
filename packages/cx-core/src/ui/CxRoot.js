import {Widget, VDOM, getContent} from './Widget';
import {Instance} from './Instance';
import {RenderingContext} from './RenderingContext';

export class CxRoot extends VDOM.Component {
   constructor(props) {
      super(props);

      if (props.widget || props.items)
         this.widget = Widget.create(props.widget || props.items[0]);

      if (!props.store)
         throw new Error('Please provide the store.');

      this.store = props.store;

      this.parentInstance = new Instance(this.widget, 0);
   }

   render() {
      if (!this.widget)
         return null;

      let context = new RenderingContext(this.props.options);
      let instance = this.parentInstance.getChild(this.context, this.widget, null, this.store);

      return <Cx context={context} instance={instance}/>
   }

   componentDidMount() {
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

   componentWillUnmount() {
      this.unsubscribe();
   }
}

class Cx extends VDOM.Component {

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
