import {Widget, VDOM} from '../../ui/Widget';
import {Overlay} from './Overlay';
import {findFirst, isFocusable, getFocusedElement} from '../../util/DOM';
import {isTouchDevice} from '../../util/isTouchDevice';
import {ResizeManager} from '../../ui/ResizeManager';
import {Localization} from '../../ui/Localization';

/*
 Dropdown specific features:
 - ability to position itself next to parent element
 - monitor scrollable parents and updates it's position
 */

export class Dropdown extends Overlay {

   declareData() {
      return super.declareData(...arguments, {
         placement: undefined
      })
   }

   overlayDidMount(instance, component) {
      super.overlayDidMount(instance, component);
      var scrollableParents = component.scrollableParents = [window];
      component.updateDropdownPosition = (e) => this.updateDropdownPosition(instance, component);

      this.updateDropdownPosition(instance, component);

      var el = this.relatedElement.parentElement;
      while (el) {
         scrollableParents.push(el);
         el = el.parentElement;
      }
      scrollableParents.forEach(el => {
         el.addEventListener('scroll', component.updateDropdownPosition)
      });
      component.offResize = ResizeManager.subscribe(component.updateDropdownPosition);

      if (this.onDropdownDidMount)
         this.onDropdownDidMount(instance, component);
   }

   overlayDidUpdate(instance, component) {
      this.updateDropdownPosition(instance, component);
   }

   overlayWillUnmount(instance, component) {
      var {scrollableParents} = component;
      if (scrollableParents) {
         scrollableParents.forEach(el => {
            el.removeEventListener('scroll', component.updateDropdownPosition)
         });
         delete component.scrollableParents;
         delete component.updateDropdownPosition;
      }
      if (component.offResize)
         component.offResize();
   }

   updateDropdownPosition(instance, component) {
      var {el} = component;
      var {data} = instance;
      var parentBounds = this.relatedElement.getBoundingClientRect();

      if (this.pad && typeof this.elementExplode == 'number') {
         parentBounds = {
            left: parentBounds.left - this.elementExplode,
            right: parentBounds.right + this.elementExplode,
            top: parentBounds.top - this.elementExplode,
            bottom: parentBounds.bottom + this.elementExplode,
         }
      }

      if (this.trackMouse && component.mousePosition) {
         parentBounds = {
            left: component.mousePosition.x,
            right: component.mousePosition.x,
            top: component.mousePosition.y,
            bottom: component.mousePosition.y,
         }
      }
      var style = {};
      if (this.matchWidth)
         style.minWidth = `${parentBounds.right - parentBounds.left}px`;

      var contentSize = this.measureNaturalDropdownSize(instance, component);

      var placement = this.findOptimalPlacement(contentSize, parentBounds, data.placement, component.lastPlacement);

      switch (this.positioning) {

         case 'absolute':
            this.applyAbsolutePositioningPlacementStyles(style, placement, contentSize, parentBounds, el);
            break;

         case 'auto':
            if (isTouchDevice())
               this.applyAbsolutePositioningPlacementStyles(style, placement, contentSize, parentBounds, el);
            else
               this.applyFixedPositioningPlacementStyles(style, placement, contentSize, parentBounds, el);
            break;

         default:
            this.applyFixedPositioningPlacementStyles(style, placement, contentSize, parentBounds, el);
            break;
      }

      component.setCustomStyle(style);
      this.setDirectionClass(component, placement);

      if (this.onDropdownPositionDidUpdate)
         this.onDropdownPositionDidUpdate(instance, component);
   }

