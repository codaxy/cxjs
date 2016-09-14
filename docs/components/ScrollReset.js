import {VDOM} from 'cx/ui/Widget';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {closest} from 'cx/util/DOM';

export class ScrollReset extends HtmlElement {

   declareData() {
      super.declareData(...arguments, {
         trigger: {
            structured: true
         }
      })
   }

   render(context, instance, key) {
      return <ScrollResetComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </ScrollResetComponent>
   }
}

class ScrollResetComponent extends VDOM.Component {

   shouldComponentUpdate(props) {
      return props.instance.shouldUpdate;
   }

   render() {
      var {data} = this.props.instance;
      return <div ref={el=>{this.el = el}} className={data.classNames} style={data.style}>
         {this.props.children}
      </div>
   }

   componentDidMount() {
      this.trigger = this.props.instance.data.trigger;
   }

   componentDidUpdate() {
      var trigger = this.props.instance.data.trigger;
      if (this.trigger != trigger) {
         this.trigger = trigger;
         var parent = closest(this.el, x=>x.scrollTop != 0);
         if (parent)
            parent.scrollTop = 0;
      }
   }
}
