import type { WidgetInstance } from "./instance";

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
      e: MouseEvent,
      parentInstance: WidgetInstance,
      tooltip: TooltipConfig,
      options?: TooltipOptions
   ): void;

   tooltipMouseLeave(
      e: MouseEvent,
      parentInstance: WidgetInstance,
      tooltip: TooltipConfig,
      options?: TooltipOptions
   ): void;

   tooltipParentDidMount(
      element: HTMLElement,
      parentInstance: WidgetInstance,
      tooltip: TooltipConfig,
      options?: TooltipOptions
   ): void;

   tooltipParentWillReceiveProps(
      element: HTMLElement,
      parentInstance: WidgetInstance,
      tooltip: TooltipConfig,
      options?: TooltipOptions
   ): void;

   tooltipParentWillUnmount(parentInstance: WidgetInstance): void;

   tooltipParentDidUpdate(element: HTMLElement, parentInstance: WidgetInstance, tooltip: TooltipConfig): void;
}
