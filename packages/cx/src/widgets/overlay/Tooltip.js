import {Widget, VDOM} from '../../ui/Widget';
import {Dropdown} from './Dropdown';
import {debug, tooltipsFlag} from '../../util/Debug';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';
import {isTouchEvent} from '../../util/isTouchEvent';
import {shallowEquals} from '../../util/shallowEquals';
import {isSelector} from '../../data/isSelector';
import {wireTooltipOps} from './tooltip-ops';
import {getCursorPos} from "./captureMouse";

export class Tooltip extends Dropdown {

   declareData() {
      super.declareData(...arguments, {
         text: undefined,
         title: undefined,
         alwaysVisible: undefined
      })
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         "mouse-trap": this.mouseTrap
      }
      super.prepareData(context, instance);
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

      if (this.trackMouseX || this.trackMouseY) {
         instance.trackMouse = (e) => {
            let pos = getCursorPos(e);
            instance.mousePosition = {
               x: pos.clientX,
               y: pos.clientY
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
         if (!this.relatedElement.ownerDocument.body.contains(this.relatedElement)) {
            if (instance.dismissTooltip) {
               instance.dismissTooltip();
               instance.dismissTooltip = null;
            }
         } else {
            if (instance.tooltipComponent)
               this.updateDropdownPosition(instance, instance.tooltipComponent);
         }
      }, 500);

      if (instance.widget.globalMouseTracking && instance.trackMouse) {
         document.addEventListener('mousemove', instance.trackMouse);
      }
   }

   overlayWillUnmount(instance, component) {
      clearInterval(instance.parentValidityCheckTimer);
      super.overlayWillUnmount(instance, component);
      instance.tooltipComponent = null;

      if (instance.widget.globalMouseTracking && instance.trackMouse) {
         document.removeEventListener('mousemove', instance.trackMouse);
      }
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
      let timeout = this.mouseTrap ? 200 : 0;
      setTimeout(() => {
         if (!instance.mouseOverTarget && !(this.mouseTrap && instance.mouseOverTooltip))
            this.dismissTooltip(instance);
      }, timeout);
   }

   dismissTooltip(instance) {
      if (instance && instance.dismissTooltip) {
         if (instance.data && instance.data.alwaysVisible && this.relatedElement.ownerDocument.body.contains(this.relatedElement))
            return;
         instance.dismissTooltip();
         instance.dismissTooltip = null;
      }
   }
}

Widget.alias('tooltip', Tooltip);

Tooltip.prototype.baseClass = 'tooltip';
Tooltip.prototype.offset = 8;
Tooltip.prototype.placementOrder = 'right up down left up-right up-left right-up right-down down-right down-left left-up left-down';
Tooltip.prototype.animate = true;
Tooltip.prototype.destroyDelay = 300;
Tooltip.prototype.createDelay = 200;
Tooltip.prototype.matchWidth = false;
Tooltip.prototype.trackMouse = false;
Tooltip.prototype.trackMouseX = false;
Tooltip.prototype.trackMouseY = false;
Tooltip.prototype.touchFriendly = false; //rename to positioningMode
Tooltip.prototype.touchBehavior = 'toggle';
Tooltip.prototype.arrow = true;
Tooltip.prototype.alwaysVisible = false;
Tooltip.prototype.globalMouseTracking = false;

export function getTooltipInstance(e, parentInstance, tooltip, options = {}) {

   let target = options.target || (e && e.currentTarget) || e;

   debug(tooltipsFlag, 'mouse-move', target, parentInstance);

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
      tooltipInstance = parentInstance.tooltips[name] = parentInstance.getDetachedChild(tooltipWidget, name, store);
      tooltipInstance.config = tooltip;

      if (tooltip.alwaysVisible || tooltip.trackMouse || tooltip.trackMouseX || tooltip.trackMouseY) {
         tooltipInstance.init();
         tooltipInstance.data = tooltipInstance.dataSelector(store);
      }
   }

   return tooltipInstance;
}

function tooltipMouseMove(e, parentInstance, tooltip, options = {}) {
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
            let {relatedElement} = instance.widget;
            if (instance.mouseOverTarget && relatedElement.ownerDocument.body.contains(relatedElement)) {
               instance.dismissTooltip = instance.widget.open(instance, {
                  onPipeUpdate: cb => {
                     instance.update = cb;
                  }
               });
            }
         }, instance.widget.createDelay);
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

function tooltipMouseLeave(e, parentInstance, tooltip, options) {
   let instance = getTooltipInstance(e, parentInstance, tooltip, options);
   if (instance) {
      instance.mouseOverTarget = false;
      instance.widget.handleMouseLeavesParent(instance);
   }
}

function tooltipParentDidMount(element, parentInstance, tooltip, options) {
   if (tooltip && tooltip.alwaysVisible) {
      let instance = getTooltipInstance(element, parentInstance, tooltip, options);
      if (instance && instance.data.alwaysVisible)
         tooltipMouseMove(element, parentInstance, tooltip, options);
   }
}

function tooltipParentWillReceiveProps (element, parentInstance, tooltip, options) {
   let instance = getTooltipInstance(element, parentInstance, tooltip, options);
   if (instance && options) {
      instance.store.setData(options.data);
      if (instance.update)
         instance.update();
      if (instance.mouseOverTarget || (instance.data && instance.data.alwaysVisible))
         tooltipMouseMove(element, parentInstance, tooltip, options);
   }
}

function tooltipParentWillUnmount(parentInstance) {
   if (parentInstance.tooltips) {
      for (let name in parentInstance.tooltips) {
         let instance = parentInstance.tooltips[name];
         instance.mouseOverTarget = false;
         if (instance.dismissTooltip)
            parentInstance.tooltips[name].dismissTooltip();
      }
   }
}

export function enableTooltips() {
   wireTooltipOps({
      tooltipMouseMove,
      tooltipMouseLeave,
      tooltipParentDidMount,
      tooltipParentWillReceiveProps,
      tooltipParentWillUnmount
   });
}