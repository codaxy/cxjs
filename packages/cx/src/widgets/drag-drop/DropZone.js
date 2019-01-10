import {Widget, VDOM} from '../../ui/Widget';
import {Container} from '../../ui/Container';
import {parseStyle} from '../../util/parseStyle';
import {registerDropZone} from './ops';
import {findScrollableParent} from '../../util/findScrollableParent'
import {isNumber} from '../../util/isNumber';
import {getTopLevelBoundingClientRect} from "../../util/getTopLevelBoundingClientRect";

export class DropZone extends Container {

   init() {
      this.overStyle = parseStyle(this.overStyle);
      this.nearStyle = parseStyle(this.nearStyle);
      this.farStyle = parseStyle(this.farStyle);

      if (isNumber(this.inflate)) {
         this.hinflate = this.inflate;
         this.vinflate = this.inflate;
      }

      super.init();
   }

   declareData() {
      return super.declareData(...arguments, {
         overClass: {structured: true},
         nearClass: {structured: true},
         farClass: {structured: true},
         overStyle: {structured: true},
         nearStyle: {structured: true},
         farStyle: {structured: true},
         data: {structured: true}
      })
   }

   render(context, instance, key) {
      return <DropZoneComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </DropZoneComponent>
   }
}

DropZone.prototype.styled = true;
DropZone.prototype.nearDistance = 0;
DropZone.prototype.hinflate = 0;
DropZone.prototype.vinflate = 0;
DropZone.prototype.baseClass = 'dropzone';

Widget.alias('dropzone', DropZone);

class DropZoneComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         state: false
      };
   }

   render() {
      let {instance, children} = this.props;
      let {data, widget} = instance;
      let {CSS} = widget;

      let classes = [
         data.classNames,
         CSS.state(this.state.state)
      ];

      let stateStyle;

      switch (this.state.state) {
         case 'over':
            classes.push(data.overClass);
            stateStyle = parseStyle(data.overStyle);
            break;
         case 'near':
            classes.push(data.nearClass);
            stateStyle = parseStyle(data.nearStyle);
            break;
         case 'far':
            classes.push(data.farClass);
            stateStyle = parseStyle(data.farStyle);
            break;
      }

      return (
         <div
            className={CSS.expand(classes)}
            style={{...data.style, ...this.state.style, ...stateStyle}}
            ref={el => {
               this.el = el;
            }}
         >
            {children}
         </div>
      )
   }

   componentDidMount() {
      this.unregister = registerDropZone(this);
   }

   componentWillUnmount() {
      this.unregister();
   }

   onDropTest(e) {
      let {instance} = this.props;
      let {widget} = instance;
      return !widget.onDropTest || instance.invoke("onDropTest", e, instance);
   }

   onDragStart(e) {
      this.setState({
         state: 'far'
      });
   }

   onDragNear(e) {
      this.setState({
         state: 'near'
      });
   }

   onDragAway(e) {
      this.setState({
         state: 'far'
      })
   }

   onDragLeave(e) {
      let {nearDistance} = this.props.instance.widget;
      this.setState({
         state: nearDistance ? 'near' : 'far',
         style: null
      })
   }

   onDragMeasure(e) {

      let rect = getTopLevelBoundingClientRect(this.el);

      let {instance} = this.props;
      let {widget} = instance;

      let {clientX, clientY} = e.cursor;
      let distance = Math.max(0, rect.left - clientX, clientX - rect.right) + Math.max(0, rect.top - clientY, clientY - rect.bottom);

      if (widget.hinflate > 0) {
         rect.left -= widget.hinflate;
         rect.right += widget.hinflate;
      }

      if (widget.vinflate > 0) {
         rect.top -= widget.vinflate;
         rect.bottom += widget.vinflate;
      }

      let {nearDistance} = widget;

      let over = rect.left <= clientX && clientX < rect.right && rect.top <= clientY && clientY < rect.bottom;

      return {
         over: over && distance,
         near: nearDistance && (over || distance < nearDistance)
      };
   }

   onDragEnter(e) {
      let {instance} = this.props;
      let {widget} = instance;
      let style = {};

      if (widget.matchWidth)
         style.width = `${e.source.width}px`;

      if (widget.matchHeight)
         style.height = `${e.source.height}px`;

      if (widget.matchMargin)
         style.margin = e.source.margin.join(' ');

      if (this.state != 'over')
         this.setState({
            state: 'over',
            style
         });
   }

   onDragOver(e) {

   }

   onGetHScrollParent() {
      return findScrollableParent(this.el, true);
   }

   onGetVScrollParent() {
      return findScrollableParent(this.el);
   }

   onDrop(e) {
      let {instance} = this.props;
      let {widget} = instance;

      if (this.state.state == 'over' && widget.onDrop)
         instance.invoke("onDrop", e, instance);
   }

   onDragEnd(e) {
      this.setState({
         state: false,
         style: null
      });
   }
}

