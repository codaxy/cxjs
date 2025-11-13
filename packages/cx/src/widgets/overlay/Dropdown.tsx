/** @jsxImportSource react */
import { Localization } from "../../ui/Localization";
import { ResizeManager } from "../../ui/ResizeManager";
import { Widget, VDOM } from "../../ui/Widget";
import { calculateNaturalElementHeight } from "../../util/calculateNaturalElementHeight";
import { closestParent, findFirst, isFocusable } from "../../util/DOM";
import { getTopLevelBoundingClientRect } from "../../util/getTopLevelBoundingClientRect";
import { isTouchDevice } from "../../util/isTouchDevice";
import { Overlay, OverlayBase, OverlayConfig, OverlayInstance } from "./Overlay";
import { Instance } from "../../ui/Instance";
import { StringProp } from "../../ui/Prop";
import { RenderingContext } from "../../ui/RenderingContext";

/*
 Dropdown specific features:
 - ability to position itself next to the target element
 - monitor scrollable parents and updates it's position
 */

export interface DropdownConfig extends OverlayConfig {
   /** Placement option for the dropdown relative to the trigger element. */
   placement?: StringProp | null;

   /** Offset distance from the trigger element. */
   offset?: number;

   /** Match the dropdown width to the trigger element. */
   matchWidth?: boolean;

   /** Match the dropdown max-width to the trigger element. */
   matchMaxWidth?: boolean;

   /** Placement preference order. */
   placementOrder?: string;

   /** Constrain the dropdown within the viewport. */
   constrain?: boolean;

   /** Positioning strategy - "fixed", "absolute", or "auto". */
   positioning?: string;

   /** Use touch-friendly positioning on touch devices. */
   touchFriendly?: boolean;

   /** Show an arrow pointing to the trigger element. */
   arrow?: boolean;

   /** Add padding around the dropdown. */
   pad?: boolean;

   /** Element explosion distance for positioning. */
   elementExplode?: number;

   /** Padding from screen edges. */
   screenPadding?: number;

   /** First child element defines the height. */
   firstChildDefinesHeight?: boolean;

   /** First child element defines the width. */
   firstChildDefinesWidth?: boolean;

   /** The dropdown will be automatically closed if the page is scrolled a certain distance. */
   closeOnScrollDistance?: number;

   /** The element to position the dropdown relative to. */
   relatedElement?: Element;

   /** Callback to resolve the related element. */
   onResolveRelatedElement?: string | ((beaconEl: Element, instance: any) => Element);

   /** Callback to measure natural content size. */
   onMeasureNaturalContentSize?: string | ((el: Element, instance: any) => { width?: number; height?: number });

   /** Callback when dropdown mounts. */
   onDropdownDidMount?: string;

   /** Callback to validate dropdown position. */
   pipeValidateDropdownPosition?: string;

   /** Callback when dropdown is dismissed after scroll. */
   onDismissAfterScroll?: string;

   /** Track mouse position for dropdowns. */
   trackMouse?: boolean;

   /** Track mouse X position. */
   trackMouseX?: boolean;

   /** Track mouse Y position. */
   trackMouseY?: boolean;

   /** Cover the related element with dropdown. */
   cover?: boolean;
}

export class DropdownInstance<WidgetType extends DropdownBase = Dropdown> extends OverlayInstance<WidgetType> {
   mousePosition?: any;
   parentPositionChangeEvent?: any;
   initialScreenPosition?: any;
   relatedElement?: Element;
   needsBeacon?: boolean;
}

export class DropdownBase<
   Config extends DropdownConfig = DropdownConfig,
   InstanceType extends DropdownInstance<any> = DropdownInstance<any>,
