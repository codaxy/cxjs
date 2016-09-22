import {Widget, VDOM} from '../Widget';
import {Dropdown} from './Dropdown';
import {Debug, tooltipsFlag} from '../../util/Debug';

export class Tooltip extends Dropdown {

   declareData() {
      super.declareData(...arguments, {
         text: undefined,
         title: undefined,
         alwaysVisible: undefined
      })
   }

   static show(store, tooltip, relatedElement, options) {
      if (typeof tooltip == 'string')
         tooltip = {
            items: tooltip
         };
      var widget = Widget.create({type: Tooltip, relatedElement}, tooltip);
      return widget.open(store, widget, options);
   }

   renderContents(context, instance) {
      var {data} = instance;
      var {CSS, baseClass} = this;
      return [
         <div key="arrow-border" className={CSS.element(baseClass, "arrow-border")}></div>,
         <div key="arrow-back" className={CSS.element(baseClass, "arrow-fill")}></div>,
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
      super.overlayDidMount(instance, component);
   }

   overlayWillUnmount(instance, component) {
      super.overlayWillUnmount(instance, component);
      if (this.pipeMouseTrack)
         this.pipeMouseTrack(null);
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

var tooltips = new WeakMap();

function getTooltipState(element, instance) {
   var state = tooltips.get(element);
   if (state)
      if (state.instance == instance)
         return state;
      else
         state.destroy();

   return new TooltipState(element, instance);
}

function removeTooltip(element) {
   var state = tooltips.get(element);
   if (state)
      state.destroy();
}

class TooltipState {

   constructor(element, instance) {
      this.instance = instance;
      this.element = element;
   }

   check(state, e) {
      var {widget, data} = this.instance;
      if (widget.errorTooltipsEnabled && data.error && (!widget.suppressErrorTooltipsUntilVisited || (state && state.visited))) {
         var errorTooltip = {
            ...data.errorTooltip,
            items: data.error,
            mod: 'error'
         };
         this.show('error', errorTooltip, data.error, e);
      }
      else if (data.tooltip)
         this.show('info', data.tooltip, data.tooltip, e);
      else
         this.destroy();
   }

   show(type, config, test, e) {
      if (this.dismiss && this.type == type && this.test == test) {
         if (e && this.trackMouse)
            this.trackMouse(e);
         return;
      }
      this.destroy();
      this.type = type;
      this.test = test;
      this.mouseTrap = config.mouseTrap;
      this.alwaysVisible = config.alwaysVisible;
      if (this.mouseTrap && !this.alwaysVisible) {
         config = {
            ...config,
            onMouseEnter: () => {
               this.mouseTrapped = true;
            },
            onMouseLeave: () => {
               this.destroy();
            }
         }
      }
      if (config.trackMouse)
         config.pipeMouseTrack = x => { this.trackMouse = x };
      this.dismiss = Tooltip.show(this.instance.store, config, this.element);
      tooltips.set(this.element, this);
      Debug.log(tooltipsFlag, 'show', this.element, this.instance);
   }

   onElementMouseLeave() {
      if (this.mouseTrap) {
         setTimeout(() => {
            if (!this.mouseTrapped)
               this.destroy();
         }, 200);
      } else if (!this.alwaysVisible)
         this.destroy();
   }

   onComponentWillReceiveProps(state) {
      var {data} = this.instance;
      if (this.dismiss || data.tooltip && data.tooltip.alwaysVisible || (data.error && data.errorTooltip && data.errorTooltip.alwaysVisible))
         this.check(state);
   }

   onComponentDidMount(state) {
      var {data} = this.instance;
      if (data.tooltip && data.tooltip.alwaysVisible || (data.error && data.errorTooltip && data.errorTooltip.alwaysVisible))
         this.check(state);
   }

   destroy() {
      if (this.dismiss) {
         Debug.log(tooltipsFlag, 'hide', this.element, this.instance);
         if (tooltips.get(this.element) == this)
            tooltips.delete(this.element);
         this.dismiss();
         delete this.dismiss;
      }
   }
}

export function tooltipMouseMove(e, instance, state) {
   var target = typeof e.nodeType == 'number' ? e : e.currentTarget;
   Debug.log(tooltipsFlag, 'mouse-enter', target, instance);
   var tooltipState = getTooltipState(target, instance);
   tooltipState.check(state, e);
}

export function tooltipMouseLeave(e, instance) {
   var target = e.currentTarget || e.target;
   Debug.log(tooltipsFlag, 'mouse-leave', target, instance);
   var tooltipState = getTooltipState(target, instance);
   tooltipState.onElementMouseLeave();
}

export function tooltipComponentWillUnmount(element) {
   removeTooltip(element);
}

export function tooltipComponentWillReceiveProps(element, instance, state) {
   var tooltipState = getTooltipState(element, instance);
   tooltipState.onComponentWillReceiveProps(state);
}

export function tooltipComponentDidMount(element, instance, state) {
   var tooltipState = getTooltipState(element, instance);
   tooltipState.onComponentDidMount(state);
}