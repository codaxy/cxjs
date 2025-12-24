/** @jsxImportSource react */

import { Widget, VDOM } from "../../ui/Widget";
import { ContainerBase, ContainerConfig, StyledContainerBase, StyledContainerConfig } from "../../ui/Container";
import { parseStyle } from "../../util/parseStyle";
import { registerDropZone, DragDropContext, DragEvent } from "./ops";
import { findScrollableParent } from "../../util/findScrollableParent";
import { isNumber } from "../../util/isNumber";
import { getTopLevelBoundingClientRect } from "../../util/getTopLevelBoundingClientRect";
import { Instance } from "../../ui/Instance";
import { StyleProp, ClassProp, StructuredProp } from "../../ui/Prop";
import { RenderingContext } from "../../ui/RenderingContext";

export interface DropZoneConfig extends StyledContainerConfig {
   /** CSS styles to be applied when drag cursor is over the drop zone. */
   overStyle?: StyleProp;

   /** CSS styles to be applied when drag cursor is near the drop zone. */
   nearStyle?: StyleProp;

   /** CSS styles to be applied when drag operations begin used to highlight drop zones. */
   farStyle?: StyleProp;

   /** Additional CSS class to be applied when drag cursor is over the drop zone. */
   overClass?: ClassProp;

   /** Additional CSS class to be applied when drag cursor is near the drop zone. */
   nearClass?: ClassProp;

   /** Additional CSS class to be applied when drag operations begin used to highlight drop zones. */
   farClass?: ClassProp;

   /** Distance in `px` used to determine if cursor is near the dropzone. If not configured, cursor is never considered near. */
   nearDistance?: number;

   /** Bindable data related to the DropZone that might be useful inside onDrop operations. */
   data?: StructuredProp;

   /**
    * Inflate the drop zone's bounding box so it activates on cursor proximity.
    * Useful for invisible drop-zones that are only a few pixels tall/wide.
    */
   inflate?: number;

   /**
    * Inflate the drop zone's bounding box horizontally so it activates on cursor proximity.
    * Useful for invisible drop-zones that are only a few pixels tall/wide.
    */
   hinflate?: number;

   /**
    * Inflate the drop zone's bounding box vertically so it activates on cursor proximity.
    * Useful for invisible drop-zones that are only a few pixels tall/wide.
    */
   vinflate?: number;

   /** Base CSS class to be applied to the element. Defaults to 'dropzone'. */
   baseClass?: string;

   /** A callback method invoked when dragged item is finally dropped.
    The callback takes two arguments:
    * dragDropEvent - An object containing information related to the source
    * instance
    Return value is written into dragDropEvent.result and can be passed
    to the source's onDragEnd callback. */
   onDrop?: string | ((event?: DragEvent, instance?: Instance) => any);

   /** A callback method used to test if dragged item (source) is compatible
    with the drop zone. */
   onDropTest?: string | ((event?: DragEvent, instance?: Instance) => boolean);

   /** A callback method invoked when the dragged item gets close to the drop zone.
    See also `nearDistance`. */
   onDragNear?: string | ((event?: DragEvent, instance?: Instance) => void);

   /** A callback method invoked when the dragged item is dragged away. */
   onDragAway?: string | ((event?: DragEvent, instance?: Instance) => void);

   /** A callback method invoked when the dragged item is dragged over the drop zone.
    The callback is called for each `mousemove` or `touchmove` event. */
   onDragOver?: string | ((event?: DragEvent, instance?: Instance) => void);

   /** A callback method invoked when the dragged item is dragged over the drop zone
    for the first time. */
   onDragEnter?: string | ((event?: DragEvent, instance?: Instance) => void);

   /** A callback method invoked when the dragged item leaves the drop zone area. */
   onDragLeave?: string | ((event?: DragEvent, instance?: Instance) => void);

   /** A callback method invoked when at the beginning of the drag & drop operation. */
   onDragStart?: string | ((event?: DragEvent, instance?: Instance) => void);

   /** A callback method invoked when at the end of the drag & drop operation. */
   onDragEnd?: string | ((event?: DragEvent, instance?: Instance) => void);

   /** Match height of the item being dragged */
   matchHeight?: boolean;

   /** Match width of the item being dragged */
   matchWidth?: boolean;

   /** Match margin of the item being dragged */
   matchMargin?: boolean;
}

export interface DropZoneInstance extends Instance<DropZone> {}

export class DropZone extends StyledContainerBase<DropZoneConfig, DropZoneInstance> {
   declare styled: boolean;
   declare nearDistance: number;
   declare hinflate: number;
   declare vinflate: number;
   declare baseClass: string;
   declare overStyle: any;
   declare nearStyle: any;
   declare farStyle: any;
   declare inflate?: number;
   declare matchHeight?: boolean;
   declare matchWidth?: boolean;
   declare matchMargin?: boolean;
   declare onDrop?: string | ((event?: DragEvent, instance?: Instance) => any);
   declare onDropTest?: string | ((event?: DragEvent, instance?: Instance) => boolean);
   declare onDragNear?: string | ((event?: DragEvent, instance?: Instance) => void);
   declare onDragAway?: string | ((event?: DragEvent, instance?: Instance) => void);
   declare onDragOver?: string | ((event?: DragEvent, instance?: Instance) => void);
   declare onDragEnter?: string | ((event?: DragEvent, instance?: Instance) => void);
   declare onDragLeave?: string | ((event?: DragEvent, instance?: Instance) => void);
   declare onDragStart?: string | ((event?: DragEvent, instance?: Instance) => void);
   declare onDragEnd?: string | ((event?: DragEvent, instance?: Instance) => void);

