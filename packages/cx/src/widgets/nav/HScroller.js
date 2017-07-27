import {Icon} from "../Icon";
import {VDOM} from '../../ui/Widget';
import {PureContainer} from '../../ui/PureContainer';
import {ResizeManager} from '../../ui/ResizeManager';

export class HScroller extends PureContainer {
   render(context, instance, key) {
      return <HScrollerComponent key={key} widget={this} data={instance.data}>
         {this.renderChildren(context, instance)}
      </HScrollerComponent>
   }
}

HScroller.prototype.styled = true;
HScroller.prototype.baseClass = "hscroller";

export class HScrollerComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.stopScrolling = () => {
         delete this.doScroll;
      };
      this.scrollLeft = ::this.scrollLeft;
      this.scrollRight = ::this.scrollRight;
      this.state = { scrollable: false };
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
      this.unsubscribeResize = ResizeManager.subscribe(::this.componentDidUpdate);
      this.componentDidUpdate();
   }

   componentDidUpdate() {
      this.scroller.style.height = `${this.content.clientHeight + 100}px`;
      this.clip.style.height = `${this.content.clientHeight}px`;
      let scrollable = this.content.scrollWidth > this.clip.clientWidth;
      if (scrollable != this.state.scrollable)
         this.setState({scrollable})
   }

   componentWillUnmount() {
      this.unsubscribeResize();
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