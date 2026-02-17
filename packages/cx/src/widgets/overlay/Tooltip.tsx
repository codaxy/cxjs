/** @jsxImportSource react */
import { Widget, VDOM } from "../../ui/Widget";
import {
  Dropdown,
  DropdownBase,
  DropdownConfig,
  DropdownInstance,
} from "./Dropdown";
import { debug, tooltipsFlag } from "../../util/Debug";
import { isNonEmptyArray } from "../../util/isNonEmptyArray";
import { ReadOnlyDataView } from "../../data/ReadOnlyDataView";
import { isTouchEvent } from "../../util/isTouchEvent";
import { shallowEquals } from "../../util/shallowEquals";
import { isSelector } from "../../data/isSelector";
import {
  TooltipConfig,
  TooltipParentInstance,
  TooltipProp,
  wireTooltipOps,
} from "./tooltip-ops";
import { getCursorPos } from "./captureMouse";
import { RenderingContext } from "../../ui/RenderingContext";
import { StringProp, BooleanProp } from "../../ui/Prop";
import { Instance } from "../../ui/Instance";
import { OverlayOpenOptions } from "./Overlay";
import { View } from "../../data/View";

export class TooltipInstance extends DropdownInstance<Tooltip> {
  tooltipComponent?: any;
  parentValidityCheckTimer?: NodeJS.Timeout;
  mouseOverTooltip?: boolean;
  mouseOverTarget?: boolean;
  trackMouse?: (e: MouseEvent) => void;
  dismissTooltip?: (() => void) | null;
  declare tooltipName: string;
  lastClickTime?: number;
  config?: TooltipConfig;
  update?: () => void;
  declare store: ReadOnlyDataView;
  declare parent: Instance & TooltipParentInstance;
}

export interface TooltipOpenOptions extends OverlayOpenOptions {
  onPipeUpdate?: (callback: () => boolean) => void;
}

export class TooltipBase<
  Config extends TooltipConfig = TooltipConfig,
  InstanceType extends TooltipInstance = TooltipInstance,
