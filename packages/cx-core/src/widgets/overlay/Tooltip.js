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

   static show(store, tooltip, relatedElement, options) {

      let tooltipStore = new ReadOnlyDataView({
         store: store
      });

      let update = (data) => {
         tooltipStore.setData({
            $tooltip: data
         })
      };

      update(tooltip);

      let config;

      if (typeof tooltip == 'string')
         config = {
            text: {bind: "$tooltip"}
         };
      else
         config = {
            ...tooltip,
            text: {bind: "$tooltip.text"},
            title: {bind: "$tooltip.title"},
            alwaysVisible: {bind: "$tooltip.alwaysVisible"},
            visible: {expr: "{$tooltip.visible}!==false"},
         };

      let widget = Tooltip.create({relatedElement}, config);

      if (isTouchEvent() && widget.touchBehavior == 'ignore')
         return false;

      return {
         dismiss: widget.open(tooltipStore, widget, options),
         update,
         widget,
         store: tooltipStore
      }
   }

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
Tooltip.prototype.touchFriendly = false; //rename to positioningMode
Tooltip.prototype.touchBehavior = 'toggle';
Tooltip.prototype.arrow = true;

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

   check(state, e, isTouchEvent) {
      let {widget, data} = this.instance;
      if (data.errorTooltip && data.error && (!widget.suppressErrorTooltipsUntilVisited || (state && state.visited))) {
         let errorTooltip = {
            ...data.errorTooltip,
            text: data.error,
            mod: 'error'
         };
         this.show('error', errorTooltip, e, isTouchEvent);
      }
      else if (data.tooltip)
         this.show('info', data.tooltip, e, isTouchEvent);
      else
         this.destroy();
   }

   show(type, config, e, isTouchEvent) {

      this.mouseTrap = config.mouseTrap;
      this.alwaysVisible = config.alwaysVisible;
      this.active = true;

      //update existing tooltip
      if (this.tooltip && this.type == type) {
         this.tooltip.update(config);
         if (e && this.trackMouse)
            this.trackMouse(e);
         else if (isTouchEvent && this.tooltip.widget.touchBehavior == 'toggle' && !this.alwaysVisible)
            this.destroy();
         return;
      }

      //create new tooltip
      this.destroy();


      this.type = type;

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
         config.pipeMouseTrack = x => {
            this.trackMouse = x
         };
      this.tooltip = Tooltip.show(this.instance.store, config, this.element);
      if (this.tooltip) {
         tooltips.set(this.element, this);
         Debug.log(tooltipsFlag, 'show', this.element, this.instance);
      }
   }

   onElementMouseLeave() {
      let timeout = 20;
      if (this.mouseTrap)
         timeout = 200;

      this.active = false;

      setTimeout(() => {
         if (!this.mouseTrapped && !this.alwaysVisible && !this.active)
            this.destroy();
      }, timeout);
   }

   onComponentWillReceiveProps(state) {
      let {data} = this.instance;
      if (this.tooltip || data.tooltip && data.tooltip.alwaysVisible || (data.error && data.errorTooltip && data.errorTooltip.alwaysVisible))
         this.check(state);
   }

   onComponentDidMount(state) {
      let {data} = this.instance;
      if (data.tooltip && data.tooltip.alwaysVisible || (data.error && data.errorTooltip && data.errorTooltip.alwaysVisible))
         this.check(state);
   }

   destroy() {
      if (this.tooltip) {
         Debug.log(tooltipsFlag, 'hide', this.element, this.instance);
         if (tooltips.get(this.element) == this)
            tooltips.delete(this.element);
         this.tooltip.dismiss();
         delete this.tooltip;
      }
   }
}

export function tooltipMouseMove(e, instance, state, target) {
   if (!target)
      target = typeof e.nodeType == 'number' ? e : e.currentTarget;
   Debug.log(tooltipsFlag, 'mouse-enter', target, instance);
   let tooltipState = getTooltipState(target, instance);
   tooltipState.check(state, e, isTouchEvent());
}

export function tooltipMouseLeave(e, instance, state, target) {
   if (!target)
      target = e.currentTarget || e.target;
   Debug.log(tooltipsFlag, 'mouse-leave', target, instance);
   let tooltipState = getTooltipState(target, instance);
   tooltipState.onElementMouseLeave();
}

export function tooltipComponentWillUnmount(element) {
   removeTooltip(element);
}

export function tooltipComponentWillReceiveProps(element, instance, state) {
   let tooltipState = getTooltipState(element, instance);
   tooltipState.onComponentWillReceiveProps(state);
}

export function tooltipComponentDidMount(element, instance, state) {
   let tooltipState = getTooltipState(element, instance);
   tooltipState.onComponentDidMount(state);
}