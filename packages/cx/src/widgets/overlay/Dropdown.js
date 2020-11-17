import { Widget, VDOM } from "../../ui/Widget";
import { Overlay } from "./Overlay";
import { findFirst, isFocusable, getFocusedElement } from "../../util/DOM";
import { isTouchDevice } from "../../util/isTouchDevice";
import { ResizeManager } from "../../ui/ResizeManager";
import { Localization } from "../../ui/Localization";
import { SubscriberList } from "../../util/SubscriberList";
import { getTopLevelBoundingClientRect } from "../../util/getTopLevelBoundingClientRect";
import { calculateNaturalElementHeight } from "../../util/calculateNaturalElementHeight";

/*
 Dropdown specific features:
 - ability to position itself next to the target element
 - monitor scrollable parents and updates it's position
 */

export class Dropdown extends Overlay {
   init() {
      if (this.trackMouse) {
         this.trackMouseX = true;
         this.trackMouseY = true;
      }
      super.init();
   }

   declareData() {
      return super.declareData(...arguments, {
         placement: undefined,
      });
   }

   initInstance(context, instance) {
      instance.positionChangeSubcribers = new SubscriberList();
      instance.mousePosition = this.mousePosition;
      super.initInstance(context, instance);
   }

   explore(context, instance) {
      context.push("parentPositionChangeEvent", instance.positionChangeSubcribers);
      context.push("lastDropdown", instance);
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop("parentPositionChangeEvent");
      context.pop("lastDropdown");
   }

   overlayDidMount(instance, component) {
      super.overlayDidMount(instance, component);
      var scrollableParents = (component.scrollableParents = [window]);
      component.updateDropdownPosition = (e) => this.updateDropdownPosition(instance, component);

      var el = instance.relatedElement.parentElement;
      while (el) {
         scrollableParents.push(el);
         el = el.parentElement;
      }
      scrollableParents.forEach((el) => {
         el.addEventListener("scroll", component.updateDropdownPosition);
      });
      component.offResize = ResizeManager.subscribe(component.updateDropdownPosition);

      if (this.onDropdownDidMount) instance.invoke("onDropdownDidMount", instance, component);

      if (this.pipeValidateDropdownPosition)
         instance.invoke("pipeValidateDropdownPosition", component.updateDropdownPosition, instance);

      if (this.parentPositionChangeEvent)
         component.offParentPositionChange = this.parentPositionChangeEvent.subscribe(component.updateDropdownPosition);
   }

   overlayDidUpdate(instance, component) {
      this.updateDropdownPosition(instance, component);
   }

   overlayWillUnmount(instance, component) {
      var { scrollableParents } = component;
      if (scrollableParents) {
         scrollableParents.forEach((el) => {
            el.removeEventListener("scroll", component.updateDropdownPosition);
         });
         delete component.scrollableParents;
         delete component.updateDropdownPosition;
      }
      if (component.offResize) component.offResize();

      if (this.pipeValidateDropdownPosition) instance.invoke("pipeValidateDropdownPosition", null, instance);

      if (component.offParentPositionChange) component.offParentPositionChange();

      delete component.parentBounds;
   }

   updateDropdownPosition(instance, component) {
      var { el } = component;
      var { data, relatedElement } = instance;
      var parentBounds = (component.parentBounds = getTopLevelBoundingClientRect(relatedElement));

      //getBoundingClientRect() will return an empty rect if the element is hidden or removed
      if (parentBounds.left == 0 && parentBounds.top == 0 && parentBounds.bottom == 0 && parentBounds.right == 0)
         return;

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

      if (this.onDropdownPositionDidUpdate) instance.invoke("onDropdownPositionDidUpdate", instance, component);

      instance.positionChangeSubcribers.notify();
   }

   applyFixedPositioningPlacementStyles(style, placement, contentSize, rel, el, noAuto) {
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

   applyAbsolutePositioningPlacementStyles(style, placement, contentSize, rel, el, noAuto) {
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

   applyPositioningPlacementStyles(style, placement, contentSize, parentBounds, el, noAuto) {
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

   setDirectionClass(component, placement) {
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

   measureNaturalDropdownSize(instance, component) {
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

   findOptimalPlacement(contentSize, target, placement, lastPlacement) {
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
            <div key="arrow-back" className={CSS.element(baseClass, "arrow-fill")}></div>
         );
      }
      return result;
   }

   render(context, instance, key) {
      let { CSS, baseClass } = this;
      //if relatedElement is not provided, a beacon is rendered to and used to resolve a nearby element as a target
      //if onResolveTarget doesn't provide another element, the beacon itself is used as a target
      let beacon = null;
      if (this.relatedElement)
         instance.relatedElement = this.relatedElement;

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
}

   Dropdown.prototype.offset = 0;
   Dropdown.prototype.baseClass = "dropdown";
   Dropdown.prototype.matchWidth = true;
   Dropdown.prototype.placementOrder = "up down right left";
   Dropdown.prototype.placement = null; //default placement
   Dropdown.prototype.constrain = false;
   Dropdown.prototype.positioning = "fixed";
   Dropdown.prototype.touchFriendly = false;
   Dropdown.prototype.arrow = false;
   Dropdown.prototype.pad = false;
   Dropdown.prototype.elementExplode = 0;
   Dropdown.prototype.screenPadding = 5;
   Dropdown.prototype.firstChildDefinesHeight = false;
   Dropdown.prototype.firstChildDefinesWidth = false;
   Dropdown.prototype.cover = false;

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
