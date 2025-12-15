/** @jsxImportSource react */
import { isBinding, isBindingObject } from "../../data/Binding";
import { Store } from "../../data/Store";
import { startAppLoop } from "../../ui/app/startAppLoop";
import { ContainerBase, StyledContainerConfig } from "../../ui/Container";
import { FocusManager, offFocusOut, oneFocusOut } from "../../ui/FocusManager";
import { Instance } from "../../ui/Instance";
import { BooleanProp, NumberProp } from "../../ui/Prop";
import { RenderingContext } from "../../ui/RenderingContext";
import { VDOM, Widget } from "../../ui/Widget";
import { ZIndexManager } from "../../ui/ZIndexManager";
import { addEventListenerWithOptions } from "../../util/addEventListenerWithOptions";
import { closest, isSelfOrDescendant } from "../../util/DOM";
import { getActiveElement } from "../../util/getActiveElement";
import { getTopLevelBoundingClientRect } from "../../util/getTopLevelBoundingClientRect";
import { isDataRecord } from "../../util/isDataRecord";
import { isNumber } from "../../util/isNumber";
import { KeyCode } from "../../util/KeyCode";
import { parseStyle } from "../../util/parseStyle";
import { SubscriberList } from "../../util/SubscriberList";
import { ddDetect, ddMouseDown, ddMouseUp } from "../drag-drop/ops";
import { captureMouseOrTouch, getCursorPos } from "./captureMouse";

/*
 Features:
 - renders itself on top of other elements
 - provide resizing capabilities
 - adds positioning hook and ability to position itself in the center of the page
 - provides header, body, and footer elements and updates body's height on resize (move this to Window)
 - stop mouse events from bubbling to parents, but allow keystrokes
 */

export interface OverlayConfig extends StyledContainerConfig {
   /** Set to `true` to enable resizing. */
   resizable?: BooleanProp;

   /** Set to `true` to enable dragging the overlay. */
   draggable?: BooleanProp;

   /** Base CSS class to be applied to the field. Defaults to `overlay`. */
   baseClass?: string;

   /** Width of resize handle area. */
   resizeWidth?: number;

   /** Set to `true` to initially place the overlay in the center of the page. */
   center?: boolean;

   /** Set to `true` to initially place the overlay in the center of the page horizontally. */
   centerX?: boolean;

   /** Set to `true` to initially place the overlay in the center of the page vertically. */
   centerY?: boolean;

   /** Set to `true` to add a modal backdrop which masks mouse events for the rest of the page. */
   modal?: boolean;

   /** Set to `true` to add a modal backdrop which will dismiss the window when clicked. */
   backdrop?: boolean;

   /** Set to `true` to force the element to be rendered inline, instead of being appended to the body element.
    * Inline overlays have z-index set to a very high value, to ensure they are displayed on top of the other content. */
   inline?: boolean;

   /** Set to `true` to automatically focus the top level overlay element. */
   autoFocus?: boolean;

   /** Set to `true` to automatically focus the first focusable child in the overlay. */
   autoFocusFirstChild?: boolean;

   /** Set to `true` to append the set animate state after the initial render. Appended CSS class may be used to add show/hide animations. */
   animate?: boolean;

   /** Number of milliseconds to wait, before removing the element from the DOM. Used in combination with the animate property. */
   destroyDelay?: number;

   /** Automatically dismiss overlay if it loses focus. */
   dismissOnFocusOut?: boolean;

   /** Set to true to make the top level overlay element focusable. */
   focusable?: boolean;

   /** Set to `true` to dismiss the window if the user presses the back button in the browser. */
   dismissOnPopState?: boolean;

   /** A callback function which fires while the overlay is being moved around. */
   onMove?: string | ((e: Event, instance: Instance, component: any) => void);

   /** A callback function which fires while the overlay is being resized. */
   onResize?: string | ((e: Event, instance: Instance, component: any) => void);

   /** zIndex */
   zIndex?: NumberProp;

   /** Set to `true` to make the window automatically close if Esc is pressed on the keyboard. Default value is false.*/
   closeOnEscape?: boolean;

   /** Custom CSS styling for the container element. */
   containerStyle?: string;

   /** Callback for focus out event. */
   onFocusOut?: string;

   /** Callback for mouse enter event. */
   onMouseEnter?: string;