   applyFixedPositioningPlacementStyles(style, placement, contentSize, rel, el) {
      let viewport = getViewportRect(this.screenPadding);
      let pad = `${this.screenPadding}px`;

      style.position = "fixed";

      switch (placement) {
         case 'down':
         case 'down-center':
            style.top = `${rel.bottom + this.offset}px`;
            style.right = 'auto';
            style.bottom = this.constrain && (rel.bottom + this.offset + contentSize.height > viewport.bottom)
               ? pad
               : 'auto';
            style.left = `${(rel.left + rel.right - el.offsetWidth) / 2}px`;
            break;

         case 'down-right':
            style.top = `${rel.bottom + this.offset}px`;
            style.right = 'auto';
            style.left = `${rel.left}px`;
            style.bottom = this.constrain && (rel.bottom + this.offset + contentSize.height > viewport.bottom)
               ? pad
               : 'auto';
            break;

         case 'down-left':
            style.top = `${rel.bottom + this.offset}px`;
            style.right = `${window.innerWidth - rel.right}px`;
            style.bottom = this.constrain && (rel.bottom + this.offset + contentSize.height > viewport.bottom)
               ? pad
               : 'auto';
            style.left = 'auto';
            break;

         case 'up':
         case 'up-center':
            style.top = this.constrain && (rel.top - this.offset - contentSize.height < viewport.top) ? pad : 'auto';
            style.right = 'auto';
            style.bottom = `${window.innerHeight - rel.top + this.offset}px`;
            style.left = `${(rel.left + rel.right - el.offsetWidth) / 2}px`;
            break;

         case 'up-right':
            style.top = this.constrain && (rel.top - this.offset - contentSize.height < viewport.top) ? pad : 'auto';
            style.right = 'auto';
            style.bottom = `${window.innerHeight - rel.top + this.offset}px`;
            style.left = `${rel.left}px`;
            break;

         case 'up-left':
            style.top = this.constrain && (rel.top - this.offset - contentSize.height < viewport.top) ? pad : 'auto';
            style.right = `${window.innerWidth - rel.right}px`;
            style.bottom = `${window.innerHeight - rel.top + this.offset}px`;
            style.left = 'auto';
            break;

         case 'right':
         case 'right-center':
            style.top = `${(rel.top + rel.bottom - el.offsetHeight) / 2}px`;
            style.right = 'auto';
            style.bottom = 'auto';
            style.left = `${rel.right + this.offset}px`;
            break;

         case 'right-down':
            style.top = `${rel.top}px`;
            style.right = 'auto';
            style.bottom = 'auto';
            style.left = `${rel.right + this.offset}px`;
            break;

         case 'right-up':
            style.top = 'auto';
            style.right = 'auto';
            style.bottom = `${window.innerHeight - rel.bottom}px`;
            style.left = `${rel.right + this.offset}px`;
            break;

         case 'left':
         case 'left-center':
            style.top = `${(rel.top + rel.bottom - el.offsetHeight) / 2}px`;
            style.right = `${window.innerWidth - rel.left + this.offset}px`;
            style.bottom = 'auto';
            style.left = 'auto';
            break;

         case 'left-down':
            style.top = `${rel.top}px`;
            style.right = `${window.innerWidth - rel.left + this.offset}px`;
            style.bottom = 'auto';
            style.left = 'auto';
            break;

         case 'left-up':
            style.top = 'auto';
            style.right = `${window.innerWidth - rel.left + this.offset}px`;
            style.bottom = `${window.innerHeight - rel.bottom}px`;
            style.left = 'auto';
            break;

         case 'screen-center':
            var w = Math.min(contentSize.width, window.innerWidth);
            var h = Math.min(contentSize.height, window.innerHeight);
            style.top = `${(window.innerHeight - h) / 2}px`;
            style.right = `${(window.innerWidth - w) / 2}px`;
            style.bottom = `${(window.innerHeight - h) / 2}px`;
            style.left = `${(window.innerWidth - w) / 2}px`;
            break;
      }
   }

