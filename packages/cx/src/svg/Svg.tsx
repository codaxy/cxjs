/** @jsxImportSource react */
import { Widget, VDOM } from "../ui/Widget";
import { BoundedObject, BoundedObjectConfig, BoundedObjectInstance } from "./BoundedObject";
import { Rect } from "./util/Rect";
import { ResizeManager } from "../ui/ResizeManager";
import { addEventListenerWithOptions } from "../util/addEventListenerWithOptions";
import { RenderingContext } from "../ui/RenderingContext";
import { Instance } from "../ui/Instance";

interface SvgInstance extends BoundedObjectInstance {
   state: {
      size: {
         width: number;
         height: number;
      };
   };
   clipRects?: Record<string, Rect>;
   clipRectId?: number;
}

export interface SvgConfig extends BoundedObjectConfig {
   /** Set to `true` to automatically calculate width based on the measured height and `aspectRatio`. */
   autoWidth?: boolean;

   /** Set to `true` to automatically calculate height based on the measured width and `aspectRatio`. */
   autoHeight?: boolean;

   /**
    * Aspect ratio of the the SVG element. Default value is `1.618`.
    * This value doesn't have any effect unless `autoWidth` or `autoHeight` is set.
    */
   aspectRatio?: number;

   /** Base CSS class to be applied to the element. Defaults to `svg`. */
   baseClass?: string;

   onMouseDown?(e: MouseEvent, instance: SvgInstance): void;
   onMouseUp?(e: MouseEvent, instance: SvgInstance): void;
   onMouseMove?(e: MouseEvent, instance: SvgInstance): void;
   onTouchStart?(e: TouchEvent, instance: SvgInstance): void;
   onTouchMove?(e: TouchEvent, instance: SvgInstance): void;
   onTouchEnd?(e: TouchEvent, instance: SvgInstance): void;
   onWheel?(e: WheelEvent, instance: SvgInstance): void;
   onWheelActive?(e: WheelEvent, instance: SvgInstance): void;
}

export class Svg extends BoundedObject<SvgConfig, SvgInstance> {
   declare autoWidth?: boolean;
   declare autoHeight?: boolean;
   declare aspectRatio?: number;
   declare onWheelActive?: (e: WheelEvent, instance: SvgInstance) => void;

   initState(context: RenderingContext, instance: SvgInstance) {
      const size = {
         width: 0,
         height: 0,
      };
      instance.state = { size };
   }

   explore(context: RenderingContext, instance: SvgInstance) {
      context.push("inSvg", true);
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: SvgInstance) {
      context.pop("inSvg");
   }

   prepare(context: RenderingContext, instance: SvgInstance) {
      const size = instance.state.size;

      context.parentRect = new Rect({
         l: 0,
         t: 0,
         r: size.width,
         b: size.height,
      });

      instance.clipRects = {};
      instance.clipRectId = 0;
      context.push("addClipRect", (rect: Rect) => {
         const id = `clip-${instance.id}-${++instance.clipRectId!}`;
         instance.clipRects![id] = rect;
         return id;
      });
      context.push("inSvg", true);
      super.prepare(context, instance);
   }

   prepareCleanup(context: RenderingContext, instance: SvgInstance) {
      super.prepareCleanup(context, instance);
      context.pop("addClipRect");
      context.pop("inSvg");
   }

   render(context: RenderingContext, instance: SvgInstance, key: string) {
      let eventHandlers = instance.getJsxEventProps();
      if (eventHandlers) {
         delete eventHandlers["onWheelActive"];
      }
      return (
         <SvgComponent
            key={key}
            instance={instance}
            data={instance.data}
            options={context.options}
            size={instance.state.size}
            eventHandlers={eventHandlers}
         >
            {this.renderChildren(context, instance)}
         </SvgComponent>
      );
   }
}

Svg.prototype.anchors = "0 1 1 0";
Svg.prototype.baseClass = "svg";
Svg.prototype.autoWidth = false;
Svg.prototype.autoHeight = false;
Svg.prototype.aspectRatio = 1.618;

function sameSize(a: { width: number; height: number } | null, b: { width: number; height: number } | null): boolean {
   if (!a || !b) return false;

   return a.width == b.width && a.height == b.height;
}

interface SvgComponentProps {
   instance: SvgInstance;
   data: any;
   size: { width: number; height: number };
   children: any;
   eventHandlers?: any;
   options?: any;
}

class SvgComponent extends VDOM.Component<SvgComponentProps> {
   el?: HTMLDivElement;
   offResize?: () => void;
   offWheelActive?: () => void;

   render() {
      const { instance, data, size, children, eventHandlers } = this.props;
      const { widget } = instance;

      const defs: any[] = [];
      for (const k in (instance as any).clipRects) {
         let cr = (instance as any).clipRects[k];
         defs.push(
            <clipPath key={k} id={k}>
               <rect x={cr.l} y={cr.t} width={Math.max(0, cr.width())} height={Math.max(0, cr.height())} />
            </clipPath>,
         );
      }

      let style = data.style;
      if ((widget as any).autoHeight)
         style = {
            ...style,
            height: `${size.height}px`,
         };
      if ((widget as any).autoWidth)
         style = {
            ...style,
            width: `${size.width}px`,
         };

      //parent div is needed because clientWidth doesn't work on the svg element in FF

      return (
         <div
            ref={(el) => {
               this.el = el as HTMLDivElement;
            }}
            className={data.classNames}
            style={style}
            {...eventHandlers}
         >
            {size.width > 0 && size.height > 0 && (
               <svg>
                  <defs>{defs}</defs>
                  {children}
               </svg>
            )}
         </div>
      );
   }

   onResize() {
      const { instance } = this.props;
      const { widget } = this.props.instance;

      if (!this.el) return;

      let size = {
         width: this.el.clientWidth,
         height: this.el.clientHeight,
      };

      if ((widget as any).autoHeight) size.height = size.width / (widget as any).aspectRatio;

      if ((widget as any).autoWidth) size.width = size.height * (widget as any).aspectRatio;

      if (!sameSize(instance.state.size, size))
         instance.setState({
            size: size,
         });
   }

   componentDidMount() {
      if (!this.el) return;
      this.offResize = ResizeManager.trackElement(this.el, this.onResize.bind(this));
      this.onResize();
      if ((this.props.instance.widget as any).onWheelActive) {
         this.offWheelActive = addEventListenerWithOptions(
            this.el,
            "wheel",
            (event) => {
               const { instance } = this.props;
               instance.invoke("onWheelActive", event, instance);
            },
            { passive: false },
         );
      }
   }

   componentDidUpdate() {
      this.onResize();
   }

   componentWillUnmount() {
      this.offResize && this.offResize();
      this.offWheelActive && this.offWheelActive();
   }
}

Widget.alias("svg", Svg);
