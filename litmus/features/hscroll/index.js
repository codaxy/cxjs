import {HtmlElement, Tab, Icon} from "cx/widgets";
import {VDOM, PureContainer} from 'cx/ui';

export class HScroller extends PureContainer {
   render(context, instance, key) {
      return <HScrollerComponent key={key} widget={this} data={instance.data}>
         {this.renderChildren(context, instance)}
      </HScrollerComponent>
   }
}

HScroller.prototype.styled = true;
HScroller.prototype.baseClass = "hscroll";

export class HScrollerComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.stopScrolling = () => {
         delete this.doScroll;
      };
      this.scrollLeft = ::this.scrollLeft;
      this.scrollRight = ::this.scrollRight;
   }

   render() {
      let {data, children, widget} = this.props;
      let {CSS, baseClass} = widget;

      return <div
         className={CSS.expand(data.classNames, CSS.state({ scrollable: this.state.scrollable }))}
         style={data.style}
      >
         <div
            className={CSS.element(baseClass, "left-arrow")}
            onMouseDown={this.scrollLeft}
            onTouchStart={this.scrollLeft}
            onMouseUp={this.stopScrolling}
            onTouchEnd={this.stopScrolling}
         >
            {Icon.render("drop-down", { className: CSS.element(baseClass, "icon")})}
         </div>

         <div
            className={CSS.element(baseClass, "right-arrow")}
            onMouseDown={this.scrollRight}
            onTouchStart={this.scrollRight}
            onMouseUp={this.stopScrolling}
            onTouchEnd={this.stopScrolling}
         >
            {Icon.render("drop-down", { className: CSS.element(baseClass, "icon")})}
         </div>

         <div className={CSS.element(baseClass, "clip")} ref={el => {
            this.clip = el;
         }}>
            <div className={CSS.element(baseClass, "scroller")} ref={el => {
               this.scroller = el;
            }}>
               <div className={CSS.element(baseClass, "content")} ref={el => {
                  this.content = el;
               }}>
                  {children}
               </div>
            </div>
         </div>
      </div>
   }

   componentDidMount() {
      this.componentDidUpdate();
   }

   componentDidUpdate() {
      this.scroller.style.height = `${this.content.clientHeight + 100}px`;
      this.clip.style.height = `${this.content.clientHeight}px`;
      let scrollable = this.content.scrollWidth > this.clip.clientWidth;
      if (scrollable != this.state.scrollable)
         this.setState({scrollable})
   }

   scrollLeft() {
      this.scroll("left")
   }

   scrollRight() {
      this.scroll("right")
   }

   scroll(direction) {
      this.doScroll = () => {
         if (!this.scroller)
            return;
         this.scroller.scrollLeft += direction == 'left' ? -10 : 10;
         if (this.doScroll)
            requestAnimationFrame(this.doScroll);
      };
      this.doScroll();
   }
}

export default (
   <cx>
      <div style="padding: 10px;" ws>
         <HScroller style="max-width: 400px">
            <Tab value:bind="tab" tab="1">Tab1</Tab>
            <Tab value:bind="tab" tab="2">Tab2</Tab>
            <Tab value:bind="tab" tab="3">Tab3</Tab>
            <Tab value:bind="tab" tab="4">Tab4</Tab>
            <Tab value:bind="tab" tab="5">Tab5</Tab>
            <Tab value:bind="tab" tab="6">Tab6</Tab>
            <Tab value:bind="tab" tab="7">Tab7</Tab>
            <Tab value:bind="tab" tab="8">Tab8</Tab>
            <Tab value:bind="tab" tab="9">Tab9</Tab>
            <Tab value:bind="tab" tab="10">Tab10</Tab>
         </HScroller>
      </div>
   </cx>
);