   /** Callback for mouse leave event. */
   onMouseLeave?: string;

   /** Callback for backdrop click. */
   onBackdropClick?: string;

   /** Callback for mouse down event. */
   onMouseDown?: string;

   /** Callback for key down event. */
   onKeyDown?: string;

   /** Callback fired before dismiss. */
   onBeforeDismiss?: string | (() => boolean);

   /** Callback fired when overlay will dismiss. */
   overlayWillDismiss?: (instance: Instance, component: any) => boolean;

   /** Callback for click event. */
   onClick?: string;
}

export class OverlayInstance<WidgetType extends OverlayBase<any, any> = Overlay> extends Instance<WidgetType> {
   declare positionChangeSubscribers: SubscriberList;
   declare dismiss?: () => void;
   onBeforeDismiss?: () => boolean;
}

export class OverlayBase<
   Config extends OverlayConfig = OverlayConfig,
   InstanceType extends OverlayInstance<any> = OverlayInstance<any>,
> extends ContainerBase<Config, InstanceType> {
   // Properties declared here to support prototype assignments
   declare styled: true;
   declare baseClass: string;
   declare resizable?: BooleanProp;
   declare resizeWidth: number;
   declare center?: boolean;
   declare centerX?: boolean;
   declare centerY?: boolean;
   declare modal?: boolean;
   declare backdrop?: boolean;
   declare inline?: boolean;
   declare autoFocus?: boolean;
   declare autoFocusFirstChild?: boolean;
   declare animate?: boolean;
   declare draggable?: BooleanProp;
   declare destroyDelay?: number;
   declare dismissOnFocusOut?: boolean;
   declare focusable?: boolean;
   declare containerStyle?: string;
   declare dismissOnPopState?: boolean;
   declare closeOnEscape?: boolean;
   declare onFocusOut?: string;
   declare onMouseLeave?: string;
   declare onMouseEnter?: string;
   declare onKeyDown?: string;
   declare onMove?: string | ((e: Event, instance: Instance, component: any) => void);
   declare onResize?: string | ((e: Event, instance: Instance, component: any) => void);
   declare onClick?: string;
   declare onMouseDown?: string;
   declare onBackdropClick?: string;
   declare overlayWillDismiss?: (instance: Instance, component: any) => boolean;
   declare style?: any;
   declare pad?: boolean;

   init() {
      if (this.center) this.centerX = this.centerY = this.center;

      super.init();
   }

   declareData(...args: any[]) {
      super.declareData(...args, {
         shadowStyle: {
            structured: true,
         },
         resizable: undefined,
         draggable: undefined,
         zIndex: undefined,
      });
   }

   prepareData(context: RenderingContext, instance: InstanceType): void {
      let { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         inline: this.inline,
         modal: this.modal,
         pad: this.pad,
         resizable: data.resizable,
         draggable: data.draggable,
         animate: this.animate,
         shadow: this.modal || this.backdrop,
      };

      super.prepareData(context, instance);
   }

   initInstance(context: RenderingContext, instance: InstanceType): void {
      instance.positionChangeSubscribers = new SubscriberList();
      super.initInstance(context, instance);
   }

   explore(context: RenderingContext, instance: InstanceType): void {
      if (isBinding(this.visible)) {
         if (!instance.dismiss) {
            instance.dismiss = () => {
               if (instance.onBeforeDismiss && instance.onBeforeDismiss() === false) return;
               instance.set("visible", false);
            };
         }
      } else if (context.options.dismiss) instance.dismiss = context.options.dismiss;

      if (instance.dismiss) {
         context.push("parentOptions", {
            ...context.parentOptions,
            dismiss: instance.dismiss,
         });
      }

      if (instance.cache("dismiss", instance.dismiss)) instance.markShouldUpdate(context);

      context.push("parentPositionChangeEvent", instance.positionChangeSubscribers);

      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: InstanceType): void {
      if (instance.dismiss) context.pop("parentOptions");
      context.pop("parentPositionChangeEvent");
   }

   render(context: RenderingContext, instance: InstanceType, key: string): any {
      return (
         <OverlayComponent
            key={key}
            instance={instance}
            subscribeToBeforeDismiss={context.options.subscribeToBeforeDismiss}
            parentEl={context.options.parentEl}
         >
            {this.renderContents(context, instance)}
         </OverlayComponent>
      );
   }

   renderContents(context: RenderingContext, instance: InstanceType): any {
      return this.renderChildren(context, instance);
   }

   overlayDidMount(instance: InstanceType, component: any): void {
      let { el } = component;
      if (this.centerX) if (!el.style.left) el.style.left = `${(window.innerWidth - el.offsetWidth) / 2}px`;
      if (this.centerY)
         if (!el.style.top) el.style.top = `${Math.max(0, (window.innerHeight - el.offsetHeight) / 2)}px`;
   }

   overlayDidUpdate(instance: InstanceType, component: any): void {}

   overlayWillUnmount(instance: InstanceType, component: any): void {}

   handleFocusOut(instance: InstanceType, component: any): void {
      if (this.onFocusOut) instance.invoke("onFocusOut", instance, component);

      if (this.dismissOnFocusOut && instance.dismiss) instance.dismiss();
   }

   handleKeyDown(e: any, instance: InstanceType, component?: any): void | false {
      if (this.onKeyDown && instance.invoke("onKeyDown", e, instance, component) === false) return false;

      if (this.closeOnEscape && e.keyCode == KeyCode.esc && instance.dismiss) {
         instance.dismiss();
         e.stopPropagation();
      }
   }

   handleMouseLeave(instance: InstanceType, component: any): void {
      if (this.onMouseLeave) instance.invoke("onMouseLeave", instance, component);
   }

   handleMouseEnter(instance: InstanceType, component: any): void {
      if (this.onMouseEnter) instance.invoke("onMouseEnter", instance, component);
   }

   getOverlayContainer(): HTMLElement {
      return document.body;
   }

   containerFactory(): HTMLElement {
      let el = document.createElement("div");
      let container = this.getOverlayContainer();
      container.appendChild(el);
      el.style.position = "absolute";
      if (this.containerStyle) Object.assign(el.style, parseStyle(this.containerStyle));
      return el;
   }

   open(storeOrInstance?: Store | Instance, options?: any): () => void {
      if (!this.initialized) this.init();

      let el = this.containerFactory();
      el.style.display = "hidden";

      let beforeDismiss: (() => boolean) | null = null;
      let stop: any;

      options = {
         destroyDelay: this.destroyDelay,
         removeParentDOMElement: true,
         ...options,
         parentEl: el,
         dismiss: () => {
            if (beforeDismiss && beforeDismiss() === false) return;
            stop();
            beforeDismiss = null;
         },
         subscribeToBeforeDismiss: (cb: () => boolean) => {
            beforeDismiss = cb;
         },
      };
      options.name = options.name || "overlay";
      stop = startAppLoop(el, storeOrInstance, this, options);
      return options.dismiss;
   }

   handleMove(e: any, instance: InstanceType, component: any): void {
      let { widget } = instance;
      if (!widget.onMove || instance.invoke("onMove", e, instance, component) !== false) {
         instance.store.silently(() => {
            if (isDataRecord(this.style) && isBindingObject(this.style.top)) {
               instance.store.set(this.style.top.bind, component.el.style.top);
            }

            if (isDataRecord(this.style) && isBindingObject(this.style.left)) {
               instance.store.set(this.style.left.bind, component.el.style.left);
            }
         });
      }
      instance.positionChangeSubscribers.notify();
   }

   handleResize(e: any, instance: InstanceType, component: any): void {
      let { widget } = instance;
      if (!widget.onResize || instance.invoke("onResize", e, instance, component) !== false) {
         instance.store.silently(() => {
            if (isDataRecord(this.style) && isBindingObject(this.style.width)) {
               instance.store.set(this.style.width.bind, component.el.style.width);
            }

            if (isDataRecord(this.style) && isBindingObject(this.style.height)) {
               instance.store.set(this.style.height.bind, component.el.style.height);
            }
         });
      }
      instance.positionChangeSubscribers.notify();
   }
}

