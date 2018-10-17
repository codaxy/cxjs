import {Widget, VDOM} from '../../ui/Widget';
import {Cx} from '../../ui/Cx';
import {HtmlElement} from '../HtmlElement';
import {findFirstChild, isFocusable, isSelfOrDescendant, closest, isFocusedDeep, isFocused} from '../../util/DOM';
import {Dropdown} from '../overlay/Dropdown';
import {FocusManager, oneFocusOut, offFocusOut} from '../../ui/FocusManager';
import {debug, menuFlag} from '../../util/Debug';
import DropdownIcon from '../icons/drop-down';
import {Icon} from '../Icon';
import {Localization} from '../../ui/Localization';
import {KeyCode} from '../../util/KeyCode';
import {registerKeyboardShortcut} from "../../ui/keyboardShortcuts";
import {getActiveElement} from "../../util/getActiveElement";

/*
 Functionality:
 - renders dropdown when focused
 - tracks focus and closes if focusElement goes outside the dropdown
 - switches focus to the dropdown when right key pressed
 - listens to dropdown's key events and captures focus back when needed
 - automatically opens the dropdown if mouse is held over for a period of time
 */

export class MenuItem extends HtmlElement {

   init() {
      if (this.hideCursor)
         this.showCursor = false;
      super.init();
   }

   declareData() {
      super.declareData(...arguments, {
         icon: undefined,
         disabled: undefined,
         checked: false,
         arrow: undefined
      });
   }

   explore(context, instance) {
      instance.horizontal = this.horizontal;
      let {lastMenu} = context;
      if (lastMenu) {
         instance.horizontal = lastMenu.horizontal;
         instance.padding = lastMenu.itemPadding;
         instance.icons = lastMenu.icons;
      }

      instance.parentPositionChangeEvent = context.parentPositionChangeEvent;

      if (!instance.padding && this.pad == true)
         instance.padding = 'medium';

      if (this.padding)
         instance.padding = this.padding;

      context.push('lastMenuItem', this);
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop('lastMenuItem');
   }

