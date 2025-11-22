/** @jsxImportSource react */

import { Widget, VDOM } from "../../ui/Widget";
import { ContainerBase, ContainerConfig } from "../../ui/Container";
import { ddMouseDown, ddDetect, ddMouseUp, initiateDragDrop, isDragHandleEvent } from "./ops";
import { preventFocus } from "../../ui/FocusManager";
import { parseStyle } from "../../util/parseStyle";
import { Instance } from "../../ui/Instance";
import { StringProp, StyleProp, ClassProp, Config } from "../../ui/Prop";
import { RenderingContext } from "../../ui/RenderingContext";

export interface DragSourceConfig extends ContainerConfig {
   /**
    * Data about the drag source that can be used by drop zones to test if
    * drag source is acceptable and to perform drop operations.
    */
   data?: any;

   /**
    * Set to true to hide the element while being dragged.
    * Use if drop zones are configured to expand to indicate where drop will occur.
    */
   hideOnDrag?: boolean;

   /** Set to true to indicate that this drag source can be dragged only by using an inner DragHandle. */
   handled?: boolean;

   /** Base CSS class to be applied to the element. Defaults to 'dragsource'. */
   baseClass?: string;

   onDragStart?: (e: React.MouseEvent | React.TouchEvent, instance: Instance) => any;

   onDragEnd?: (e: React.MouseEvent | React.TouchEvent, instance: Instance) => void;

   id?: StringProp;

   /** Custom contents to be displayed during drag & drop operation. */
   clone?: Config;

   /** CSS styles to be applied to the clone of the element being dragged. */
   cloneStyle?: StyleProp;

   /** CSS styles to be applied to the element being dragged. */
   draggedStyle?: StyleProp;

   /** Additional CSS class to be applied to the clone of the element being dragged. */
   cloneClass?: ClassProp;

   /** Additional CSS class to be applied to the element being dragged. */
   draggedClass?: ClassProp;
}

export interface DragSourceInstance extends Instance<DragSource> {
   dragHandles: any[];
}

export class DragSource extends ContainerBase<DragSourceConfig, DragSourceInstance> {
   declare styled: boolean;
   declare baseClass: string;
   declare hideOnDrag: boolean;
   declare handled: boolean;
   declare data: any;
   declare clone?: Config;
   declare cloneStyle: any;
   declare draggedStyle: any;
   declare onDragStart?: (e: React.MouseEvent | React.TouchEvent, instance: DragSourceInstance) => any;
   declare onDragEnd?: (e: React.MouseEvent | React.TouchEvent, instance: DragSourceInstance) => void;

   init() {
      this.cloneStyle = parseStyle(this.cloneStyle);
      this.draggedStyle = parseStyle(this.draggedStyle);
      super.init();
   }

   declareData() {
      super.declareData(...arguments, {
         id: undefined,
         data: { structured: true },
         cloneStyle: { structured: true },
         cloneClass: { structured: true },
         draggedClass: { structured: true },
         draggedStyle: { structured: true },
      });
   }

   explore(context: RenderingContext, instance: DragSourceInstance) {
      context.push("dragHandles", (instance.dragHandles = []));
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: DragSourceInstance) {
      context.pop("dragHandles");
   }

   render(context: RenderingContext, instance: DragSourceInstance, key: string) {
      return (
         <DragSourceComponent key={key} instance={instance} handled={this.handled || instance.dragHandles.length > 0}>
            {this.renderChildren(context, instance)}
         </DragSourceComponent>
      );
   }
}

DragSource.prototype.styled = true;
DragSource.prototype.baseClass = "dragsource";
DragSource.prototype.hideOnDrag = false;
DragSource.prototype.handled = false;

Widget.alias("dragsource", DragSource);

interface DragSourceComponentProps {
   instance: DragSourceInstance;
   children?: any;
   handled: boolean;
}

interface DragSourceComponentState {
   dragged: boolean;
}

class DragSourceComponent extends VDOM.Component<DragSourceComponentProps, DragSourceComponentState> {
   declare el: HTMLElement | null;

   constructor(props: DragSourceComponentProps) {
      super(props);
      this.state = { dragged: false };
      this.beginDragDrop = this.beginDragDrop.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
   }

   setRef = (el: HTMLElement | null) => {
      this.el = el;
   };

   render() {
      let { instance, children, handled } = this.props;
      let { data, widget } = instance;
      let { CSS } = widget;

      if (this.state.dragged && widget.hideOnDrag) return null;

      let classes = [
         data.classNames,
         CSS.state({
            dragged: this.state.dragged,
            draggable: !handled,
         }),
      ];

      let style = data.style;

      if (this.state.dragged) {
         if (data.draggedClass) classes.push(data.draggedClass);
         if (data.draggedStyle)
            style = {
               ...style,
               ...data.draggedStyle,
            };
      }

      let eventHandlers: any = {
         ...instance.getJsxEventProps(),
         onTouchStart: this.onMouseDown,
         onMouseDown: this.onMouseDown,
         onTouchMove: this.onMouseMove,
         onMouseMove: this.onMouseMove,
         onTouchEnd: ddMouseUp,
         onMouseUp: ddMouseUp,
      };

      delete eventHandlers.onDragStart;
      delete eventHandlers.onDragEnd;

      return (
         <div id={data.id} ref={this.setRef} className={CSS.expand(classes)} style={style} {...eventHandlers}>
            {children}
         </div>
      );
   }

   onMouseDown(e: React.MouseEvent) {
      ddMouseDown(e);
      if (isDragHandleEvent(e) || !this.props.handled) {
         preventFocus(e); //disables text selection in Firefox
         e.stopPropagation();
      }
   }

   onMouseMove(e: React.MouseEvent) {
      if (ddDetect(e)) {
         if (isDragHandleEvent(e) || !this.props.handled) {
            this.beginDragDrop(e);
         }
      }
   }

   beginDragDrop(e: React.MouseEvent) {
      let { instance } = this.props;
      let { data, widget, store } = instance;

      if (widget.onDragStart && instance.invoke("onDragStart", e, instance) === false) return;

      initiateDragDrop(
         e,
         {
            sourceEl: this.el!,
            source: {
               store: store,
               data: data.data,
            },
            clone: {
               widget: widget.clone || widget,
               store,
               class: data.cloneClass,
               style: data.cloneStyle,
               cloneContent: !widget.clone,
               matchSize: !widget.clone,
               matchCursorOffset: !widget.clone,
            },
         },
         (e: any) => {
            this.setState({
               dragged: false,
            });
            if (widget.onDragEnd) instance.invoke("onDragEnd", e, instance);
         },
      );

      this.setState({
         dragged: true,
      });
   }
}
