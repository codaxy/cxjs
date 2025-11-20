/** @jsxImportSource react */
import { Instance } from "../ui/Instance";
import { NumberProp } from "../ui/Prop";
import { RenderingContext } from "../ui/RenderingContext";
import { VDOM, Widget, WidgetConfig } from "../ui/Widget";
import { captureMouseOrTouch, getCursorPos } from "./overlay/captureMouse";

export interface ResizerConfig extends WidgetConfig {
   /** Make resizer horizontal. */
   horizontal?: boolean;

   /** Use the element after the the resizer for size measurements. */
   forNextElement?: boolean;

   /** A binding for the new size. */
   size?: NumberProp;

   /** Default value that will be set when the user double click on the resizer. */
   defaultSize?: NumberProp;

   /** Minimum size of the element. */
   minSize?: NumberProp;

   /** Maximum size of the element. */
   maxSize?: NumberProp;
}

export class Resizer extends Widget<ResizerConfig> {
   declare baseClass: string;
   declare horizontal?: boolean;
   declare forNextElement?: boolean;
   declare defaultSize?: NumberProp | null;
   declare minSize?: NumberProp;
   declare maxSize?: NumberProp;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         size: undefined,
         defaultSize: undefined,
         minSize: undefined,
         maxSize: undefined,
      });
   }

   render(context: RenderingContext, instance: Instance<Resizer>, key: string): React.ReactNode {
      let { data } = instance;

      return <ResizerCmp key={key} instance={instance} data={data} />;
   }
}

Resizer.prototype.baseClass = "resizer";
Resizer.prototype.styled = true;
Resizer.prototype.horizontal = false;
Resizer.prototype.forNextElement = false;
Resizer.prototype.defaultSize = null;
Resizer.prototype.minSize = 0;
Resizer.prototype.maxSize = 1e6;

interface ResizerCmpProps {
   instance: Instance<Resizer>;
   data: Record<string, any>;
}

interface ResizerCmpState {
   dragged: boolean;
   offset: number;
   initialPosition?: { clientX: number; clientY: number };
}

class ResizerCmp extends VDOM.Component<ResizerCmpProps, ResizerCmpState> {
   el?: HTMLDivElement | null;
   hasCapture?: boolean;

   constructor(props: ResizerCmpProps) {
      super(props);
      this.state = {
         dragged: false,
         offset: 0,
      };
   }

   shouldComponentUpdate(props: ResizerCmpProps, state: ResizerCmpState): boolean {
      return state != this.state;
   }

   render(): React.ReactNode {
      let { instance, data } = this.props;
      let { widget } = instance;
      let { baseClass, CSS } = widget;

      return (
         <div
            ref={(el) => {
               this.el = el;
            }}
            className={CSS.expand(
               data.classNames,
               CSS.state({
                  vertical: !widget.horizontal,
                  horizontal: widget.horizontal,
               }),
            )}
            style={data.style}
            onDoubleClick={(e) => {
               instance.set("size", data.defaultSize);
            }}
            onMouseDown={(e) => {
               let initialPosition = getCursorPos(e);
               this.setState({ dragged: true, initialPosition });
            }}
            onMouseUp={(e) => {
               this.setState({ dragged: false });
            }}
            onMouseMove={this.startCapture.bind(this)}
            onMouseLeave={this.startCapture.bind(this)}
         >
            <div
               className={CSS.element(baseClass, "handle", { dragged: this.state.dragged })}
               style={{
                  left: !widget.horizontal ? this.state.offset : 0,
                  top: widget.horizontal ? this.state.offset : 0,
               }}
            />
         </div>
      );
   }

   startCapture(e: React.MouseEvent): void {
      let { instance } = this.props;
      let { widget } = instance;

      if (this.state.dragged && !this.hasCapture) {
         this.hasCapture = true;
         captureMouseOrTouch(
            e,
            this.onHandleMove.bind(this),
            this.onDragComplete.bind(this),
            this.state.initialPosition!,
            widget.horizontal ? "row-resize" : "col-resize",
         );
      }
   }

   onHandleMove(e: any, initialPosition: { clientX: number; clientY: number }): void {
      let { instance } = this.props;
      let { widget } = instance;
      let currentPosition = getCursorPos(e);
      const offset = !widget.horizontal
         ? currentPosition.clientX - initialPosition.clientX
         : currentPosition.clientY - initialPosition.clientY;

      let size = this.getNewSize(0);
      let newSize = this.getNewSize(offset);

      let allowedOffset = widget.forNextElement ? size - newSize : newSize - size;

      this.setState({ offset: allowedOffset });
   }

   getNewSize(offset: number): number {
      let { instance, data } = this.props;
      let { horizontal, forNextElement } = instance.widget;

      if (
         !this.el ||
         (!forNextElement && !this.el.previousElementSibling) ||
         (forNextElement && !this.el.nextElementSibling)
      )
         return 0;

      let newSize: number;

      if (horizontal) {
         if (forNextElement) newSize = (this.el.nextElementSibling as HTMLElement).offsetHeight - offset;
         else newSize = (this.el.previousElementSibling as HTMLElement).offsetHeight + offset;
      } else {
         if (forNextElement) newSize = (this.el.nextElementSibling as HTMLElement).offsetWidth - offset;
         else newSize = (this.el.previousElementSibling as HTMLElement).offsetWidth + offset;
      }

      return Math.max(data.minSize as number, Math.min(newSize, data.maxSize as number));
   }

   onDragComplete(): void {
      this.hasCapture = false;
      let { instance } = this.props;

      instance.set("size", this.getNewSize(this.state.offset));

      this.setState({
         dragged: false,
         offset: 0,
      });
   }
}