   render(context, instance, key) {
      return (
         <MenuItemComponent
            key={key}
            instance={instance}
            data={instance.data}
            shouldUpdate={instance.shouldUpdate}
         >
            {instance.data.text
               ? <span>{instance.data.text}</span>
               : this.renderChildren(context, instance)}
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
MenuItem.prototype.autoClose = false;
MenuItem.prototype.checkedIcon = 'check';
MenuItem.prototype.uncheckedIcon = 'dummy';
MenuItem.prototype.keyboardShortcut = false;

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
      let {horizontal, widget, parentPositionChangeEvent} = this.props.instance;
      if (!this.dropdown && widget.dropdown) {
         this.dropdown = Widget.create(Dropdown, {
            matchWidth: false,
            placementOrder: horizontal ? 'down-right down down-left up-right up up-left' : 'right-down right right-up left-down left left-up',
            trackScroll: true,
            inline: true,
            ...widget.dropdownOptions,
            relatedElement: this.el.parentElement,
            placement: widget.placement,
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

      let {instance, data, children} = this.props;
      let {widget} = instance;
      let {CSS, baseClass} = widget;
      let dropdown = this.state.dropdownOpen
         && <Cx widget={this.getDropdown()} options={{name: 'submenu'}} parentInstance={instance}/>;

      let arrow = data.arrow && <DropdownIcon className={CSS.element(baseClass, 'arrow')}/>;

      let icon = null;

      let checkbox = widget.checked != null;

      if (checkbox) {
         data.icon = data.checked ? widget.checkedIcon : widget.uncheckedIcon;
      }

      if (data.icon) {
         icon = <div
            className={CSS.element(baseClass, "button")}
            onClick={e => {
               e.preventDefault();
               if (!instance.set('checked', !data.checked))
                  this.onClick(e);
            }}
            onMouseDown={e=>{
               if (checkbox)
                  e.stopPropagation();
            }}
         >
            { Icon.render(data.icon, {className: CSS.element(baseClass, "icon")}) }
         </div>
      }

      let empty = !children || (Array.isArray(children) && children.length==0);

      let classNames = CSS.expand(data.classNames, CSS.state({
         open: this.state.dropdownOpen,
         horizontal: instance.horizontal,
         vertical: !instance.horizontal,
         arrow: data.arrow,
         cursor: widget.showCursor,
         [instance.padding + '-padding']: instance.padding,
         icon: !!icon || instance.icons,
         disabled: data.disabled,
         empty
      }));

      if (empty)
         children = <span className={CSS.element(baseClass, "baseline")}>&nbsp;</span>

      return <div
         className={classNames}
         style={data.style}
         tabIndex={!data.disabled && (widget.dropdown || widget.onClick || widget.checked) ? 0 : null}
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
         {children}
         {icon}
         {arrow}
         {dropdown}
      </div>
   }

   componentDidUpdate() {
      if (this.state.dropdownOpen && this.validateDropdownPosition) {
         this.validateDropdownPosition();
      }
   }

   componentDidMount() {
      let {widget} = this.props.instance;
      if (widget.keyboardShortcut)
         this.unregisterKeyboardShortcut = registerKeyboardShortcut(widget.keyboardShortcut, (e) => {
            this.el.focus(); //open the dropdown
            this.onClick(e); //execute the onClick handler
         });
   }

   onDropdownKeyDown(e) {
      debug(menuFlag, 'MenuItem', 'dropdownKeyDown');
      let {horizontal} = this.props.instance;
      if (e.keyCode == KeyCode.esc || (horizontal ? e.keyCode == KeyCode.up : e.keyCode == KeyCode.left)) {
         FocusManager.focus(this.el);
         e.preventDefault();
         e.stopPropagation();
      }
   }

   clearAutoFocusTimer() {
      if (this.autoFocusTimerId) {
         debug(menuFlag, 'MenuItem', 'autoFocusCancel');
         clearTimeout(this.autoFocusTimerId);
         delete this.autoFocusTimerId;
      }
   }

   onMouseEnter(e) {
      debug(menuFlag, 'MenuItem', 'mouseEnter', this.el);
      let {widget} = this.props.instance;
      if (widget.dropdown && !this.state.dropdownOpen) {
         this.clearAutoFocusTimer();

         if (widget.hoverToOpen)
            FocusManager.focus(this.el);
         else if (!widget.clickToOpen) {
            // Automatically open the dropdown only if parent menu is focused
            let commonParentMenu = closest(this.el, el => el.tagName == 'UL' && el.contains(getActiveElement()));
            if (commonParentMenu)
               this.autoFocusTimerId = setTimeout(() => {
                  delete this.autoFocusTimerId;
                  if (!this.state.dropdownOpen) {
                     debug(menuFlag, 'MenuItem', 'hoverFocusTimeout:before', this.el);
                     FocusManager.focus(this.el);
                     debug(menuFlag, 'MenuItem', 'hoverFocusTimeout:after', this.el, getActiveElement());
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
         debug(menuFlag, 'MenuItem', 'mouseLeave', this.el);
         this.clearAutoFocusTimer();

         if (widget.hoverToOpen && document.activeElement == this.el)
            this.el.blur();
      }
   }

   onKeyDown(e) {
      debug(menuFlag, 'MenuItem', 'keyDown', this.el);
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
            if (!isFocused(this.el)) {
               FocusManager.focus(this.el);
               e.preventDefault();
               e.stopPropagation();
            }
            this.closeDropdown();
         }
      }
      else {
         if (e.keyCode == KeyCode.enter && widget.onClick)
            this.onClick(e);
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
         if (!this.state.dropdownOpen)
            this.setState({
               dropdownOpen: true
            }, callback);
         else if (callback)
            callback(this.state);
      }
   }

   onClick(e) {
      e.stopPropagation();

      let {instance} = this.props;
      if (instance.data.disabled) {
         e.preventDefault();
         return;
      }

      let {widget} = instance;
      if (widget.dropdown)
         e.preventDefault(); //prevent navigation
      else {
         instance.set("checked", !instance.data.checked);

         if (widget.onClick)
            instance.invoke('onClick', e, instance);
      }

      if (widget.autoClose)
         getActiveElement().blur();
   }

   onFocus() {
      let {widget} = this.props.instance;
      if (widget.dropdown) {
         oneFocusOut(this, this.el, ::this.onFocusOut);
         debug(menuFlag, 'MenuItem', 'focus', this.el, document.activeElement);
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
      debug(menuFlag, 'MenuItem', 'focusout', this.el, focusedElement);
      this.clearAutoFocusTimer();
      if (!isSelfOrDescendant(this.el, focusedElement)) {
         debug(menuFlag, 'MenuItem', 'closing dropdown', this.el, focusedElement);
         this.closeDropdown();
      }
   }

   componentWillUnmount() {
      this.clearAutoFocusTimer();
      offFocusOut(this);

      if (this.offParentPositionChange)
         this.offParentPositionChange();

      if (this.unregisterKeyboardShortcut)
         this.unregisterKeyboardShortcut();
   }
}