> extends DropdownBase<Config, InstanceType> {
  declare text?: StringProp;
  declare title?: StringProp;
  declare alwaysVisible?: BooleanProp;
  declare trackMouse?: boolean;
  declare trackMouseX?: boolean;
  declare trackMouseY?: boolean;
  declare touchBehavior?: string;
  declare globalMouseTracking?: boolean;
  declare mouseTrap?: boolean;
  declare createDelay?: number;
  declare baseClass: string;

  declareData(...args: any[]) {
    super.declareData(...args, {
      text: undefined,
      title: undefined,
      alwaysVisible: undefined,
    });
  }

  prepareData(context: RenderingContext, instance: InstanceType): void {
    let { data } = instance;
    data.stateMods = {
      ...data.stateMods,
      "mouse-trap": this.mouseTrap,
    };
    super.prepareData(context, instance);
  }

  renderContents(context: RenderingContext, instance: InstanceType): any {
    let { data } = instance;
    let { CSS, baseClass } = this;
    return [
      data.title && (
        <div key="title" className={CSS.element(baseClass, "title")}>
          {data.title}
        </div>
      ),
      data.text,
      ...super.renderContents(context, instance),
    ];
  }

  initInstance(context: RenderingContext, instance: InstanceType): void {
    super.initInstance(context, instance);

    if (this.trackMouseX || this.trackMouseY) {
      instance.trackMouse = (e: any) => {
        let pos = getCursorPos(e);
        instance.mousePosition = {
          x: pos.clientX,
          y: pos.clientY,
        };
        if (instance.tooltipComponent)
          this.updateDropdownPosition(instance, instance.tooltipComponent);
      };
    }
  }

  overlayDidMount(instance: InstanceType, component: any): void {
    instance.tooltipComponent = component;

    super.overlayDidMount(instance, component);

    instance.parentValidityCheckTimer = setInterval(() => {
      if (
        this.relatedElement &&
        !this.relatedElement.ownerDocument.body.contains(this.relatedElement)
      ) {
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
      document.addEventListener("mousemove", instance.trackMouse);
    }
  }

  overlayWillUnmount(instance: InstanceType, component: any): void {
    clearInterval(instance.parentValidityCheckTimer);
    super.overlayWillUnmount(instance, component);
    instance.tooltipComponent = null;

    if (instance.widget.globalMouseTracking && instance.trackMouse) {
      document.removeEventListener("mousemove", instance.trackMouse);
    }
  }

  handleMouseEnter(instance: InstanceType, component: any): void {
    instance.mouseOverTooltip = true;
    super.handleMouseEnter(instance, component);
  }

  handleMouseLeave(instance: InstanceType, component: any): void {
    instance.mouseOverTooltip = false;
    if (this.mouseTrap) this.handleMouseLeavesParent(instance);
    super.handleMouseLeave(instance, component);
  }

  handleMouseLeavesParent(instance: InstanceType): void {
    let timeout = this.mouseTrap ? 200 : 0;
    setTimeout(() => {
      if (
        !instance.mouseOverTarget &&
        !(this.mouseTrap && instance.mouseOverTooltip)
      )
        this.dismissTooltip(instance);
    }, timeout);
  }

  dismissTooltip(instance: InstanceType): void {
    if (!instance || !instance.dismissTooltip) return;
    if (
      instance.data &&
      instance.data.alwaysVisible &&
      this.relatedElement &&
      this.relatedElement.ownerDocument.body.contains(this.relatedElement)
    )
      return;
    instance.dismissTooltip();
    instance.dismissTooltip = null;
  }

  dismissAfterScroll(data: any, instance: InstanceType): void {
    this.dismissTooltip(instance);
  }

  checkVisible(
    context: RenderingContext,
    instance: InstanceType,
    data: any,
  ): boolean {
    if (!isNonEmptyArray(this.items) && !data.title && !data.text) return false;
    return super.checkVisible(context, instance, data);
  }

  open(
    storeOrInstance?: View | Instance,
    options?: TooltipOpenOptions,
  ): () => void {
    return super.open(storeOrInstance, options);
  }
}

TooltipBase.prototype.baseClass = "tooltip";
TooltipBase.prototype.offset = 8;
TooltipBase.prototype.placementOrder =
  "right up down left up-right up-left right-up right-down down-right down-left left-up left-down";
TooltipBase.prototype.animate = true;
TooltipBase.prototype.destroyDelay = 300;
TooltipBase.prototype.createDelay = 200;
TooltipBase.prototype.matchWidth = false;
TooltipBase.prototype.trackMouse = false;
TooltipBase.prototype.trackMouseX = false;
TooltipBase.prototype.trackMouseY = false;
TooltipBase.prototype.touchFriendly = false; //rename to positioningMode
TooltipBase.prototype.touchBehavior = "toggle";
TooltipBase.prototype.arrow = true;
TooltipBase.prototype.alwaysVisible = false;
TooltipBase.prototype.globalMouseTracking = false;

export class Tooltip extends TooltipBase {}
Widget.alias("tooltip", Tooltip);

interface TooltipHelperOptions {
  target?: HTMLElement;
  tooltipName?: string;
  data?: any;
}

export function getTooltipInstance(
  e: MouseEvent | Element,
  parentInstance: Instance<any> & TooltipParentInstance,
  tooltip: TooltipProp | undefined,
  options: TooltipHelperOptions = {},
) {
  let target =
    options.target || (e instanceof Element ? e : e?.currentTarget) || e;

  debug(tooltipsFlag, "mouse-move", target, parentInstance);

  let name = options.tooltipName || "tooltip";

  if (!parentInstance.tooltips) parentInstance.tooltips = {};
  let tooltipInstance: TooltipInstance | null =
    parentInstance.tooltips[name] || null;

  //no tooltips on disabled elements
  if (parentInstance?.data.disabled) {
    if (tooltipInstance && tooltipInstance.dismissTooltip)
      tooltipInstance.dismissTooltip();
    return;
  }

  if (
    tooltipInstance &&
    (tooltipInstance.widget.relatedElement != target ||
      !shallowEquals(tooltipInstance.config, tooltip) ||
      tooltipInstance.store.store != parentInstance.store)
  ) {
    if (tooltipInstance.dismissTooltip) tooltipInstance.dismissTooltip();
    delete parentInstance.tooltips[name];
    tooltipInstance = null;
  }

  if (!tooltip || !target) return;

  if (!tooltipInstance) {
    let config: TooltipConfig = tooltip as TooltipConfig;
    if (!isTooltipConfig(tooltip)) {
      config = {
        text: tooltip as StringProp,
      };
    }
    let tooltipWidget = Tooltip.create({ relatedElement: target }, config);
    let store = new ReadOnlyDataView({
      store: parentInstance.store,
    });
    tooltipInstance = parentInstance.tooltips[name] =
      parentInstance.getDetachedChild(
        tooltipWidget,
        name,
        store,
      ) as TooltipInstance;
    tooltipInstance.config = config;
    tooltipInstance.tooltipName = name;
    tooltipInstance.init(new RenderingContext());

    if (
      config.alwaysVisible ||
      config.trackMouse ||
      config.trackMouseX ||
      config.trackMouseY
    ) {
      tooltipInstance.data = tooltipInstance.dataSelector!(store);
    }
  }

  return tooltipInstance;
}

function tooltipMouseMove(
  e: MouseEvent | Element,
  parentInstance: Instance<any> & TooltipParentInstance,
  tooltip: TooltipProp | undefined,
  options: TooltipHelperOptions = {},
) {
  let instance = getTooltipInstance(e, parentInstance, tooltip, options);
  if (!instance) return;

  if (isTouchEvent() && instance.widget.touchBehavior == "ignore") return false;

  let dirty = !shallowEquals(options.data, instance.store.data);

  instance.store.setData(options.data);
  instance.mouseOverTarget = true;

  if (!instance.dismissTooltip) {
    let canceled = false;
    let dismiss = () => {
      canceled = true;
    };
    let unsubscribeDismiss = instance.parent.subscribeOnDestroy(() => {
      dismiss();
    });
    instance.dismissTooltip = () => {
      if (instance.parent.tooltips![instance.tooltipName] === instance)
        delete instance.parent.tooltips[instance.tooltipName];
      unsubscribeDismiss();
      dismiss();
      instance.dismissTooltip = null;
    };
    instance.lastClickTime = Date.now();
    setTimeout(() => {
      let { relatedElement } = instance.widget;
      if (
        !canceled &&
        instance.mouseOverTarget &&
        relatedElement!.ownerDocument.body.contains(relatedElement!)
      ) {
        dismiss = instance.widget.open(instance, {
          onPipeUpdate: (cb: () => void) => {
            instance.update = cb;
          },
        });
      } else {
        instance.dismissTooltip = null;
      }
    }, instance.widget.createDelay);
  } else {
    if (isTouchEvent() && instance.widget.touchBehavior == "toggle") {
      // ios fires mousemove events after touchend
      if (Date.now() - (instance.lastClickTime ?? 0) > 50) {
        instance.lastClickTime = Date.now();
        instance.dismissTooltip();
        instance.dismissTooltip = null;
      }
    } else if (dirty && instance.update) instance.update();
  }

  if (instance.trackMouse && isMouseEvent(e)) instance.trackMouse(e);
}

function isMouseEvent(e: MouseEvent | Element): e is MouseEvent {
  if (e instanceof Element) return false;
  return !!e;
}

function isTooltipConfig(
  tooltip: TooltipProp | undefined,
): tooltip is TooltipConfig {
  if (!tooltip) return false;
  if (isSelector(tooltip)) return false;
  return true;
}

function tooltipMouseLeave(
  e: MouseEvent | Element,
  parentInstance: Instance<any> & TooltipParentInstance,
  tooltip: TooltipProp | undefined,
  options?: TooltipHelperOptions,
) {
  let instance = getTooltipInstance(e, parentInstance, tooltip, options);

  // do not process leave events twice even if called multiple times
  if (instance && instance.mouseOverTarget) {
    instance.mouseOverTarget = false;
    instance.widget.handleMouseLeavesParent(instance);
  }
}

function tooltipParentDidMount(
  element: Element,
  parentInstance: Instance<any> & TooltipParentInstance,
  tooltip: TooltipProp | undefined,
  options?: TooltipHelperOptions,
) {
  if (isTooltipConfig(tooltip) && tooltip.alwaysVisible) {
    let instance = getTooltipInstance(
      element,
      parentInstance,
      tooltip,
      options,
    );
    if (instance && instance.data.alwaysVisible)
      tooltipMouseMove(element, parentInstance, tooltip, options);
  }
}

function tooltipParentWillReceiveProps(
  element: Element,
  parentInstance: Instance<any> & TooltipParentInstance,
  tooltip: TooltipProp | undefined,
  options?: TooltipHelperOptions,
) {
  let instance = getTooltipInstance(element, parentInstance, tooltip, options);
  if (instance && options) {
    instance.store.setData(options.data);
    if (instance.update) instance.update();
    if (
      instance.mouseOverTarget ||
      (instance.data && instance.data.alwaysVisible)
    )
      tooltipMouseMove(element, parentInstance, tooltip, options);
  }
}

function tooltipParentWillUnmount(
  parentInstance: Instance<any> & TooltipParentInstance,
) {
  if (parentInstance.tooltips) {
    for (let name in parentInstance.tooltips) {
      let instance = parentInstance.tooltips[name];
      instance.mouseOverTarget = false;
      if (instance.dismissTooltip) instance.dismissTooltip();
    }
  }
}

function tooltipParentDidUpdate(
  element: HTMLElement,
  parentInstance: Instance<any> & TooltipParentInstance,
  tooltip: TooltipProp | undefined,
) {
  let instance = getTooltipInstance(element, parentInstance, tooltip);
  if (
    instance &&
    instance.visible &&
    instance.data?.alwaysVisible &&
    instance.tooltipComponent
  )
    instance.widget.updateDropdownPosition(instance, instance.tooltipComponent);
}

export function enableTooltips() {
  wireTooltipOps({
    tooltipMouseMove,
    tooltipMouseLeave,
    tooltipParentDidMount,
    tooltipParentWillReceiveProps,
    tooltipParentWillUnmount,
    tooltipParentDidUpdate,
  });
}
