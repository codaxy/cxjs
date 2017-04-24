import {Widget, VDOM} from '../../ui/Widget';
import {Cx} from '../../ui/Cx';
import {HtmlElement} from '../HtmlElement';
import {findFirstChild, isFocusable, isSelfOrDescendant, closest, isFocusedDeep} from '../../util/DOM';
import {Dropdown} from '../overlay/Dropdown';
import {FocusManager, oneFocusOut, offFocusOut} from '../../ui/FocusManager';
import {Debug, menuFlag} from '../../util/Debug';
import DropdownIcon from '../icons/drop-down';
import {Localization} from '../../ui/Localization';
import {KeyCode} from '../../util/KeyCode';
import {isTouchEvent} from '../../util/isTouchEvent';

/*
 Functionality:
 - renders dropdown when focused
 - tracks focus and closes if focusElement goes outside the dropdown
 - switches focus to the dropdown when right key pressed
 - listens to dropdown's key events and captures focus back when needed
 - automatically opens the dropdown if mouse is hold over for a period of time
 */

export class MenuItem extends HtmlElement {

   explore(context, instance) {
      instance.horizontal = this.horizontal;
      let {lastMenu, lastMenuItem} = context;
      if (lastMenu) {
         instance.horizontal = lastMenu.horizontal;
         instance.padding = lastMenu.itemPadding;
      }

      instance.parentPositionChangeEvent = context.parentPositionChangeEvent;

      if (!instance.padding && this.pad == true)
         instance.padding = 'medium';

      if (this.padding)
         instance.padding = this.padding;

      context.lastMenuItem = this;
      super.explore(context, instance);
      context.lastMenuItem = lastMenuItem;
   }

   render(context, instance, key) {
      return (
         <MenuItemComponent
            key={key}
            instance={instance}
            data={instance.data}
            shouldUpdate={instance.shouldUpdate}
         >
            {this.renderChildren(context, instance)}
         </MenuItemComponent>
      )
   }

   add(element) {
      if (element && typeof element == 'object' && element.putInto == 'dropdown') {
         this.dropdown = {...element};
         delete this.dropdown.putInto;
      } else
         super.add(...arguments);
   }

   addText(text) {
      this.add({
         type: HtmlElement,
         tag: 'span',
         text: text
      });
   }
}

MenuItem.prototype.baseClass = 'menuitem';
MenuItem.prototype.hoverFocusTimeout = 500;
MenuItem.prototype.hoverToOpen = false;
MenuItem.prototype.clickToOpen = false;
MenuItem.prototype.horizontal = true;
MenuItem.prototype.memoize = false;
MenuItem.prototype.arrow = false;
MenuItem.prototype.dropdownOptions = null;
MenuItem.prototype.showCursor = true;
MenuItem.prototype.pad = true;
MenuItem.prototype.placement = null; //default dropdown placement

Widget.alias('submenu', MenuItem);
Localization.registerPrototype('cx/widgets/MenuItem', MenuItem);

class MenuItemComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         dropdownOpen: false
      }
   }

   shouldComponentUpdate(props, state) {
      return props.shouldUpdate
         || state != this.state
         || state.dropdownOpen; //always render if dropdown is open as we don't know if dropdown contents has changed
   }

   getDropdown() {
      let {horizontal, controller, widget, parentPositionChangeEvent} = this.props.instance;
      if (!this.dropdown && widget.dropdown) {
         this.dropdown = Widget.create(Dropdown, {
            matchWidth: false,
            ...widget.dropdownOptions,
            relatedElement: this.el.parentElement,
            placementOrder: horizontal ? 'down-right down down-left up-right up up-left' : 'right-down right right-up left-down left left-up',
            placement: widget.placement,
            controller: controller,
            trackScroll: true,
            inline: true,
            onKeyDown: ::this.onDropdownKeyDown,
            items: widget.dropdown,
            parentPositionChangeEvent,
            pipeValidateDropdownPosition: cb => {
               this.validateDropdownPosition = cb;
            }
         });
      }
      return this.dropdown;
   }

   render() {

      let {instance, data} = this.props;
      let {store, widget} = instance;
      let {CSS, baseClass} = widget;
      let dropdown = this.state.dropdownOpen
         && <Cx widget={this.getDropdown()} store={store} options={{name: 'submenu'}}/>;

      let arrow = widget.arrow && <DropdownIcon className={CSS.element(baseClass, 'arrow')}/>;

      let classNames = CSS.expand(data.classNames, CSS.state({
         open: this.state.dropdownOpen,
         horizontal: instance.horizontal,
         vertical: !instance.horizontal,
         arrow: widget.arrow,
         cursor: widget.showCursor,
         [instance.padding + '-padding']: instance.padding
      }));

      return <div
         className={classNames}
         style={data.style}
         tabIndex={widget.dropdown ? 0 : null}
         ref={el => {
            this.el = el
         }}
         onKeyDown={::this.onKeyDown}
         onMouseDown={::this.onMouseDown}
         onMouseEnter={::this.onMouseEnter}
         onMouseLeave={::this.onMouseLeave}
         onFocus={::this.onFocus}
         onClick={::this.onClick}
         onBlur={::this.onBlur}
      >
         {this.props.children}
         {arrow}
         {dropdown}
      </div>
   }

   componentDidUpdate() {
      if (this.state.dropdownOpen && this.validateDropdownPosition) {
         this.validateDropdownPosition();
      }
   }

   onDropdownKeyDown(e) {
      Debug.log(menuFlag, 'MenuItem', 'dropdownKeyDown');
      let {horizontal} = this.props.instance;
      if (e.keyCode == KeyCode.esc || (horizontal ? e.keyCode == KeyCode.up : e.keyCode == KeyCode.left)) {
         FocusManager.focus(this.el);
         e.preventDefault();
         e.stopPropagation();
      }
   }

   clearAutoFocusTimer() {
      if (this.autoFocusTimerId) {
         Debug.log(menuFlag, 'MenuItem', 'autoFocusCancel');
         clearTimeout(this.autoFocusTimerId);
         delete this.autoFocusTimerId;
      }
   }

   onMouseEnter(e) {
      Debug.log(menuFlag, 'MenuItem', 'mouseEnter', this.el);
      let {widget} = this.props.instance;
      if (widget.dropdown && !this.state.dropdownOpen) {
         this.clearAutoFocusTimer();

         if (widget.hoverToOpen)
            FocusManager.focus(this.el);
         else if (!widget.clickToOpen) {
            // Automatically open the dropdown only if parent menu is focused
            let commonParentMenu = closest(this.el, el => el.tagName == 'UL' && el.contains(document.activeElement));
            if (commonParentMenu)
               this.autoFocusTimerId = setTimeout(() => {
                  delete this.autoFocusTimerId;
                  if (!this.state.dropdownOpen) {
                     Debug.log(menuFlag, 'MenuItem', 'hoverFocusTimeout:before', this.el);
                     FocusManager.focus(this.el);
                     Debug.log(menuFlag, 'MenuItem', 'hoverFocusTimeout:after', this.el, document.activeElement);
                  }
               }, widget.hoverFocusTimeout);
         }

         e.stopPropagation();
         e.preventDefault();
      }
   }

   onMouseLeave(e) {
      let {widget} = this.props.instance;
      if (widget.dropdown) {
         Debug.log(menuFlag, 'MenuItem', 'mouseLeave', this.el);
         this.clearAutoFocusTimer();

         if (widget.hoverToOpen && document.activeElement == this.el)
            this.el.blur();
      }
   }

   onKeyDown(e) {
      Debug.log(menuFlag, 'MenuItem', 'keyDown', this.el);
      let {horizontal, widget} = this.props.instance;
      if (widget.dropdown) {
         if (e.target == this.el && (e.keyCode == KeyCode.enter || (horizontal ? e.keyCode == KeyCode.down : e.keyCode == KeyCode.right))) {
            this.openDropdown(() => {
               let focusableChild = findFirstChild(this.el, isFocusable);
               if (focusableChild)
                  FocusManager.focus(focusableChild);
            });
            e.preventDefault();
            e.stopPropagation();
         }

         if (e.keyCode == KeyCode.esc) {
            FocusManager.focus(this.el);
            e.preventDefault();
            e.stopPropagation();
            this.closeDropdown();
         }
      }
   }

   onMouseDown(e) {
      let {widget} = this.props.instance;
      if (widget.dropdown) {
         e.stopPropagation();
         if (this.state.dropdownOpen && !widget.hoverToOpen)
            this.closeDropdown();
         else {
            //IE sometimes does not focus parent on child click
            if (!isFocusedDeep(this.el))
               FocusManager.focus(this.el);
            this.openDropdown();
         }
      }
   }

   openDropdown(callback) {
      let {widget} = this.props.instance;
      if (widget.dropdown) {
         this.setState({
            dropdownOpen: true
         }, callback);
      }
   }

   onClick(e) {
      e.stopPropagation();

      let {widget} = this.props.instance;
      if (widget.dropdown)
         e.preventDefault(); //prevent navigation
   }

   onFocus() {
      let {widget} = this.props.instance;
      if (widget.dropdown) {
         oneFocusOut(this, this.el, ::this.onFocusOut);
         Debug.log(menuFlag, 'MenuItem', 'focus', this.el, document.activeElement);
         this.clearAutoFocusTimer();
         this.openDropdown();
      }
   }

   onBlur() {
      FocusManager.nudge();
   }

   closeDropdown() {
      this.setState({
         dropdownOpen: false
      });
   }

   onFocusOut(focusedElement) {
      Debug.log(menuFlag, 'MenuItem', 'focusout', this.el, focusedElement);
      this.clearAutoFocusTimer();
      if (!isSelfOrDescendant(this.el, focusedElement)) {
         Debug.log(menuFlag, 'MenuItem', 'closing dropdown', this.el, focusedElement);
         this.closeDropdown();
      }
   }

   componentWillUnmount() {
      this.clearAutoFocusTimer();
      offFocusOut(this);

      if (this.offParentPositionChange)
         this.offParentPositionChange();
   }
}
