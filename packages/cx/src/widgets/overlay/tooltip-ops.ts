import { BooleanProp, StringProp } from "../../ui/Prop";
import { Instance } from "../../ui/Instance";
import { DropdownConfig } from "./Dropdown";
import type { TooltipInstance } from "./Tooltip";

export interface TooltipConfig extends DropdownConfig {
   /** Text to be displayed inside the tooltip. */
   text?: StringProp;

   /** Text to be displayed in the header. */
   title?: StringProp;

   /**
    * Set to true to make the tooltip always visible.
    * This is useful e.g. in product tours, when instructions need to be shown, even if the mouse pointer is not around.
    */
   alwaysVisible?: BooleanProp;

   /** Base CSS class to be applied to the field. Defaults to 'tooltip'. */
   baseClass?: string;

   /**
    * Set to `true` to append the set `animate` state after the initial render.
    * Appended CSS class may be used to add show/hide animations.
    */
   animate?: boolean;

   /** Set to `true` to make the tooltip follow the mouse movement. */
   trackMouse?: boolean;

   trackMouseX?: boolean;
   trackMouseY?: boolean;

   /**
    * This property controls how tooltips behave on touch events.
    * Default value is `toggle` which means that the tooltip is shown on first tap and closed on the second tap.
    * Use `ignore` to skip showing tooltips on touch events.
    */
   touchBehavior?: string;

   /**
    * Set to true to rely on browser's window mousemove event for getting mouse coordinates
    * instead of using the element that tooltip is attached to.
    */
   globalMouseTracking?: boolean;

   /** Tooltips are hidden as soon as the mouse leaves the related widget. Set this to true to keep the tooltip
    * while the mouse is inside the tooltip itself. */
   mouseTrap?: boolean;
}

export type TooltipProp = TooltipConfig | StringProp;

/**
 * Options passed to tooltip functions
 */
export interface TooltipOptions {
   target?: Element;
   tooltipName?: string;
   data?: any;
}

export interface TooltipParentInstance {
   tooltips: { [key: string]: TooltipInstance };
}

/**
 * Tooltip operations implementation interface
 * This is the actual implementation that gets wired via wireTooltipOps
 */
export interface TooltipOperations {
   tooltipMouseMove(
      e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent | Element,
      parentInstance: Instance & TooltipParentInstance,
      tooltip: TooltipProp | undefined,
      options?: TooltipOptions,
   ): void;

   tooltipMouseLeave(
      e: MouseEvent | React.MouseEvent | Element,
      parentInstance: Instance & TooltipParentInstance,
      tooltip: TooltipProp | undefined,
      options?: TooltipOptions,
   ): void;

   tooltipParentDidMount(
      element: Element,
      parentInstance: Instance & TooltipParentInstance,
      tooltip: TooltipProp | undefined,
      options?: TooltipOptions,
   ): void;

   tooltipParentWillReceiveProps(
      element: Element,
      parentInstance: Instance & TooltipParentInstance,
      tooltip: TooltipProp | undefined,
      options?: TooltipOptions,
   ): void;

   tooltipParentWillUnmount(parentInstance: Instance & TooltipParentInstance): void;

   tooltipParentDidUpdate(
      element: Element,
      parentInstance: Instance & TooltipParentInstance,
      tooltip: TooltipProp | undefined,
   ): void;
}

let impl: TooltipOperations | false = false;

export function tooltipMouseMove(
   e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent | Element,
   parentInstance: Instance & TooltipParentInstance,
   tooltip: TooltipProp | undefined,
   options?: TooltipOptions,
): void {
   if (impl && tooltip) {
      impl.tooltipMouseMove.call(impl, e, parentInstance, tooltip, options);
   }
}

export function tooltipMouseLeave(
   e: MouseEvent | React.MouseEvent | Element,
   parentInstance: Instance & TooltipParentInstance,
   tooltip: TooltipProp | undefined,
   options?: TooltipOptions,
): void {
   if (impl && tooltip) {
      impl.tooltipMouseLeave.call(impl, e, parentInstance, tooltip, options);
   }
}

export function tooltipParentDidMount(
   element: Element,
   parentInstance: Instance & TooltipParentInstance,
   tooltip: TooltipProp | undefined,
   options?: TooltipOptions,
): void {
   if (impl) {
      impl.tooltipParentDidMount.call(impl, element, parentInstance, tooltip, options);
   }
}

export function tooltipParentWillReceiveProps(
   element: Element,
   parentInstance: Instance & TooltipParentInstance,
   tooltip: TooltipProp | undefined,
   options?: TooltipOptions,
): void {
   if (impl) {
      impl.tooltipParentWillReceiveProps.call(impl, element, parentInstance, tooltip, options);
   }
}

export function tooltipParentWillUnmount(parentInstance: Instance & TooltipParentInstance): void {
   if (impl) {
      impl.tooltipParentWillUnmount.call(impl, parentInstance);
   }
}

export function tooltipParentDidUpdate(
   element: Element,
   parentInstance: Instance & TooltipParentInstance,
   tooltip: TooltipProp | undefined,
): void {
   if (impl) {
      impl.tooltipParentDidUpdate.call(impl, element, parentInstance, tooltip);
   }
}

export function wireTooltipOps(ops: TooltipOperations): void {
   impl = ops;
}
