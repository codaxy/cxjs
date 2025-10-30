import { Instance } from "../../ui/Instance";

/**
 * Tooltip configuration - can be a string or complex config object
 */
export type TooltipConfig = string | TooltipConfigObject;

export interface TooltipConfigObject {
   text?: string;
   title?: string;
   placement?: "top" | "bottom" | "left" | "right";
   offset?: number;
   [key: string]: unknown;
}

/**
 * Options passed to tooltip functions
 */
export interface TooltipOptions {
   mouseOverCheck?: boolean;
   [key: string]: unknown;
}

/**
 * Tooltip operations implementation interface
 * This is the actual implementation that gets wired via wireTooltipOps
 */
export interface TooltipOperations {
   tooltipMouseMove(
      e: React.MouseEvent,
      parentInstance: Instance,
      tooltip: TooltipConfig,
      options?: TooltipOptions
   ): void;

   tooltipMouseLeave(
      e: React.MouseEvent,
      parentInstance: Instance,
      tooltip: TooltipConfig,
      options?: TooltipOptions
   ): void;

   tooltipParentDidMount(
      element: HTMLElement,
      parentInstance: Instance,
      tooltip: TooltipConfig,
      options?: TooltipOptions
   ): void;

   tooltipParentWillReceiveProps(
      element: HTMLElement,
      parentInstance: Instance,
      tooltip: TooltipConfig,
      options?: TooltipOptions
   ): void;

   tooltipParentWillUnmount(parentInstance: Instance): void;

   tooltipParentDidUpdate(element: HTMLElement, parentInstance: Instance, tooltip: TooltipConfig): void;
}

let impl: TooltipOperations | false = false;

export function tooltipMouseMove(
   e: React.MouseEvent,
   parentInstance: Instance,
   tooltip: TooltipConfig,
   options: TooltipOptions = {}
): void {
   if (impl) {
      impl.tooltipMouseMove.call(impl, e, parentInstance, tooltip, options);
   }
}

export function tooltipMouseLeave(
   e: React.MouseEvent,
   parentInstance: Instance,
   tooltip: TooltipConfig,
   options?: TooltipOptions
): void {
   if (impl) {
      impl.tooltipMouseLeave.call(impl, e, parentInstance, tooltip, options);
   }
}

export function tooltipParentDidMount(
   element: HTMLElement,
   parentInstance: Instance,
   tooltip: TooltipConfig,
   options?: TooltipOptions
): void {
   if (impl) {
      impl.tooltipParentDidMount.call(impl, element, parentInstance, tooltip, options);
   }
}

export function tooltipParentWillReceiveProps(
   element: HTMLElement,
   parentInstance: Instance,
   tooltip: TooltipConfig,
   options?: TooltipOptions
): void {
   if (impl) {
      impl.tooltipParentWillReceiveProps.call(impl, element, parentInstance, tooltip, options);
   }
}

export function tooltipParentWillUnmount(parentInstance: Instance): void {
   if (impl) {
      impl.tooltipParentWillUnmount.call(impl, parentInstance);
   }
}

export function tooltipParentDidUpdate(
   element: HTMLElement,
   parentInstance: Instance,
   tooltip: TooltipConfig
): void {
   if (impl) {
      impl.tooltipParentDidUpdate.call(impl, element, parentInstance, tooltip);
   }
}

export function wireTooltipOps(ops: TooltipOperations): void {
   impl = ops;
}
