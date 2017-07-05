let impl = false;

export function tooltipMouseMove(e, parentInstance, tooltip, options = {}) {
   return impl && impl.tooltipMouseMove.apply(impl, arguments);
}

export function tooltipMouseLeave(e, parentInstance, tooltip, options) {
   return impl && impl.tooltipMouseLeave.apply(impl, arguments);
}

export function tooltipParentDidMount(element, parentInstance, tooltip, options) {
   return impl && impl.tooltipParentDidMount.apply(impl, arguments);
}

export function tooltipParentWillReceiveProps(element, parentInstance, tooltip, options) {
   return impl && impl.tooltipParentWillReceiveProps.apply(impl, arguments);
}

export function tooltipParentWillUnmount(parentInstance) {
   return impl && impl.tooltipParentWillUnmount.apply(impl, arguments);
}

export function wireTooltipOps(ops) {
   impl = ops;
}