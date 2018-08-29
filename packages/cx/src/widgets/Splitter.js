import {Widget, VDOM} from "../ui/Widget";
import {captureMouseOrTouch, getCursorPos} from "./overlay/captureMouse";


export class Splitter extends Widget {
   declareData(...args) {
      super.declareData(...args, {
         value: undefined,
         defaultValue: undefined,
         minValue: undefined,
         maxValue: undefined
      })
   }

   render(context, instance, key) {
      let {data} = instance;

      return <SplitterCmp
         key={key}
         instance={instance}
         data={data}
      />
   }
}

Splitter.prototype.baseClass = "splitter";
Splitter.prototype.styled = true;
Splitter.prototype.horizontal = false;
Splitter.prototype.forNextElement = false;
Splitter.prototype.defaultValue = null;
Splitter.prototype.minValue = 0;
Splitter.prototype.maxValue = 1e6;

class SplitterCmp extends VDOM.Component {
   constructor(props) {
      super(props);
      this.state = {
         dragged: false,
         offset: 0
      }
   }

   shouldComponentUpdate(props, state) {
      return state != this.state;
   }

   render() {
      let {instance, data} = this.props;
      let {widget} = instance;
      let {baseClass, CSS} = widget;


      return <div
         ref={el => {
            this.el = el
         }}
         className={CSS.expand(data.classNames, CSS.state({
            vertical: !widget.horizontal,
            horizontal: widget.horizontal
         }))}
         style={data.style}
         onDoubleClick={(e) => {
            instance.set("value", data.defaultValue);
         }}
         onMouseDown={(e) => {
            let initialPosition = getCursorPos(e);
            this.setState({dragged: true, initialPosition})
         }}
         onMouseUp={(e) => {
            this.setState({dragged: false})
         }}
         onMouseMove={::this.startCapture}
         onMouseLeave={::this.startCapture}
      >
         <div
            className={CSS.element(baseClass, "handle", {dragged: this.state.dragged})}
            style={{
               left: !widget.horizontal ? this.state.offset : 0,
               top: widget.horizontal ? this.state.offset: 0,
            }}
         />
      </div>
   }

   startCapture(e) {
      let {instance} = this.props;
      let {widget} = instance;

      if (this.state.dragged && !this.hasCapture) {
         this.hasCapture = true;
         captureMouseOrTouch(e, ::this.onHandleMove, ::this.onDragComplete, this.state.initialPosition, widget.horizontal ? "row-resize" : "col-resize");
      }
   }

   onHandleMove(e, initialPosition) {
      let {instance} = this.props;
      let {widget} = instance;
      let currentPosition = getCursorPos(e);
      const offset = !widget.horizontal
         ? currentPosition.clientX - initialPosition.clientX
         : currentPosition.clientY - initialPosition.clientY;

      let size = this.getNewSize(0);
      let newSize = this.getNewSize(offset);

      let allowedOffset = widget.forNextElement ? size - newSize : newSize - size;

      this.setState({offset: allowedOffset})
   }

   getNewSize(offset) {

      let {instance, data} = this.props;
      let {horizontal, forNextElement} = instance.widget;

      if (!this.el || (!forNextElement && !this.el.previousElementSibling) || (forNextElement && !this.el.nextElementSibling))
         return 0;

      let newSize;

      if (horizontal) {
         if (forNextElement)
            newSize = this.el.nextElementSibling.offsetHeight - offset;
         else
            newSize = this.el.previousElementSibling.offsetHeight + offset;
      }
      else {
         if (forNextElement)
            newSize = this.el.nextElementSibling.offsetWidth - offset;
         else
            newSize = this.el.previousElementSibling.offsetWidth + offset;
      }

      return Math.max(data.minValue, Math.min(newSize, data.maxValue));
   }

   onDragComplete() {

      this.hasCapture = false;
      let {instance} = this.props;

      instance.set("value", this.getNewSize(this.state.offset));

      this.setState({
         dragged: false,
         offset: 0
      });
   }
}