   applyAbsolutePositioningPlacementStyles(style, placement, contentSize, rel, el) {
      var viewport = getViewportRect(this.screenPadding);

      style.position = "absolute";

      switch (placement) {
         case 'down':
         case 'down-center':
            style.top = `${rel.bottom - rel.top + this.offset}px`;
            style.right = 'auto';
            style.bottom = this.constrain && (rel.bottom + this.offset + contentSize.height > viewport.bottom)
               ? `${rel.bottom + this.offset - viewport.bottom}px`
               : 'auto';
            style.left = `${(rel.right - rel.left - el.offsetWidth) / 2}px`;
            break;

         case 'down-right':
            style.top = `${rel.bottom - rel.top + this.offset}px`;
            style.right = 'auto';
            style.left = `0`;
            style.bottom = this.constrain && (rel.bottom + this.offset + contentSize.height > viewport.bottom)
               ? `${rel.bottom + this.offset - viewport.bottom}px`
               : 'auto';
            break;

         case 'down-left':
            style.top = `${rel.bottom - rel.top + this.offset}px`;
            style.right = `0`;
            style.bottom = this.constrain && (rel.bottom + this.offset + contentSize.height > viewport.bottom)
               ? `${rel.bottom + this.offset - viewport.bottom}px`
               : 'auto';
            style.left = 'auto';
            break;

         case 'up':
         case 'up-center':
            style.top = this.constrain && (rel.top - this.offset - contentSize.height < viewport.top)
               ? `${this.offset - rel.top + viewport.top}px`
               : 'auto';
            style.right = 'auto';
            style.bottom = `${rel.bottom - rel.top - this.offset}px`;
            style.left = `${(rel.right - rel.left - el.offsetWidth) / 2}px`;
            break;

         case 'up-right':
            style.top = this.constrain && (rel.top - this.offset - contentSize.height < viewport.top)
               ? `${this.offset - rel.top + viewport.top}px`
               : 'auto';
            style.right = 'auto';
            style.bottom = `${rel.bottom - rel.top - this.offset}px`;
            style.left = `0`;
            break;

         case 'up-left':
            style.top = this.constrain && (rel.top - this.offset - contentSize.height < viewport.top)
               ? `${this.offset - rel.top + viewport.top}px`
               : 'auto';
            style.right = `0`;
            style.bottom = `${rel.bottom - rel.top - this.offset}px`;
            style.left = 'auto';
            break;

         case 'right':
         case 'right-center':
            style.top = `${(rel.bottom - rel.top - el.offsetHeight) / 2}px`;
            style.right = 'auto';
            style.bottom = 'auto';
            style.left = `${rel.right - rel.left + this.offset}px`;
            break;

         case 'right-down':
            style.top = `0`;
            style.right = 'auto';
            style.bottom = 'auto';
            style.left = `${rel.right - rel.left + this.offset}px`;
            break;

         case 'right-up':
            style.top = 'auto';
            style.right = 'auto';
            style.bottom =  `0`;
            style.left = `${rel.right - rel.left + this.offset}px`;
            break;

         case 'left':
         case 'left-center':
            style.top = `${(rel.bottom - rel.top - el.offsetHeight) / 2}px`;
            style.right = `${rel.right - rel.left + this.offset}px`;
            style.bottom = 'auto';
            style.left = 'auto';
            break;

         case 'left-down':
            style.top = `0`;
            style.right = `${rel.right - rel.left + this.offset}px`;
            style.bottom = 'auto';
            style.left = 'auto';
            break;

         case 'left-up':
            style.top = 'auto';
            style.right = `${rel.right - rel.left + this.offset}px`;
            style.bottom =  `0`;
            style.left = 'auto';
            break;
      }
   }

   setDirectionClass(component, placement) {

      var state = {
         'place-left': false,
         'place-right': false,
         'place-up': false,
         'place-down': false
      };

      component.lastPlacement = placement;

      component.setCSSState({
         ...state,
         ['place-' + placement]: true
      });
   }

   measureNaturalDropdownSize(instance, component) {
      var {el} = component;
      var size = {
         width: el.offsetWidth,
         height: el.offsetHeight
      };

      if (this.firstChildDefinesHeight && el.firstChild) {
         size.height = el.firstChild.offsetHeight;
      }

      if (this.firstChildDefinesWidth && el.firstChild) {
         size.width = el.firstChild.offsetWidth;
      }

      if (this.onMeasureDropdownNaturalSize) {
         var more = this.onMeasureDropdownNaturalSize(instance, component);
         Object.assign(size, more);
      }
      return size;
   }

