import {Container, VDOM} from "cx/ui";
import {scrollElementIntoView} from "cx/util";

export class ScrollIntoView extends Container {

   selector = null;

   declareData(...args) {
      super.declareData(...args, {
         selector: undefined
      });
   }

   render(context, instance, key) {
      let {data} = instance;
      return <ScrollIntoViewCmp
         key={key}
         selector={data.selector}
         style={data.style}
         className={data.classNames}
      >
         {this.renderChildren(context, instance)}
      </ScrollIntoViewCmp>
   }
}

ScrollIntoView.prototype.styled = true;

class ScrollIntoViewCmp extends VDOM.Component {
   render() {
      let {style, className, children} = this.props;
      return <div ref={el => this.el = el} style={style} className={className}>{children}</div>
   }

   componentDidMount() {
      this.scrollIntoView();
   }

   componentDidUpdate() {
      this.scrollIntoView();
   }

   scrollIntoView() {
      let child = this.el.querySelector(this.props.selector);
      if (child)
         scrollElementIntoView(child)
   }
}