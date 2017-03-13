import {Widget, VDOM} from '../../ui/Widget';
import {Dropdown} from './Dropdown';
import {Debug, tooltipsFlag} from '../../util/Debug';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';
import {isTouchEvent} from '../../util/isTouchEvent';

export class Tooltip extends Dropdown {

   declareData() {
      super.declareData(...arguments, {
         text: undefined,
         title: undefined,
         alwaysVisible: undefined
      })
   }

   // static show(store, tooltip, relatedElement, options) {
   //
   //    let tooltipStore = new ReadOnlyDataView({
   //       store: store
   //    });
   //
   //    let update = (data) => {
   //       tooltipStore.setData({
   //          $tooltip: data
   //       })
   //    };
   //
   //    update(tooltip);
   //
   //    let config;
   //
   //    if (typeof tooltip == 'string')
   //       config = {
   //          text: {bind: "$tooltip"}
   //       };
   //    else
   //       config = {
   //          ...tooltip,
   //          text: {bind: "$tooltip.text"},
   //          title: {bind: "$tooltip.title"},
   //          alwaysVisible: {bind: "$tooltip.alwaysVisible"},
   //          visible: {expr: "{$tooltip.visible}!==false"},
   //       };
   //
   //    let widget = Tooltip.create({relatedElement}, config);
   //
   //    if (isTouchEvent() && widget.touchBehavior == 'ignore')
   //       return false;
   //
   //    return {
   //       dismiss: widget.open(tooltipStore, widget, options),
   //       update,
   //       widget,
   //       store: tooltipStore
   //    }
   // }

   renderContents(context, instance) {
      var {data} = instance;
      var {CSS, baseClass} = this;
      return [
         data.title && <div key="title" className={CSS.element(baseClass, "title")}>{data.title}</div>,
         data.text,
         ...super.renderContents(context, instance)
      ]
   }

   overlayDidMount(instance, component) {
      if (this.pipeMouseTrack)
         this.pipeMouseTrack((e)=> {
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
   }

   overlayWillUnmount(instance, component) {
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

// var tooltips = new WeakMap();
//
// function getTooltipState(element, instance) {
//    var state = tooltips.get(element);
//    if (state)
//       if (state.instance == instance)
//          return state;
//       else
//          state.destroy();
//
//    return new TooltipState(element, instance);
// }
//
// function removeTooltip(element) {
//    var state = tooltips.get(element);
//    if (state)
//       state.destroy();
// }
//
// class TooltipState {
//
//    constructor(element, instance) {
//       this.instance = instance;
//       this.element = element;
//    }
//
//    check(state, e, isTouchEvent) {
//       let {widget, data} = this.instance;
//       if (data.errorTooltip && data.error && (!widget.suppressErrorTooltipsUntilVisited || (state && state.visited))) {
//          let errorTooltip = {
//             ...data.errorTooltip,
//             text: data.error,
//             mod: 'error'
//          };
//          this.show('error', errorTooltip, e, isTouchEvent);
//       }
//       else if (data.tooltip)
//          this.show('info', data.tooltip, e, isTouchEvent);
//       else
//          this.destroy();
//    }
//
//    show(type, config, e, isTouchEvent) {
//
//       this.mouseTrap = config.mouseTrap;
//       this.alwaysVisible = config.alwaysVisible;
//       this.active = true;
//
//       //update existing tooltip
//       if (this.tooltip && this.type == type) {
//          this.tooltip.update(config);
//          if (e && this.trackMouse)
//             this.trackMouse(e);
//          else if (isTouchEvent && this.tooltip.widget.touchBehavior == 'toggle' && !this.alwaysVisible)
//             this.destroy();
//          return;
//       }
//
//       //create new tooltip
//       this.destroy();
//
//
//       this.type = type;
//
//       if (this.mouseTrap && !this.alwaysVisible) {
//          config = {
//             ...config,
//             onMouseEnter: () => {
//                this.mouseTrapped = true;
//             },
//             onMouseLeave: () => {
//                this.destroy();
//             }
//          }
//       }
//
//       if (config.trackMouse)
//          config.pipeMouseTrack = x => {
//             this.trackMouse = x
//          };
//       this.tooltip = Tooltip.show(this.instance.store, config, this.element);
//       if (this.tooltip) {
//          tooltips.set(this.element, this);
//          Debug.log(tooltipsFlag, 'show', this.element, this.instance);
//       }
//    }
//
//    onElementMouseLeave() {
//       let timeout = 20;
//       if (this.mouseTrap)
//          timeout = 200;
//
//       this.active = false;
//
//       setTimeout(() => {
//          if (!this.mouseTrapped && !this.alwaysVisible && !this.active)
//             this.destroy();
//       }, timeout);
//    }
//
//    onComponentWillReceiveProps(state) {
//       let {data} = this.instance;
//       if (this.tooltip || data.tooltip && data.tooltip.alwaysVisible || (data.error && data.errorTooltip && data.errorTooltip.alwaysVisible))
//          this.check(state);
//    }
//
//    onComponentDidMount(state) {
//       let {data} = this.instance;
//       if (data.tooltip && data.tooltip.alwaysVisible || (data.error && data.errorTooltip && data.errorTooltip.alwaysVisible))
//          this.check(state);
//    }
//
//    destroy() {
//       if (this.tooltip) {
//          Debug.log(tooltipsFlag, 'hide', this.element, this.instance);
//          if (tooltips.get(this.element) == this)
//             tooltips.delete(this.element);
//          this.tooltip.dismiss();
//          delete this.tooltip;
//       }
//    }
// }

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
      if (typeof tooltip == 'string') {
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

   instance.store.setData(options.data);
   instance.active = true;

   if (!instance.dismiss)
      instance.dismiss = instance.widget.open(instance, {
         onPipeUpdate: cb => {
            instance.update = cb;
         }
      });

   if (instance.trackMouse && e && e.target)
      instance.trackMouse(e);
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
      for (let name in parentInstance.tooltips)
         if (parentInstance.tooltips[name].dismiss)
            parentInstance.tooltips[name].dismiss();
   }
}

//tooltipComponent => tooltipParent