OverlayBase.prototype.styled = true;
OverlayBase.prototype.baseClass = "overlay";
OverlayBase.prototype.resizable = false;
OverlayBase.prototype.resizeWidth = 7;
OverlayBase.prototype.center = false;
OverlayBase.prototype.centerX = false;
OverlayBase.prototype.centerY = false;
OverlayBase.prototype.modal = false;
OverlayBase.prototype.backdrop = false;
OverlayBase.prototype.inline = false;
OverlayBase.prototype.autoFocus = false;
OverlayBase.prototype.autoFocusFirstChild = false;
OverlayBase.prototype.animate = false;
OverlayBase.prototype.draggable = false;
OverlayBase.prototype.destroyDelay = 0;
OverlayBase.prototype.dismissOnFocusOut = false;
OverlayBase.prototype.focusable = false;
OverlayBase.prototype.containerStyle = undefined;
OverlayBase.prototype.dismissOnPopState = false;
OverlayBase.prototype.closeOnEscape = false;

export class Overlay extends OverlayBase<OverlayConfig, OverlayInstance> {}

Widget.alias("overlay", Overlay);

interface OverlayContentProps {
   onRef: (el: HTMLDivElement | null) => void;
   className: string;
   style: any;
   tabIndex: number | undefined;
   onFocus: () => void;
   onBlur: () => void;
   onKeyDown: (e: any) => void;
   onMouseMove: (e: any, captureData?: any) => void;
   onMouseUp: (e: any) => void;
   onMouseDown: (e: any) => void;
   onTouchStart: (e: any) => void;
   onTouchEnd: (e: any) => void;
   onTouchMove: (e: any, captureData?: any) => void;
   onMouseEnter: (e: any) => void;
   onMouseLeave: (e: any) => void;
   onClick: (e: any) => void;
   onDidUpdate: () => void;
   focusableOverlayContainer?: boolean;
   children: any;
}

