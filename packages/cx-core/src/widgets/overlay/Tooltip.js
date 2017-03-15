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

   overlayDidMount(instance, component) {
      if (this.pipeMouseTrack)
         this.pipeMouseTrack((e) => {
            component.mousePosition = {
               x: e.clientX,
               y: e.clientY
            };
            this.updateDropdownPosition(instance, component);
         });

      if (this.trackMouse) {
         instance.trackMouse = (e) => {
            component.mousePosition = {
               x: e.clientX,
               y: e.clientY
            };
            this.updateDropdownPosition(instance, component);
         }
      }

      super.overlayDidMount(instance, component);

      instance.parentValidityCheckTimer = setInterval(() => {
         if (!document.body.contains(this.relatedElement) && instance.dismiss) {
            instance.dismiss();
            instance.dismiss = null;
         }
      }, 500);
   }

   overlayWillUnmount(instance, component) {
      clearInterval(instance.parentValidityCheckTimer);
      super.overlayWillUnmount(instance, component);
      if (this.pipeMouseTrack)
         this.pipeMouseTrack(null);
      instance.trackMouse = null;
   }

   handleMouseEnter(instance, component) {
      instance.mouseOver = true;
      super.handleMouseEnter(instance, component);
   }

   handleMouseLeave(instance, component) {
      instance.mouseOver = false;
      if (this.mouseTrap)
         this.handleMouseLeavesParent(instance);
      super.handleMouseLeave(instance, component);
   }

   handleMouseLeavesParent(instance) {
      if (instance.data && instance.data.alwaysVisible)
         return;

      if (!this.mouseTrap) {
         this.dismiss(instance);
      }
      else {
         setTimeout(() => {
            if (!instance.mouseOver && !instance.active)
               this.dismiss(instance);
         }, 200);
      }
   }

   dismiss(instance) {
      if (instance && instance.dismiss && (!instance.data || !instance.data.alwaysVisible)) {
         instance.dismiss();
         instance.dismiss = null;
      }
   }
}

Widget.alias('tooltip', Tooltip);

Tooltip.prototype.baseClass = 'tooltip';
Tooltip.prototype.offset = 8;
Tooltip.prototype.placementOrder = 'right up down left';
Tooltip.prototype.animate = true;
Tooltip.prototype.destroyDelay = 200;
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
      if (tooltipInstance.dismiss)
         tooltipInstance.dismiss();
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

      if (tooltip.alwaysVisible) {
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
   instance.active = true;

   if (!instance.dismiss) {
      if (!instance.pending) {
         instance.pending = true;
         setTimeout(() => {
            instance.pending = false;
            if (instance.active && document.body.contains(instance.widget.relatedElement)) {
               instance.dismiss = instance.widget.open(instance, {
                  onPipeUpdate: cb => {
                     instance.update = cb;
                  }
               });
            }
         }, 200);
      }
   } else {
      if (isTouchEvent() && instance.widget.touchBehavior == 'toggle') {
         instance.dismiss();
         instance.dismiss = null;
      }
      else if (dirty && instance.update)
         instance.update();

      if (instance.trackMouse && e && e.target)
         instance.trackMouse(e);
   }
}

export function tooltipMouseLeave(e, parentInstance, tooltip, options) {
   let instance = getTooltipInstance(e, parentInstance, tooltip, options);
   if (instance) {
      instance.active = false;
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
      if (instance.active || (instance.data && instance.data.alwaysVisible))
         tooltipMouseMove(element, parentInstance, tooltip, options);
   }
}

export function tooltipParentWillUnmount(parentInstance) {
   if (parentInstance.tooltips) {
      for (let name in parentInstance.tooltips) {
         let instance = parentInstance.tooltips[name];
         instance.active = false;
         if (instance.dismiss)
            parentInstance.tooltips[name].dismiss();
      }
   }
}