> extends OverlayBase<Config, InstanceType> {
   declare trackMouse?: boolean;
   declare trackMouseX?: boolean;
   declare trackMouseY?: boolean;
   declare offset: number;
   declare matchWidth?: boolean;
   declare matchMaxWidth?: boolean;
   declare placementOrder?: string;
   declare placement?: StringProp | null;
   declare constrain?: boolean;
   declare positioning?: string;
   declare touchFriendly?: boolean;
   declare arrow?: boolean;
   declare elementExplode?: number;
   declare screenPadding?: number;
   declare firstChildDefinesHeight?: boolean;
   declare firstChildDefinesWidth?: boolean;
   declare closeOnScrollDistance?: number;
   declare relatedElement?: Element;
   declare onResolveRelatedElement?: string | ((beaconEl: Element, instance: any) => Element);
   declare onMeasureNaturalContentSize?: string | ((el: Element, instance: any) => { width?: number; height?: number });
   declare onDropdownDidMount?: string;
   declare pipeValidateDropdownPosition?: string;
   declare onDismissAfterScroll?: string;
   declare onKeyDown?: string;
   declare cover?: boolean;
   declare mousePosition?: any;
   declare mouseTrap?: boolean;
   declare createDelay?: number;

   init() {
      if (this.trackMouse) {
         this.trackMouseX = true;
         this.trackMouseY = true;
      }
      if (this.autoFocus && !this.hasOwnProperty("focusable")) this.focusable = true;
      super.init();
   }

   declareData(...args: any[]) {
      return super.declareData(...args, {
         placement: undefined,
      });
   }

   initInstance(context: RenderingContext, instance: InstanceType): void {
      instance.mousePosition = this.mousePosition;
      instance.parentPositionChangeEvent = context.parentPositionChangeEvent;
      super.initInstance(context, instance);
   }

   explore(context: RenderingContext, instance: InstanceType): void {
      context.push("lastDropdown", instance);
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: InstanceType): void {
      context.pop("lastDropdown");
      super.exploreCleanup(context, instance);
   }

   overlayDidMount(instance: InstanceType, component: any): void {
      super.overlayDidMount(instance, component);
      var scrollableParents = (component.scrollableParents = [window]);
      component.updateDropdownPosition = (e: any) => this.updateDropdownPosition(instance, component);

      instance.initialScreenPosition = null;

      var el = instance.relatedElement?.parentElement;
      while (el) {
         scrollableParents.push(el);
         el = el.parentElement;
      }
      scrollableParents.forEach((el: any) => {
         el.addEventListener("scroll", component.updateDropdownPosition);
      });
      component.offResize = ResizeManager.subscribe(component.updateDropdownPosition);

      if (this.onDropdownDidMount) instance.invoke("onDropdownDidMount", instance, component);

      if (this.pipeValidateDropdownPosition)
         instance.invoke("pipeValidateDropdownPosition", component.updateDropdownPosition, instance);

      if (instance.parentPositionChangeEvent)
         component.offParentPositionChange = instance.parentPositionChangeEvent.subscribe(
            component.updateDropdownPosition,
         );
   }

   overlayDidUpdate(instance: InstanceType, component: any): void {
      this.updateDropdownPosition(instance, component);
   }

   overlayWillUnmount(instance: InstanceType, component: any): void {
      var { scrollableParents } = component;
      if (scrollableParents) {
         scrollableParents.forEach((el: any) => {
            el.removeEventListener("scroll", component.updateDropdownPosition);
         });
         delete component.scrollableParents;
         delete component.updateDropdownPosition;
      }
      if (component.offResize) component.offResize();

      if (this.pipeValidateDropdownPosition) instance.invoke("pipeValidateDropdownPosition", null, instance);

      if (component.offParentPositionChange) component.offParentPositionChange();

      delete component.parentBounds;
      delete component.initialScreenPosition;
   }

   dismissAfterScroll(data: any, instance: InstanceType, component: any): void {
      if (this.onDismissAfterScroll && instance.invoke("onDismissAfterScroll", data, instance, component) === false)
         return;
      if (instance.dismiss) instance.dismiss();
   }

   updateDropdownPosition(instance: InstanceType, component: any): void {
      var { el, initialScreenPosition } = component;
      var { data, relatedElement } = instance;
      var parentBounds = getTopLevelBoundingClientRect(relatedElement!);

      //getBoundingClientRect() will return an empty rect if the element is hidden or removed
      if (parentBounds.left == 0 && parentBounds.top == 0 && parentBounds.bottom == 0 && parentBounds.right == 0) {
         if (!component.parentBounds) return;
         parentBounds = component.parentBounds;
      } else component.parentBounds = parentBounds;

      if (this.trackMouseX && instance.mousePosition) {
         parentBounds = {
            top: parentBounds.top,
            bottom: parentBounds.bottom,
            left: instance.mousePosition.x,
            right: instance.mousePosition.x,
         };
      }

      if (this.trackMouseY && instance.mousePosition) {
         parentBounds = {
            left: parentBounds.left,
            right: parentBounds.right,
            top: instance.mousePosition.y,
            bottom: instance.mousePosition.y,
         };
      }

      let explode = this.pad && typeof this.elementExplode === "number" ? this.elementExplode : 0;
      if (explode) {
         parentBounds = {
            left: Math.round(parentBounds.left - explode),
            right: Math.round(parentBounds.right + explode),
            top: Math.round(parentBounds.top - explode),
            bottom: Math.round(parentBounds.bottom + explode),
         };
      }

      var style = {};
      if (this.matchWidth) style.minWidth = `${parentBounds.right - parentBounds.left}px`;
      if (this.matchMaxWidth) style.maxWidth = `${parentBounds.right - parentBounds.left}px`;

      var contentSize = this.measureNaturalDropdownSize(instance, component);
      var placement = this.findOptimalPlacement(contentSize, parentBounds, data.placement, component.lastPlacement);

      this.applyPositioningPlacementStyles(style, placement, contentSize, parentBounds, el, false);
      component.setCustomStyle(style);
      this.setDirectionClass(component, placement);

      if (this.constrain) {
         //recheck content size for changes as sometimes when auto is used the size can change
         let newContentSize = this.measureNaturalDropdownSize(instance, component);
         if (newContentSize.width != contentSize.width || newContentSize.height != contentSize.height) {
            let newStyle = {};
            this.applyPositioningPlacementStyles(newStyle, placement, newContentSize, parentBounds, el, true);
            component.setCustomStyle(newStyle);
         }
      }

      if (!initialScreenPosition) initialScreenPosition = component.initialScreenPosition = parentBounds;

      if (
         (!this.trackMouseY && Math.abs(parentBounds.top - initialScreenPosition.top) > this.closeOnScrollDistance) ||
         (!this.trackMouseX && Math.abs(parentBounds.left - initialScreenPosition.left) > this.closeOnScrollDistance)
      )
         this.dismissAfterScroll({ parentBounds, initialScreenPosition }, instance, component);

      instance.positionChangeSubscribers.notify();
   }

   applyFixedPositioningPlacementStyles(
      style: any,
      placement: string,
      contentSize: any,
      rel: any,
      el: HTMLElement,
      noAuto: boolean,
   ): void {
      let viewport = getViewportRect(this.screenPadding);
      style.position = "fixed";

      if (placement.startsWith("down")) {
         style.top = `${(this.cover ? rel.top : rel.bottom) + this.offset}px`;
         let bottom = viewport.bottom - (rel.bottom + this.offset + contentSize.height);
         style.bottom =
            this.constrain && (noAuto || bottom < this.screenPadding + 10)
               ? Math.max(this.screenPadding, bottom) + "px"
               : "auto";
      } else if (placement.startsWith("up")) {
         let top = rel.top - this.offset - contentSize.height - viewport.top;
         style.top =
            this.constrain && (noAuto || top < this.screenPadding + 10)
               ? Math.max(this.screenPadding, top) + "px"
               : "auto";
         style.bottom =
            document.documentElement.offsetHeight - (this.cover ? rel.bottom : rel.top) + this.offset + "px";
      }

      switch (placement) {
         case "down":
         case "down-center":
            style.right = "auto";
            style.left = `${Math.round((rel.left + rel.right - el.offsetWidth) / 2)}px`;
            break;

         case "down-right":
            style.right = "auto";
            style.left = `${rel.left}px`;
            break;

         case "down-left":
            style.right = `${document.documentElement.offsetWidth - rel.right}px`;
            style.left = "auto";
            break;

         case "up":
         case "up-center":
            style.right = "auto";
            style.left = `${Math.round((rel.left + rel.right - el.offsetWidth) / 2)}px`;
            break;

         case "up-right":
            style.right = "auto";
            style.left = `${rel.left}px`;
            break;

         case "up-left":
            style.right = `${document.documentElement.offsetWidth - rel.right}px`;
            style.left = "auto";
            break;

         case "right":
         case "right-center":
            style.top = `${Math.round((rel.top + rel.bottom - el.offsetHeight) / 2)}px`;
            style.right = "auto";
            style.bottom = "auto";
            style.left = `${rel.right + this.offset}px`;
            break;

         case "right-down":
            style.top = `${rel.top}px`;
            style.right = "auto";
            style.bottom = "auto";
            style.left = `${rel.right + this.offset}px`;
            break;

         case "right-up":
            style.top = "auto";
            style.right = "auto";
            style.bottom = `${document.documentElement.offsetHeight - rel.bottom}px`;
            style.left = `${rel.right + this.offset}px`;
            break;

         case "left":
         case "left-center":
            style.top = `${Math.round((rel.top + rel.bottom - el.offsetHeight) / 2)}px`;
            style.right = `${document.documentElement.offsetWidth - rel.left + this.offset}px`;
            style.bottom = "auto";
            style.left = "auto";
            break;

         case "left-down":
            style.top = `${rel.top}px`;
            style.right = `${document.documentElement.offsetWidth - rel.left + this.offset}px`;
            style.bottom = "auto";
            style.left = "auto";
            break;

         case "left-up":
            style.top = "auto";
            style.right = `${document.documentElement.offsetWidth - rel.left + this.offset}px`;
            style.bottom = `${document.documentElement.offsetHeight - rel.bottom}px`;
            style.left = "auto";
            break;

         case "screen-center":
            let w = Math.min(contentSize.width, document.documentElement.offsetWidth - 2 * this.screenPadding);
            let h = Math.min(contentSize.height, document.documentElement.offsetHeight - 2 * this.screenPadding);
            style.top = `${Math.round((document.documentElement.offsetHeight - h) / 2)}px`;
            style.right = `${Math.round((document.documentElement.offsetWidth - w) / 2)}px`;
            style.bottom = `${Math.round((document.documentElement.offsetHeight - h) / 2)}px`;
            style.left = `${Math.round((document.documentElement.offsetWidth - w) / 2)}px`;
            break;
      }
   }

   applyAbsolutePositioningPlacementStyles(
      style: any,
      placement: string,
      contentSize: any,
      rel: any,
      el: HTMLElement,
      noAuto: boolean,
   ): void {
      var viewport = getViewportRect(this.screenPadding);

      style.position = "absolute";

      if (placement.startsWith("down")) {
         style.top = `${rel.bottom - rel.top + this.offset}px`;
         let room = viewport.bottom - rel.bottom + this.offset;
         style.bottom =
            this.constrain && (noAuto || contentSize.height >= room - 10)
               ? `${-Math.min(room, contentSize.height)}px`
               : "auto";
      } else if (placement.startsWith("up")) {
         let room = rel.top - this.offset - viewport.top;
         style.top =
            this.constrain && (noAuto || contentSize.height >= room - 10)
               ? `${-Math.min(room, contentSize.height)}px`
               : "auto";
         style.bottom = `${rel.bottom - rel.top - this.offset}px`;
      }

      switch (placement) {
         case "down":
         case "down-center":
            style.right = "auto";
            style.left = `${Math.round((rel.right - rel.left - el.offsetWidth) / 2)}px`;
            break;

         case "down-right":
            style.right = "auto";
            style.left = `0`;
            break;

         case "down-left":
            style.right = `0`;
            style.left = "auto";
            break;

         case "up":
         case "up-center":
            style.right = "auto";
            style.left = `${Math.round((rel.right - rel.left - el.offsetWidth) / 2)}px`;
            break;

         case "up-right":
            style.right = "auto";
            style.left = `0`;
            break;

         case "up-left":
            style.right = `0`;
            style.left = "auto";
            break;

         case "right":
         case "right-center":
            style.top = `${Math.round((rel.bottom - rel.top - el.offsetHeight) / 2)}px`;
            style.right = "auto";
            style.bottom = "auto";
            style.left = `${rel.right - rel.left + this.offset}px`;
            break;

         case "right-down":
            style.top = `0`;
            style.right = "auto";
            style.bottom = "auto";
            style.left = `${rel.right - rel.left + this.offset}px`;
            break;

         case "right-up":
            style.top = "auto";
            style.right = "auto";
            style.bottom = `0`;
            style.left = `${rel.right - rel.left + this.offset}px`;
            break;

         case "left":
         case "left-center":
            style.top = `${Math.round((rel.bottom - rel.top - el.offsetHeight) / 2)}px`;
            style.right = `${rel.right - rel.left + this.offset}px`;
            style.bottom = "auto";
            style.left = "auto";
            break;

         case "left-down":
            style.top = `0`;
            style.right = `${rel.right - rel.left + this.offset}px`;
            style.bottom = "auto";
            style.left = "auto";
            break;

         case "left-up":
            style.top = "auto";
            style.right = `${rel.right - rel.left + this.offset}px`;
            style.bottom = `0`;
            style.left = "auto";
            break;
      }
   }

   applyPositioningPlacementStyles(style: any, placement: string, contentSize: any, parentBounds: any, el: HTMLElement, noAuto: boolean): void {
      switch (this.positioning) {
         case "absolute":
            this.applyAbsolutePositioningPlacementStyles(style, placement, contentSize, parentBounds, el, noAuto);
            break;

         case "auto":
            if (isTouchDevice())
               this.applyAbsolutePositioningPlacementStyles(style, placement, contentSize, parentBounds, el, noAuto);
            else this.applyFixedPositioningPlacementStyles(style, placement, contentSize, parentBounds, el, noAuto);
            break;

         default:
            this.applyFixedPositioningPlacementStyles(style, placement, contentSize, parentBounds, el, noAuto);
            break;
      }
   }

   setDirectionClass(component: any, placement: string): void {
      var state = {
         "place-left": false,
         "place-right": false,
         "place-up": false,
         "place-down": false,
      };

      component.lastPlacement = placement;

      component.setCSSState({
         ...state,
         ["place-" + placement]: true,
      });
   }

   measureNaturalDropdownSize(instance: InstanceType, component: any): any {
      var { el } = component;
      var size = {
         width: el.offsetWidth,
         height: this.constrain
            ? calculateNaturalElementHeight(el)
            : el.offsetHeight - el.clientHeight + el.scrollHeight,
      };

      if (this.firstChildDefinesHeight && el.firstChild) {
         size.height = el.firstChild.offsetHeight;
      }

      if (this.firstChildDefinesWidth && el.firstChild) {
         size.width = el.firstChild.offsetWidth;
      }

      if (this.onMeasureNaturalContentSize) {
         var more = instance.invoke("onMeasureNaturalContentSize", el, instance, component);
         Object.assign(size, more);
      }

      return size;
   }

   findOptimalPlacement(contentSize: any, target: any, placement: string, lastPlacement: any): any {
      var placementOrder = this.placementOrder.split(" ");
      var best = lastPlacement || placement;
      var first;

      var score = {};
      var viewport = getViewportRect();

      for (var i = 0; i < placementOrder.length; i++) {
         var p = placementOrder[i];
         if (!first) first = p;
         var parts = p.split("-");

         var primary = parts[0];
         var secondary = parts[1] || "center";

         score[p] = 0;
         var vertical = true;

         switch (primary) {
            case "down":
               score[p] += 3 * Math.min(1, (viewport.bottom - target.bottom - this.offset) / contentSize.height);
               break;

            case "up":
               score[p] += 3 * Math.min(1, (target.top - viewport.top - this.offset) / contentSize.height);
               break;

            case "right":
               score[p] += target.right + contentSize.width + this.offset < viewport.right ? 3 : 0;
               vertical = false;
               break;

            case "left":
               score[p] += target.left - contentSize.width - this.offset >= viewport.left ? 3 : 0;
               vertical = false;
               break;
         }

         switch (secondary) {
            case "center":
               if (vertical) {
                  score[p] += (target.right + target.left - contentSize.width) / 2 >= viewport.left ? 1 : 0;
                  score[p] += (target.right + target.left + contentSize.width) / 2 < viewport.right ? 1 : 0;
               } else {
                  score[p] += (target.bottom + target.top - contentSize.height) / 2 >= viewport.top ? 1 : 0;
                  score[p] += (target.bottom + target.top + contentSize.height) / 2 < viewport.bottom ? 1 : 0;
               }
               break;

            case "right":
               score[p] += target.left + contentSize.width < viewport.right ? 2 : 0;
               break;

            case "left":
               score[p] += target.right - contentSize.width >= viewport.left ? 2 : 0;
               break;

            case "up":
               score[p] += target.bottom - contentSize.height >= viewport.top ? 2 : 0;
               break;

            case "down":
               score[p] += target.top + contentSize.height < viewport.bottom ? 2 : 0;
               break;
         }
      }

      if (!(best in score)) best = first;

      for (var k in score) if (score[k] > score[best]) best = k;

      if (this.touchFriendly && isTouchDevice() && score[best] < 5) return "screen-center";

      return best;
   }

   handleKeyDown(e, instance) {
      switch (e.keyCode) {
         case 27: //esc
            var focusable = findFirst(instance.relatedElement, isFocusable);
            if (focusable) focusable.focus();
            e.stopPropagation();
            e.preventDefault();
            break;
      }

      if (this.onKeyDown) instance.invoke("onKeyDown", e, instance);
   }

   renderContents(context, instance) {
      let { CSS, baseClass } = this;
      let result = [super.renderContents(context, instance)];
      if (this.arrow) {
         result.push(
            <div key="arrow-border" className={CSS.element(baseClass, "arrow-border")}></div>,
            <div key="arrow-back" className={CSS.element(baseClass, "arrow-fill")}></div>,
         );
      }
      return result;
   }

   render(context, instance, key) {
      let { CSS, baseClass } = this;
      //if relatedElement is not provided, a beacon is rendered to and used to resolve a nearby element as a target
      //if onResolveTarget doesn't provide another element, the beacon itself is used as a target
      let beacon = null;
      if (this.relatedElement) instance.relatedElement = this.relatedElement;

      if (!this.relatedElement || instance.needsBeacon) {
         beacon = (
            <div
               key={`${key}-beacon`}
               className={CSS.element(baseClass, "beacon")}
               ref={(el) => {
                  if (instance.relatedElement) return;
                  let target = el;
                  if (this.onResolveRelatedElement) target = instance.invoke("onResolveRelatedElement", el, instance);
                  else target = el.previousElementSibling;
                  if (!target) target = el;
                  if (target == el) instance.needsBeacon = true;
                  instance.relatedElement = target;
                  instance.setState({ dummy: {} });
               }}
            />
         );
      }
      return [beacon, instance.relatedElement && super.render(context, instance, key)];
   }

   getOverlayContainer() {
      // this should be instance.relatedElement
      if (this.relatedElement) {
         let container = closestParent(this.relatedElement, (el) => el.dataset && el.dataset.focusableOverlayContainer);
         if (container) return container;
      }
      return super.getOverlayContainer();
   }
}