//TODO: all el related logic should be moved here
class OverlayContent extends VDOM.Component<OverlayContentProps, {}> {
   render() {
      return (
         <div
            ref={this.props.onRef}
            className={this.props.className}
            style={this.props.style}
            tabIndex={this.props.tabIndex}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            onKeyDown={this.props.onKeyDown}
            onMouseMove={this.props.onMouseMove}
            onMouseUp={this.props.onMouseUp}
            onMouseDown={this.props.onMouseDown}
            onTouchStart={this.props.onTouchStart}
            onTouchEnd={this.props.onTouchEnd}
            onTouchMove={this.props.onTouchMove}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
            onClick={this.props.onClick}
            data-focusable-overlay-container={this.props.focusableOverlayContainer}
         >
            {this.props.children}
         </div>
      );
   }

   componentDidUpdate() {
      this.props.onDidUpdate();
   }
}

export interface OverlayComponentProps {
   instance: OverlayInstance;
   parentEl?: HTMLElement;
   subscribeToBeforeDismiss?: (cb: () => boolean) => void;
   children: any;
}

export interface OverlayComponentState {
   animated?: boolean;
   mods?: Record<string, boolean>;
}

//TODO: This should be called OverlayPortal
export class OverlayComponent<
   Props extends OverlayComponentProps = OverlayComponentProps,
   State extends OverlayComponentState = OverlayComponentState,
