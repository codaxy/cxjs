let impl = false;

export function tooltipMouseMove(e, parentInstance, tooltip, options = {}) {
   return impl && impl.tooltipMouseMove(...args);
}

export function tooltipMouseLeave(e, parentInstance, tooltip, options) {
   return impl && impl.tooltipMouseLeave(...args);
}

export function tooltipParentDidMount(element, parentInstance, tooltip, options) {
   return impl && impl.tooltipParentDidMount(...args);
}

export function tooltipParentWillReceiveProps(element, parentInstance, tooltip, options) {
   return impl && impl.tooltipParentWillReceiveProps(...args);
}

export function tooltipParentWillUnmount(parentInstance) {
   return impl && impl.tooltipParentWillUnmount(...args);
}

export function wireTooltipOps(ops) {
   impl = ops;
}