DropdownBase.prototype.offset = 0;
DropdownBase.prototype.baseClass = "dropdown";
DropdownBase.prototype.matchWidth = true;
DropdownBase.prototype.matchMaxWidth = false;
DropdownBase.prototype.placementOrder = "up down right left";
DropdownBase.prototype.placement = null; //default placement
DropdownBase.prototype.constrain = false;
DropdownBase.prototype.positioning = "fixed";
DropdownBase.prototype.touchFriendly = false;
DropdownBase.prototype.arrow = false;
DropdownBase.prototype.pad = false;
DropdownBase.prototype.elementExplode = 0;
DropdownBase.prototype.closeOnScrollDistance = 50;
DropdownBase.prototype.screenPadding = 5;
DropdownBase.prototype.firstChildDefinesHeight = false;
DropdownBase.prototype.firstChildDefinesWidth = false;
DropdownBase.prototype.cover = false;

export class Dropdown extends DropdownBase<DropdownConfig, DropdownInstance> {}

Widget.alias("dropdown", Dropdown);
Localization.registerPrototype("cx/widgets/Dropdown", Dropdown);

function getViewportRect(padding = 0) {
   return {
      left: padding,
      top: padding,
      right: document.documentElement.offsetWidth - padding,
      bottom: document.documentElement.offsetHeight - padding,
   };
}
