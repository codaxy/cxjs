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

export function getTooltipInstance(e, instance, state, target, options = {}) {
   if (!target)
      target = typeof e.nodeType == 'number' ? e : e.currentTarget;

   Debug.log(tooltipsFlag, 'mouse-move', target, instance);

   let {widget} = instance;
   if (!widget.tooltip)
      return;

   if (instance.tooltip && instance.tooltip.widget.relatedElement != target) {
      if (instance.tooltip.dismiss)
         instance.tooltip.dismiss();
      instance.tooltip = null;
   }

   if (!instance.tooltip) {
      let config = widget.tooltip;
      if (typeof config == 'string') {
         config = {
            text: config
         };
      }
      let tooltip = Tooltip.create({relatedElement: target}, config);
      let store = new ReadOnlyDataView({
         store: instance.store
      });
      instance.tooltip = instance.getChild(null, tooltip, null, store);
   }
}

export function tooltipMouseMove(e, instance, state, target, options = {}) {
   getTooltipInstance(e, instance, state, target, options)

   if (!instance.tooltip)
      return;

   if (isTouchEvent() && instance.tooltip.widget.touchBehavior == 'ignore')
      return false;

   instance.tooltip.store.setData(options.data);
   instance.tooltip.active = true;

   if (!instance.tooltip.dismiss)
      instance.tooltip.dismiss = instance.tooltip.widget.open(instance.tooltip, options);

   if (instance.tooltip.trackMouse && e)
      instance.tooltip.trackMouse(e);
}

export function tooltipMouseLeave(e, instance, state, target) {
   if (!target)
      target = e.currentTarget || e.target;

   Debug.log(tooltipsFlag, 'mouse-leave', target, instance);

   if (instance.tooltip) {
      instance.tooltip.active = false;
      instance.tooltip.widget.handleMouseLeavesParent(instance.tooltip);
   }
}

export function tooltipComponentWillUnmount(instance) {
   if (instance.tooltip && instance.tooltip.dismiss)
      instance.tooltip.dismiss();
}

export function tooltipComponentWillReceiveProps(element, instance, state) {}

export function tooltipComponentDidMount(element, instance, state) {
   getTooltipInstance(element, instance, state);
   if (instance.tooltip && instance.tooltip.widget.alwaysVisible != false) {
      if (!instance.tooltip.initialized)
         instance.tooltip.init();
      let data = instance.tooltip.dataSelector(instance.tooltip.store.getData());
      if (data.alwaysVisible)
         tooltipMouseMove(null, instance, state, element);
   }
}

//tooltipComponent => tooltipParent