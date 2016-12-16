import {Widget, VDOM} from '../../ui/Widget';
import {HtmlElement} from '../HtmlElement';
import {findFirstChild, isFocusable, isSelfOrDescendant, closest, isFocusedDeep} from '../../util/DOM';
import {Dropdown} from '../overlay/Dropdown';
import {FocusManager, oneFocusOut, offFocusOut} from '../../ui/FocusManager';
import {Debug, menuFlag} from '../../util/Debug';
import DropdownIcon from '../icons/drop-down';
import {Localization} from '../../ui/Localization';
import {KeyCode} from '../../util/KeyCode';

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
      if (lastMenu)
         instance.horizontal = lastMenu.horizontal;

      context.lastMenuItem = this;
      super.explore(context, instance);
      context.lastMenuItem = lastMenuItem;
   }

   render(context, instance, key) {
      return <MenuItemComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </MenuItemComponent>
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
MenuItem.prototype.hoverFocusTimeout = 200;
MenuItem.prototype.clickToOpen = false;
MenuItem.prototype.horizontal = true;
MenuItem.prototype.memoize = false;
MenuItem.prototype.arrow = false;
MenuItem.prototype.dropdownOptions = null;
MenuItem.prototype.showCursor = true;
MenuItem.prototype.pad = true;

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
      return props.instance.shouldUpdate
         || state != this.state
         || state.dropdownOpen; //always render if dropdown is open as we don't know if dropdown contents has changed
   }

   getDropdown() {
      let {horizontal, controller, widget} = this.props.instance;
      if (!this.dropdown && widget.dropdown) {
         this.dropdown = Widget.create(Dropdown, {
            matchWidth: false,
            ...widget.dropdownOptions,
            relatedElement: this.el.parentElement,
            placementOrder: horizontal ? 'down-right down down-left up-right up up-left' : 'right-down right right-up left-down left left-up',
            controller: controller,
            trackScroll: true,
            inline: true,
            onKeyDown: ::this.onDropdownKeyDown,
            items: widget.dropdown
         });
      }
      return this.dropdown;
   }

   render() {

      var {instance} = this.props;
      var {data, store, widget} = instance;
      var {CSS, baseClass} = widget;
      var dropdown = this.state.dropdownOpen && instance.prepareRenderCleanupChild(this.getDropdown(), store, {name: 'submenu'});

      var arrow = widget.arrow && <DropdownIcon className={CSS.element(baseClass, 'arrow')} />;

      var classNames = CSS.expand(data.classNames, CSS.state({
         open: this.state.dropdownOpen,
         horizontal: instance.horizontal,
         vertical: !instance.horizontal,
         arrow: widget.arrow,
         pad: widget.pad,
         cursor: widget.showCursor
      }));

      return <div className={classNames}
         style={data.style}
         tabIndex={widget.dropdown ? 0 : null}
         ref={el=>{this.el = el}}
         onKeyDown={::this.onKeyDown}
         onMouseDown={::this.onMouseDown}
         onMouseEnter={::this.onMouseEnter}
         onMouseLeave={::this.onMouseLeave}
         onFocus={::this.onFocus}
         onClick={::this.onClick}
         onBlur={::this.onBlur}>
         {this.props.children}
         {arrow}
         {dropdown}
      </div>
   }

   onDropdownKeyDown(e) {
      Debug.log(menuFlag, 'MenuItem', 'dropdownKeyDown');
      var {horizontal} = this.props.instance;
      if (e.keyCode == 27 || (horizontal ? e.keyCode == 38 : e.keyCode == 37)) {
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

         if (!widget.clickToOpen) {
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
      }
   }

   onKeyDown(e) {
      Debug.log(menuFlag, 'MenuItem', 'keyDown', this.el);
      var {horizontal, widget} = this.props.instance;
      if (widget.dropdown) {
         if (e.target == this.el && (e.keyCode == 13 || (horizontal ? e.keyCode == 40 : e.keyCode == 39))) {
            var focusableChild = findFirstChild(this.el, isFocusable);
            if (focusableChild)
               FocusManager.focus(focusableChild);
            e.preventDefault();
            e.stopPropagation();
         }

         if (e.keyCode == 27) {
            FocusManager.focus(this.el);
            e.preventDefault();
            e.stopPropagation();
            this.setState({
               dropdownOpen: false
            });
         }
      }
   }

   onMouseDown(e) {
      let {widget} = this.props.instance;
      if (widget.dropdown) {
         //IE sometimes does not focus parent on child click
         if (!isFocusedDeep(this.el))
            FocusManager.focus(this.el);
         e.stopPropagation();
      }
   }

   openDropdown() {
      let {widget} = this.props.instance;
      if (widget.dropdown)
         this.setState({
            dropdownOpen: true
         });
   }

   onClick(e) {
      e.stopPropagation();
      this.openDropdown();
   }

   onFocus() {
      let {widget} = this.props.instance;
      if (widget.dropdown) {
         oneFocusOut(this, this.el, ::this.onFocusOut);
         Debug.log(menuFlag, 'MenuItem', 'focus', this.el, document.activeElement);
         this.clearAutoFocusTimer();
         if (!this.state.dropdownOpen) {
            this.openDropdown();
         }
      }
   }

   onBlur() {
      FocusManager.nudge();
   }

   onFocusOut(focusedElement) {
      Debug.log(menuFlag, 'MenuItem', 'focusout', this.el, focusedElement);
      this.clearAutoFocusTimer();
      if (!isSelfOrDescendant(this.el, focusedElement)) {
         Debug.log(menuFlag, 'MenuItem', 'closing dropdown', this.el, focusedElement);
         this.setState({
            dropdownOpen: false
         });
      }
   }

   componentWillUnmount() {
      this.clearAutoFocusTimer();
      offFocusOut(this);
   }
}
