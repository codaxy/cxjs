import type { WidgetInstance } from "../../types/instance";
import type { TooltipConfig, TooltipOptions, TooltipOperations } from "../../types/tooltip";

let impl: TooltipOperations | false = false;

export function tooltipMouseMove(
   e: MouseEvent,
   parentInstance: WidgetInstance,
   tooltip: TooltipConfig,
   options: TooltipOptions = {}
): void {
   if (impl) {
      impl.tooltipMouseMove.call(impl, e, parentInstance, tooltip, options);
   }
}

export function tooltipMouseLeave(
   e: MouseEvent,
   parentInstance: WidgetInstance,
   tooltip: TooltipConfig,
   options?: TooltipOptions
): void {
   if (impl) {
      impl.tooltipMouseLeave.call(impl, e, parentInstance, tooltip, options);
   }
}

export function tooltipParentDidMount(
   element: HTMLElement,
   parentInstance: WidgetInstance,
   tooltip: TooltipConfig,
   options?: TooltipOptions
): void {
   if (impl) {
      impl.tooltipParentDidMount.call(impl, element, parentInstance, tooltip, options);
   }
}

export function tooltipParentWillReceiveProps(
   element: HTMLElement,
   parentInstance: WidgetInstance,
   tooltip: TooltipConfig,
   options?: TooltipOptions
): void {
   if (impl) {
      impl.tooltipParentWillReceiveProps.call(impl, element, parentInstance, tooltip, options);
   }
}

export function tooltipParentWillUnmount(parentInstance: WidgetInstance): void {
   if (impl) {
      impl.tooltipParentWillUnmount.call(impl, parentInstance);
   }
}

export function tooltipParentDidUpdate(
   element: HTMLElement,
   parentInstance: WidgetInstance,
   tooltip: TooltipConfig
): void {
   if (impl) {
      impl.tooltipParentDidUpdate.call(impl, element, parentInstance, tooltip);
   }
}

export function wireTooltipOps(ops: TooltipOperations): void {
   impl = ops;
}
