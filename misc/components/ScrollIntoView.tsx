/** @jsxImportSource react */
import { StyledContainerBase, StyledContainerConfig, VDOM, StringProp } from "cx/ui";
import { scrollElementIntoView } from "cx/util";

export interface ScrollIntoViewConfig extends StyledContainerConfig {
   selector?: StringProp;
}

export class ScrollIntoView extends StyledContainerBase<ScrollIntoViewConfig> {
   declareData(...args: any[]) {
      super.declareData(...args, {
         selector: undefined,
      });
   }

   render(context, instance, key) {
      let { data } = instance;
      return (
         <ScrollIntoViewCmp key={key} selector={data.selector} style={data.style} className={data.classNames}>
            {this.renderChildren(context, instance)}
         </ScrollIntoViewCmp>
      );
   }
}

class ScrollIntoViewCmp extends VDOM.Component<any> {
   el: HTMLElement | null = null;

   render() {
      let { style, className, children } = this.props;
      return (
         <div ref={(el) => (this.el = el)} style={style} className={className}>
            {children}
         </div>
      );
   }

   componentDidMount() {
      this.scrollIntoView();
   }

   componentDidUpdate() {
      this.scrollIntoView();
   }

   scrollIntoView() {
      let child = this.el?.querySelector(this.props.selector);
      if (child) scrollElementIntoView(child);
   }
}
