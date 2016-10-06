import {Widget, VDOM} from '../Widget';
import {CSS} from '../CSS';
import {Overlay} from './Overlay';
import {findFirst, isFocusable, getFocusedElement} from '../../util/DOM';
import {getViewportSize} from '../../util/getViewportSize';
import {ResizeManager} from '../ResizeManager';

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
      var x = this.relatedElement.getBoundingClientRect();

      if (this.trackMouse && component.mousePosition) {
         x = {
            left: component.mousePosition.x,
            right: component.mousePosition.x,
            top: component.mousePosition.y,
            bottom: component.mousePosition.y,
         }
      }
      var style = {};
      if (this.matchWidth)
         style.minWidth = `${x.right - x.left}px`;

      var contentSize = this.measureNaturalDropdownSize(instance, component);

      var viewport = getViewportSize();

      var placement = this.findOptimalPlacement(contentSize, x, data.placement);
      switch (placement) {
         case 'down':
         case 'down-center':
            style.top = `${x.bottom + this.offset}px`;
            style.right = 'auto';
            style.bottom = this.constrain && (x.bottom + this.offset + contentSize.height > viewport.height)
               ? '0'
               : 'auto';
            style.left = `${(x.left + x.right - el.offsetWidth) / 2}px`;
            break;

         case 'down-right':
            style.top = `${x.bottom + this.offset}px`;
            style.right = 'auto';
            style.left = `${x.left}px`;
            style.bottom = this.constrain && (x.bottom + this.offset + contentSize.height > viewport.height)
               ? '0'
               : 'auto';
            break;

         case 'down-left':
            style.top = `${x.bottom + this.offset}px`;
            style.right = `${viewport.width - x.right}px`;
            style.bottom = this.constrain && (x.bottom + this.offset + contentSize.height > viewport.height)
               ? '0'
               : 'auto';
            style.left = 'auto';
            break;

         case 'up':
         case 'up-center':
            style.top = this.constrain && (x.top - this.offset - contentSize.height < 0) ? '0' : 'auto';
            style.right = 'auto';
            style.bottom = `${viewport.height - x.top + this.offset}px`;
            style.left = `${(x.left + x.right - el.offsetWidth) / 2}px`;
            break;

         case 'up-right':
            style.top = this.constrain && (x.top - this.offset - contentSize.height < 0) ? '0' : 'auto';
            style.right = 'auto';
            style.bottom = `${viewport.height - x.top + this.offset}px`;
            style.left = `${x.left}px`;
            break;

         case 'up-left':
            style.top = this.constrain && (x.top - this.offset - contentSize.height < 0) ? '0' : 'auto';
            style.right = `${viewport.width - x.right}px`;
            style.bottom = `${viewport.height - x.top + this.offset}px`;
            style.left = 'auto';
            break;

         case 'right':
         case 'right-center':
            style.top = `${(x.top + x.bottom - el.offsetHeight) / 2}px`;
            style.right = 'auto';
            style.bottom = 'auto';
            style.left = `${x.right + this.offset}px`;
            break;

         case 'right-down':
            style.top = `${x.top}px`;
            style.right = 'auto';
            style.bottom = 'auto';
            style.left = `${x.right + this.offset}px`;
            break;

         case 'right-up':
            style.top = 'auto';
            style.right = 'auto';
            style.bottom =  `${viewport.height - x.bottom}px`;
            style.left = `${x.right + this.offset}px`;
            break;

         case 'left':
         case 'left-center':
            style.top = `${(x.top + x.bottom - el.offsetHeight) / 2}px`;
            style.right = `${viewport.width - x.left + this.offset}px`;
            style.bottom = 'auto';
            style.left = 'auto';
            break;

         case 'left-down':
            style.top = `${x.top}px`;
            style.right = `${viewport.width - x.left + this.offset}px`;
            style.bottom = 'auto';
            style.left = 'auto';
            break;

         case 'left-up':
            style.top = 'auto';
            style.right = `${viewport.width - x.left + this.offset}px`;
            style.bottom =  `${viewport.height - x.bottom}px`;
            style.left = 'auto';
            break;
      }

      component.setCustomStyle(style);
      this.setDirectionClass(component, placement);

      if (this.onDropdownPositionDidUpdate)
         this.onDropdownPositionDidUpdate(instance, component);
   }

   setDirectionClass(component, placement) {

      var state = {
         'place-left': false,
         'place-right': false,
         'place-up': false,
         'place-down': false
      };

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
      if (this.onMeasureDropdownNaturalSize) {
         var more = this.onMeasureDropdownNaturalSize(instance, component);
         Object.assign(size, more);
      }
      return size;
   }

   findOptimalPlacement(contentSize, x, placement) {
      var placementOrder = this.placementOrder.split(' ');
      var best = placement;
      var first;

      var score = {};
      var viewport = getViewportSize();

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
               score[p] += 3 * Math.min(1, (viewport.height - x.bottom - this.offset) / contentSize.height);
               break;

            case 'up':
               score[p] += 3 * Math.min(1, (x.top - this.offset) / contentSize.height);
               break;

            case 'right':
               score[p] += x.right + contentSize.width + this.offset < viewport.width ? 3 : 0;
               vertical = false;
               break;

            case 'left':
               score[p] += x.left - contentSize.width - this.offset >= 0 ? 3 : 0;
               vertical = false;
               break;
         }

         switch (secondary) {
            case 'center':
               if (vertical) {
                  score[p] += (x.right + x.left - contentSize.width) / 2 >= 0 ? 1 : 0;
                  score[p] += (x.right + x.left + contentSize.width) / 2 < viewport.width ? 1 : 0;
               }
               else {
                  score[p] += (x.bottom + x.top - contentSize.height) / 2 >= 0 ? 1 : 0;
                  score[p] += (x.bottom + x.top + contentSize.height) / 2 < viewport.height ? 1 : 0;
               }
               break;

            case 'right':
               score[p] += x.left + contentSize.width < viewport.width ? 2 : 0;
               break;

            case 'left':
               score[p] += x.right - contentSize.width >= 0 ? 2 : 0;
               break;

            case 'up':
               score[p] += x.bottom - contentSize.height > 0 ? 2 : 0;
               break;

            case 'down':
               score[p] += x.top + contentSize.height < viewport.height ? 2 : 0;
               break;
         }
      }

      if (!(best in score))
         best = first;

      for (var k in score)
         if (score[k] > score[best])
            best = k;

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
}

Dropdown.prototype.offset = 0;
Dropdown.prototype.baseClass = 'dropdown';
Dropdown.prototype.placement = undefined;
Dropdown.prototype.matchWidth = true;
Dropdown.prototype.placementOrder = 'up down right left';
Dropdown.prototype.placement = null; //default placement
Dropdown.prototype.constrain = false;

Widget.alias('dropdown', Dropdown);