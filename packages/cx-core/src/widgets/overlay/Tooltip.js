import {Widget, VDOM} from '../../ui/Widget';
import {Dropdown} from './Dropdown';
import {Debug, tooltipsFlag} from '../../util/Debug';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';
import {isTouchEvent} from '../../util/isTouchEvent';
import {shallowEquals} from '../../util/shallowEquals';
import {isSelector} from '../../data/isSelector';

export class Tooltip extends Dropdown {

   declareData() {
      super.declareData(...arguments, {
         text: undefined,
         title: undefined,
         alwaysVisible: undefined
      })
   }

   renderContents(context, instance) {
      let {data} = instance;
      let {CSS, baseClass} = this;
      return [
         data.title && <div key="title" className={CSS.element(baseClass, "title")}>{data.title}</div>,
         data.text,
         ...super.renderContents(context, instance)
      ]
   }

   initInstance(context, instance) {
      super.initInstance(context, instance);

      if (this.trackMouse) {
         instance.trackMouse = (e) => {
            instance.mousePosition = {
               x: e.clientX,
               y: e.clientY
            };
            if (instance.tooltipComponent)
               this.updateDropdownPosition(instance, instance.tooltipComponent);
         }
      }
   }

   overlayDidMount(instance, component) {
      instance.tooltipComponent = component;

      super.overlayDidMount(instance, component);

      instance.parentValidityCheckTimer = setInterval(() => {
         if (!document.body.contains(this.relatedElement) && instance.dismissTooltip) {
            instance.dismissTooltip();
            instance.dismissTooltip = null;
         }
      }, 500);
   }

   overlayWillUnmount(instance, component) {
      clearInterval(instance.parentValidityCheckTimer);
      super.overlayWillUnmount(instance, component);
      instance.tooltipComponent = null;
   }

   handleMouseEnter(instance, component) {
      instance.mouseOverTooltip = true;
      super.handleMouseEnter(instance, component);
   }

   handleMouseLeave(instance, component) {
      instance.mouseOverTooltip = false;
      if (this.mouseTrap)
         this.handleMouseLeavesParent(instance);
      super.handleMouseLeave(instance, component);
   }

   handleMouseLeavesParent(instance) {
      if (instance.data && instance.data.alwaysVisible)
         return;

      if (!this.mouseTrap) {
         this.dismissTooltip(instance);
      }
      else {
         setTimeout(() => {
            if (!instance.mouseOverTooltip && !instance.active)
               this.dismissTooltip(instance);
         }, 200);
      }
   }

   dismissTooltip(instance) {
      if (instance && instance.dismissTooltip && (!instance.data || !instance.data.alwaysVisible)) {
         instance.dismissTooltip();
         instance.dismissTooltip = null;
      }
   }
}

Widget.alias('tooltip', Tooltip);

Tooltip.prototype.baseClass = 'tooltip';
Tooltip.prototype.offset = 8;
Tooltip.prototype.placementOrder = 'right up down left';
Tooltip.prototype.animate = true;
Tooltip.prototype.destroyDelay = 300;
Tooltip.prototype.matchWidth = false;
Tooltip.prototype.trackMouse = false;
Tooltip.prototype.touchFriendly = false; //rename to positioningMode
Tooltip.prototype.touchBehavior = 'toggle';
Tooltip.prototype.arrow = true;
Tooltip.prototype.alwaysVisible = false;

export function getTooltipInstance(e, parentInstance, tooltip, options = {}) {

   let target = options.target || (e && e.currentTarget) || e;

   Debug.log(tooltipsFlag, 'mouse-move', target, parentInstance);

   let name = options.tooltipName || 'tooltip';

   if (!parentInstance.tooltips)
      parentInstance.tooltips = {};

   let tooltipInstance = parentInstance.tooltips[name];

   if (tooltipInstance && (tooltipInstance.widget.relatedElement != target || tooltipInstance.config != tooltip)) {
      if (tooltipInstance.dismissTooltip)
         tooltipInstance.dismissTooltip();
      delete parentInstance.tooltips[name];
      tooltipInstance = null;
   }

   if (!tooltip || !target)
      return;

   if (!tooltipInstance) {
      let config = tooltip;
      if (isSelector(tooltip)) {
         config = {
            text: tooltip
         };
      }
      let tooltipWidget = Tooltip.create({relatedElement: target}, config);
      let store = new ReadOnlyDataView({
         store: parentInstance.store
      });
      tooltipInstance = parentInstance.tooltips[name] = parentInstance.getChild(null, tooltipWidget, null, store);
      tooltipInstance.config = tooltip;

      if (tooltip.alwaysVisible || tooltip.trackMouse) {
         tooltipInstance.init();
         tooltipInstance.data = tooltipInstance.dataSelector(store.getData());
      }
   }

   return tooltipInstance;
}

export function tooltipMouseMove(e, parentInstance, tooltip, options = {}) {
   let instance = getTooltipInstance(e, parentInstance, tooltip, options);
   if (!instance)
      return;

   if (isTouchEvent() && instance.widget.touchBehavior == 'ignore')
      return false;

   let dirty = !shallowEquals(options.data, instance.store.data);

   instance.store.setData(options.data);
   instance.mouseOverTarget = true;

   if (!instance.dismissTooltip) {
      if (!instance.pending) {
         instance.pending = true;
         setTimeout(() => {
            instance.pending = false;
            if (instance.mouseOverTarget && document.body.contains(instance.widget.relatedElement)) {
               instance.dismissTooltip = instance.widget.open(instance, {
                  onPipeUpdate: cb => {
                     instance.update = cb;
                  }
               });
            }
         }, 200);
      }
   } else {
      if (isTouchEvent() && instance.widget.touchBehavior == 'toggle') {
         instance.dismissTooltip();
         instance.dismissTooltip = null;
      }
      else if (dirty && instance.update)
         instance.update();
   }

   if (instance.trackMouse && e && e.target)
      instance.trackMouse(e);
}

export function tooltipMouseLeave(e, parentInstance, tooltip, options) {
   let instance = getTooltipInstance(e, parentInstance, tooltip, options);
   if (instance) {
      instance.mouseOverTarget = false;
      instance.widget.handleMouseLeavesParent(instance);
   }
}

export function tooltipParentDidMount(element, parentInstance, tooltip, options) {
   if (tooltip && tooltip.alwaysVisible) {
      let instance = getTooltipInstance(element, parentInstance, tooltip, options);
      if (instance.data.alwaysVisible)
         tooltipMouseMove(element, parentInstance, tooltip, options);
   }
}

export function tooltipParentWillReceiveProps(element, parentInstance, tooltip, options) {
   let instance = getTooltipInstance(element, parentInstance, tooltip, options);
   if (instance && options) {
      instance.store.setData(options.data);
      if (instance.update)
         instance.update();
      if (instance.mouseOverTarget || (instance.data && instance.data.alwaysVisible))
         tooltipMouseMove(element, parentInstance, tooltip, options);
   }
}

export function tooltipParentWillUnmount(parentInstance) {
   if (parentInstance.tooltips) {
      for (let name in parentInstance.tooltips) {
         let instance = parentInstance.tooltips[name];
         instance.mouseOverTarget = false;
         if (instance.dismissTooltip)
            parentInstance.tooltips[name].dismissTooltip();
      }
   }
}