> extends VDOM.Component<Props, State> {
   declare el?: HTMLElement | null;
   declare containerEl?: HTMLElement | null;
   declare ownedEl?: HTMLElement | null;
   onOverlayRef?: (el: HTMLElement | null) => void;
   declare shadowEl?: HTMLElement | null;
   declare dismissed?: boolean;
   declare unmounting?: boolean;
   onPopState?: () => void;
   unsubscribeWheelBlock?: () => void;
   declare customStyle: any;

   constructor(props: Props) {
      super(props);
      this.state = {} as State;
      this.customStyle = {};
   }

   render() {
      let { instance, parentEl } = this.props;
      let { widget } = instance;

      if (widget.inline || parentEl) return this.renderOverlay();

      if (!this.containerEl) {
         this.ownedEl = widget.containerFactory();
         this.ownedEl.style.display = "hidden";
         this.containerEl = this.ownedEl;
      }

      if (VDOM.DOM.createPortal) return VDOM.DOM.createPortal(this.renderOverlay(), this.containerEl);

      //rendered in componentDidUpdate if portals are not supported
      return null;
   }

   renderOverlay() {
      let { widget, data } = this.props.instance;
      let { CSS, baseClass } = widget;

      if (!this.onOverlayRef)
         this.onOverlayRef = (el) => {
            this.el = el;
         };

      let content = (
         <OverlayContent
            onRef={this.onOverlayRef}
            className={data.classNames}
            style={data.style}
            tabIndex={widget.focusable ? 0 : undefined}
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
            onMouseDown={this.onMouseDown.bind(this)}
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseMove={this.onMouseMove.bind(this)}
            onTouchStart={this.onMouseDown.bind(this)}
            onTouchEnd={this.onMouseUp.bind(this)}
            onTouchMove={this.onMouseMove.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
            onMouseEnter={this.onMouseEnter.bind(this)}
            onClick={this.onClick.bind(this)}
            onDidUpdate={this.overlayDidUpdate.bind(this)}
            focusableOverlayContainer={widget.dismissOnFocusOut}
         >
            {this.renderOverlayBody()}
         </OverlayContent>
      );

      let result = content;

      if (widget.modal || widget.backdrop) {
         result = (
            <div
               key="shadow"
               ref={(el) => {
                  this.shadowEl = el;
               }}
               className={CSS.element(baseClass, "shadow", {
                  animated: this.state.animated,
                  "animate-enter": this.state.animated && !this.dismissed,
                  animate: widget.animate,
               })}
               style={parseStyle(data.shadowStyle)}
            >
               <div
                  key="backdrop"
                  className={CSS.element("overlay", "modal-backdrop")}
                  onClick={this.onBackdropClick.bind(this)}
               />
               {content}
            </div>
         );
      }

      return result;
   }

   renderOverlayBody() {
      return this.props.children;
   }

   onFocus() {
      FocusManager.nudge();
      this.onFocusIn();
      if (this.el) oneFocusOut(this, this.el, this.onFocusOut.bind(this));
   }

   onBlur() {
      FocusManager.nudge();
   }

   onFocusIn() {}

   onFocusOut() {
      let { widget } = this.props.instance;
      widget.handleFocusOut(this.props.instance, this);
   }

   onMouseEnter(e: React.MouseEvent) {
      let { widget } = this.props.instance;
      widget.handleMouseEnter(this.props.instance, this);
   }

   onMouseLeave(e: React.MouseEvent) {
      let { widget } = this.props.instance;
      widget.handleMouseLeave(this.props.instance, this);
   }

   onClick(e: React.MouseEvent) {
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.onClick) instance.invoke("onClick", e, instance, this);
   }

   onKeyDown(e: React.KeyboardEvent) {
      let { widget } = this.props.instance;
      widget.handleKeyDown(e, this.props.instance, this);
   }

   getResizePrefix(e: MouseEvent | React.MouseEvent | React.TouchEvent) {
      let { widget, data } = this.props.instance;
      if (!data.resizable) return "";
      let cursor = getCursorPos(e);
      let bounds = getTopLevelBoundingClientRect(this.el!);
      let leftMargin = cursor.clientX - bounds.left;
      let rightMargin = bounds.right - cursor.clientX;
      let topMargin = cursor.clientY - bounds.top;
      let bottomMargin = bounds.bottom - cursor.clientY;
      let prefix = "";

      if (topMargin >= 0 && topMargin < widget.resizeWidth) prefix += "n";
      else if (bottomMargin >= 0 && bottomMargin < widget.resizeWidth) prefix += "s";

      if (leftMargin >= 0 && leftMargin < widget.resizeWidth) prefix += "w";
      else if (rightMargin >= 0 && rightMargin < widget.resizeWidth) prefix += "e";
      return prefix;
   }

   onMouseDown(e: React.MouseEvent | React.TouchEvent) {
      let { instance } = this.props;
      let { widget, data } = instance;

      if (widget.onMouseDown && instance.invoke("onMouseDown", e, instance) === false) return;

      let prefix = this.getResizePrefix(e);
      if (prefix) {
         //e.preventDefault();
         let rect = getTopLevelBoundingClientRect(this.el!);
         let cursor = getCursorPos(e);
         let captureData = {
            prefix: prefix,
            dl: cursor.clientX - rect.left,
            dt: cursor.clientY - rect.top,
            dr: cursor.clientX - rect.right,
            db: cursor.clientY - rect.bottom,
            rect: rect,
         };
         captureMouseOrTouch(e, this.onMouseMove.bind(this), undefined, captureData, prefix + "-resize");
      } else if (data.draggable) {
         ddMouseDown(e);
      }
      //e.stopPropagation();
   }

   onBackdropClick(e: React.MouseEvent) {
      e.stopPropagation();
      let { instance } = this.props;
      let { widget } = instance;

      if (widget.onBackdropClick) instance.invoke("onBackdropClick", e, instance);

      if (widget.backdrop) {
         if (instance.dismiss) instance.dismiss();
      } else if (widget.modal) {
         FocusManager.focus(this.el!);
      }
   }

   onMouseUp(e: React.MouseEvent | React.TouchEvent) {
      ddMouseUp();
      e.stopPropagation();
   }

   onMouseMove(e: MouseEvent, captureData: any) {
      // handle dragging
      let { instance } = this.props;
      let { data, widget } = instance;
      let detect = ddDetect(e);
      if (data.draggable && detect) {
         this.startMoveOperation(e);
         return;
      }

      if (captureData && captureData.prefix) {
         let { prefix, rect, dl, dt, dr, db } = captureData;
         let cursor = getCursorPos(e);

         if (prefix.indexOf("w") != -1)
            this.setCustomStyle({
               left: cursor.clientX - dl + "px",
               width: rect.right - cursor.clientX + dl + "px",
               right: "auto",
            });

         if (prefix.indexOf("n") != -1)
            this.setCustomStyle({
               top: cursor.clientY - dt + "px",
               height: rect.bottom - cursor.clientY + dt + "px",
               bottom: "auto",
            });

         if (prefix.indexOf("e") != -1)
            this.setCustomStyle({
               width: cursor.clientX - dr - rect.left + "px",
               left: `${rect.left}px`,
               right: "auto",
            });

         if (prefix.indexOf("s") != -1)
            this.setCustomStyle({
               height: cursor.clientY - db - rect.top + "px",
               top: `${rect.top}px`,
               bottom: "auto",
            });

         if (prefix.indexOf("w") >= 0 || prefix.indexOf("n") >= 0) widget.handleMove(e, instance, this);

         widget.handleResize(e, instance, this);
      } else {
         let prefix = this.getResizePrefix(e);
         this.setCustomStyle({
            cursor: prefix ? prefix + "-resize" : undefined,
         });
      }
   }

   startMoveOperation(e: MouseEvent | React.MouseEvent | React.TouchEvent) {
      if (this.el && !this.getResizePrefix(e)) {
         e.stopPropagation();
         let rect = getTopLevelBoundingClientRect(this.el);
         let cursor = getCursorPos(e);
         let data = {
            dx: cursor.clientX - rect.left,
            dy: cursor.clientY - rect.top,
         };

         captureMouseOrTouch(
            e,
            this.onMove.bind(this),
            undefined,
            data,
            getComputedStyle(e.target as HTMLElement).cursor,
         );
      }
   }

   onMove(e: MouseEvent, data: any) {
      if (data) {
         let cursor = getCursorPos(e);
         e.preventDefault();
         this.setCustomStyle({
            left: cursor.clientX - data.dx + "px",
            top: cursor.clientY - data.dy + "px",
            right: "auto",
            bottom: "auto",
         });

         let { instance } = this.props;
         let { widget } = instance;
         widget.handleMove(e, instance, this);
      }
   }

   onBeforeDismiss() {
      let { instance } = this.props;
      let { widget } = instance;

      if (widget.overlayWillDismiss && widget.overlayWillDismiss(instance, this) === false) return false;

      this.dismissed = true;

      //this.el might be null if visible is set to false
      if (this.el) {
         this.el.className = this.getOverlayCssClass();

         // if (widget.animate)
         //    this.setState({
         //       animated: false
         //    });
      }
      return true;
   }

   componentDidMount() {
      let { instance, subscribeToBeforeDismiss, parentEl } = this.props;
      let { widget, data } = instance;

      this.setZIndex(isNumber(data.zIndex) ? data.zIndex : ZIndexManager.next());

      this.componentDidUpdate();
      widget.overlayDidMount(instance, this);

      if (this.containerEl) this.containerEl.style.removeProperty("display");
      else if (parentEl) parentEl.style.removeProperty("display");

      let childHasFocus = isSelfOrDescendant(this.el!, getActiveElement());

      if (childHasFocus) oneFocusOut(this, this.el, this.onFocusOut.bind(this));
      else {
         if (!widget.autoFocusFirstChild || !FocusManager.focusFirstChild(this.el!))
            if (widget.focusable && widget.autoFocus) FocusManager.focus(this.el!);
      }

      instance.onBeforeDismiss = this.onBeforeDismiss.bind(this);

      if (subscribeToBeforeDismiss) {
         subscribeToBeforeDismiss(instance.onBeforeDismiss);
      }

      if (widget.animate) {
         setTimeout(() => {
            if (!this.unmounting)
               this.setState({
                  animated: true,
               });
         }, 0);
      }

      if (widget.dismissOnPopState) {
         this.onPopState = () => {
            this.props.instance.dismiss?.();
         };
         window.addEventListener("popstate", this.onPopState);
      }

      if (this.shadowEl)
         this.unsubscribeWheelBlock = addEventListenerWithOptions(
            this.shadowEl,
            "wheel",
            (e) => {
               if (e.shiftKey || e.ctrlKey) return;
               //check if there is a scrollable element within the shadow or overlay contents
               //such that its scrollbar is not at the very end
               let scrollAllowed = false;
               closest(e.target as Element, (el) => {
                  if (
                     (e.deltaY > 0 && el.scrollTop < el.scrollHeight - el.clientHeight) ||
                     (e.deltaY < 0 && el.scrollTop > 0)
                  ) {
                     scrollAllowed = true;
                     return true;
                  }
                  return el == e.currentTarget;
               });
               if (!scrollAllowed) e.preventDefault();
            },
            { passive: false },
         );
   }

   componentWillUnmount() {
      if (this.onPopState) window.removeEventListener("popstate", this.onPopState);

      if (this.unsubscribeWheelBlock) this.unsubscribeWheelBlock();

      offFocusOut(this);
      this.unmounting = true;

      let { widget } = this.props.instance;
      let { baseClass, CSS } = widget;

      // //we didn't have a chance to call onBeforeDismiss
      if (this.state.animated && this.el) {
         this.el.className = this.getOverlayCssClass();
         if (this.shadowEl)
            this.shadowEl.className = CSS.element(baseClass, "shadow", {
               animate: widget.animate,
               "animate-leave": true,
            });
      }

      widget.overlayWillUnmount(this.props.instance, this);

      if (this.ownedEl) {
         setTimeout(() => {
            if (this.ownedEl?.parentNode) this.ownedEl.parentNode.removeChild(this.ownedEl);
            this.ownedEl = null;
         }, widget.destroyDelay);
      }

      delete this.containerEl;
   }

   setZIndex(zIndex: number) {
      if (this.shadowEl) this.shadowEl.style.zIndex = zIndex.toString();
      this.setCustomStyle({
         zIndex: zIndex.toString(),
      });
   }

   setCustomStyle(style: Partial<CSSStyleDeclaration>) {
      Object.assign(this.customStyle, style);
      if (this.el) Object.assign(this.el.style, this.customStyle);
   }

   getOverlayStyle() {
      let { data } = this.props.instance;
      return {
         ...data.style,
         ...this.customStyle,
      };
   }

   setCSSState(mods: Record<string, boolean>) {
      let m: Record<string, boolean> = { ...this.state.mods };
      let changed = false;
      for (let k in mods)
         if (m[k] !== mods[k]) {
            m[k] = mods[k];
            changed = true;
         }

      if (changed)
         this.setState({
            mods: mods,
         });
   }

   getOverlayCssClass() {
      let { data, widget } = this.props.instance;
      let { CSS } = widget;

      return (
         CSS.expand(
            data.classNames,
            CSS.state({
               ...this.state.mods,
               animated: this.state.animated && !this.unmounting && !this.dismissed,
               "animate-enter": this.state.animated && !this.dismissed,
               "animate-leave": widget.animate && this.dismissed,
            }),
         ) ?? ""
      );
   }

   overlayDidUpdate() {
      if (this.el && !this.dismissed) {
         let { widget } = this.props.instance;
         widget.overlayDidUpdate(this.props.instance, this);
         this.el.className = this.getOverlayCssClass();
         Object.assign(this.el.style, this.getOverlayStyle());
      }
   }

   componentDidUpdate() {
      if (this.containerEl && !VDOM.DOM.createPortal) {
         VDOM.DOM.render(this.renderOverlay(), this.containerEl);
      }
      this.overlayDidUpdate();
   }
}