   findOptimalPlacement(contentSize, target, placement, lastPlacement) {
      var placementOrder = this.placementOrder.split(' ');
      var best = lastPlacement || placement;
      var first;

      var score = {};
      var viewport = getViewportRect();

      for (var i = 0; i < placementOrder.length; i++) {
         var p = placementOrder[i];
         if (!first)
            first = p;
         var parts = p.split('-');

         var primary = parts[0];
         var secondary = parts[1] || 'center';

         score[p] = 0;
         var vertical = true;

         switch (primary) {
            case 'down':
               score[p] += 3 * Math.min(1, (viewport.bottom - target.bottom - this.offset) / contentSize.height);
               break;

            case 'up':
               score[p] += 3 * Math.min(1, (target.top - viewport.top - this.offset) / contentSize.height);
               break;

            case 'right':
               score[p] += target.right + contentSize.width + this.offset < viewport.right ? 3 : 0;
               vertical = false;
               break;

            case 'left':
               score[p] += target.left - contentSize.width - this.offset >= viewport.left ? 3 : 0;
               vertical = false;
               break;
         }

         switch (secondary) {
            case 'center':
               if (vertical) {
                  score[p] += (target.right + target.left - contentSize.width) / 2 >= viewport.left ? 1 : 0;
                  score[p] += (target.right + target.left + contentSize.width) / 2 < viewport.right ? 1 : 0;
               }
               else {
                  score[p] += (target.bottom + target.top - contentSize.height) / 2 >= viewport.top ? 1 : 0;
                  score[p] += (target.bottom + target.top + contentSize.height) / 2 < viewport.bottom ? 1 : 0;
               }
               break;

            case 'right':
               score[p] += target.left + contentSize.width < viewport.right ? 2 : 0;
               break;

            case 'left':
               score[p] += target.right - contentSize.width >= viewport.left ? 2 : 0;
               break;

            case 'up':
               score[p] += target.bottom - contentSize.height >= viewport.top ? 2 : 0;
               break;

            case 'down':
               score[p] += target.top + contentSize.height < viewport.bottom ? 2 : 0;
               break;
         }
      }

      if (!(best in score))
         best = first;

      for (var k in score)
         if (score[k] > score[best])
            best = k;

      if (this.touchFriendly && score[best] < 5)
         return 'screen-center';

      return best;
   }

   handleKeyDown(e, instance) {
      switch (e.keyCode) {
         case 27: //esc
            var focusable = findFirst(this.relatedElement, isFocusable);
            if (focusable)
               focusable.focus();
            e.stopPropagation();
            e.preventDefault();
            break;
      }

      if (this.onKeyDown)
         this.onKeyDown(e, instance);
   }

   renderContents(context, instance) {
      let {CSS, baseClass} = this;
      if (!this.arrow)
         return super.renderContents(context, instance);

      let result = [...super.renderContents(context, instance)];
      result.push(
         <div key="arrow-border" className={CSS.element(baseClass, "arrow-border")}></div>,
         <div key="arrow-back" className={CSS.element(baseClass, "arrow-fill")}></div>
      );
      return result;
   }
}

Dropdown.prototype.offset = 0;
Dropdown.prototype.baseClass = 'dropdown';
Dropdown.prototype.placement = undefined;
Dropdown.prototype.matchWidth = true;
Dropdown.prototype.placementOrder = 'up down right left';
Dropdown.prototype.placement = null; //default placement
Dropdown.prototype.constrain = false;
Dropdown.prototype.positioning = 'fixed';
Dropdown.prototype.touchFriendly = false;
Dropdown.prototype.arrow = false;
Dropdown.prototype.pad = false;
Dropdown.prototype.elementExplode = 0;
Dropdown.prototype.screenPadding = 5;
Dropdown.prototype.firstChildDefinesHeight = false;
Dropdown.prototype.firstChildDefinesWidth = true;

Widget.alias('dropdown', Dropdown);
Localization.registerPrototype('cx/widgets/Dropdown', Dropdown);

function getViewportRect(padding = 0) {
   return {
      left: padding,
      top: padding,
      right: window.innerWidth - padding,
      bottom: window.innerHeight - padding,
      // width: window.innerWidth - 2 * padding,
      // height: window.innerHeight - 2 * padding,
   }
}