   constructor(config?: DropZoneConfig) {
      super(config);
   }

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
         overClass: { structured: true },
         nearClass: { structured: true },
         farClass: { structured: true },
         overStyle: { structured: true },
         nearStyle: { structured: true },
         farStyle: { structured: true },
         data: { structured: true },
      });
   }

   render(context: RenderingContext, instance: DropZoneInstance, key: string) {
      return (
         <DropZoneComponent key={key} instance={instance}>
            {this.renderChildren(context, instance)}
         </DropZoneComponent>
      );
   }
}

DropZone.prototype.nearDistance = 0;
DropZone.prototype.hinflate = 0;
DropZone.prototype.vinflate = 0;
DropZone.prototype.baseClass = "dropzone";

Widget.alias("dropzone", DropZone);

interface DropZoneComponentProps {
   instance: DropZoneInstance;
   children?: any;
}

interface DropZoneComponentState {
   state: boolean | string;
   style?: any;
}

class DropZoneComponent extends VDOM.Component<DropZoneComponentProps, DropZoneComponentState> {
   el: HTMLElement | null = null;
   unregister?: () => void;
   declare context: any;

   constructor(props: DropZoneComponentProps) {
      super(props);
      this.state = {
         state: false,
      };
   }

   render() {
      let { instance, children } = this.props;
      let { data, widget } = instance;
      let { CSS } = widget;

      let classes = [data.classNames, CSS.state(this.state.state)];

      let stateStyle;

      switch (this.state.state) {
         case "over":
            classes.push(data.overClass);
            stateStyle = parseStyle(data.overStyle);
            break;
         case "near":
            classes.push(data.nearClass);
            stateStyle = parseStyle(data.nearStyle);
            break;
         case "far":
            classes.push(data.farClass);
            stateStyle = parseStyle(data.farStyle);
            break;
      }

      return (
         <div
            className={CSS.expand(classes)}
            style={{ ...data.style, ...this.state.style, ...stateStyle }}
            ref={(el: HTMLDivElement | null) => {
               this.el = el;
            }}
         >
            {children}
         </div>
      );
   }

   componentDidMount() {
      let dragDropOptions = this.context;
      let disabled = dragDropOptions && dragDropOptions.disabled;
      if (!disabled) this.unregister = registerDropZone(this);
   }

   componentWillUnmount() {
      this.unregister && this.unregister();
   }

   onDropTest(e: DragEvent) {
      let { instance } = this.props;
      let { widget } = instance;
      return !widget.onDropTest || instance.invoke("onDropTest", e, instance);
   }

   onDragStart(e: DragEvent) {
      this.setState({
         state: "far",
      });
   }

   onDragNear(e: DragEvent) {
      this.setState({
         state: "near",
      });
   }

   onDragAway(e: DragEvent) {
      this.setState({
         state: "far",
      });
   }

   onDragLeave(e: DragEvent) {
      let { nearDistance } = this.props.instance.widget;
      this.setState({
         state: nearDistance ? "near" : "far",
         style: null,
      });
   }

   onDragMeasure(e: DragEvent) {
      let rectOrig = getTopLevelBoundingClientRect(this.el!);
      let rect = { left: rectOrig.left, right: rectOrig.right, top: rectOrig.top, bottom: rectOrig.bottom };

      let { instance } = this.props;
      let { widget } = instance;

      let { clientX, clientY } = e.cursor;
      let distance =
         Math.max(0, rect.left - clientX, clientX - rect.right) +
         Math.max(0, rect.top - clientY, clientY - rect.bottom);

      if (widget.hinflate > 0) {
         rect.left -= widget.hinflate;
         rect.right += widget.hinflate;
      }

      if (widget.vinflate > 0) {
         rect.top -= widget.vinflate;
         rect.bottom += widget.vinflate;
      }

      let { nearDistance } = widget;

      let over = rect.left <= clientX && clientX < rect.right && rect.top <= clientY && clientY < rect.bottom;

      return {
         over:
            over && Math.abs(clientX - (rect.left + rect.right) / 2) + Math.abs(clientY - (rect.top + rect.bottom) / 2),
         near: nearDistance && (over || distance < nearDistance),
      };
   }

   onDragEnter(e: DragEvent) {
      let { instance } = this.props;
      let { widget } = instance;
      let style: any = {};

      if (widget.matchWidth) style.width = `${e.source.width}px`;

      if (widget.matchHeight) style.height = `${e.source.height}px`;

      if (widget.matchMargin) style.margin = e.source.margin.join(" ");

      if (this.state.state != "over")
         this.setState({
            state: "over",
            style,
         });
   }

   onDragOver(e: DragEvent) {}

   onGetHScrollParent() {
      return findScrollableParent(this.el!, true);
   }

   onGetVScrollParent() {
      return findScrollableParent(this.el!);
   }

   onDrop(e: DragEvent) {
      let { instance } = this.props;
      let { widget } = instance;

      if (this.state.state == "over" && widget.onDrop) instance.invoke("onDrop", e, instance);
   }

   onDragEnd(e: DragEvent) {
      this.setState({
         state: false,
         style: null,
      });
   }
}

DropZoneComponent.contextType = DragDropContext as any;
