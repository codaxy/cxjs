import {Widget, VDOM} from '../Widget';
import {HtmlElement} from '../HtmlElement';
import {findFirstChild, isFocusable, isSelfOrDescendant, closest, isFocusedDeep} from '../../util/DOM';
import {Dropdown} from '../overlay/Dropdown';
import {ContentPlaceholder, contentSandbox} from '../layout/ContentPlaceholder';
import {FocusManager, oneFocusOut, offFocusOut} from '../FocusManager';
import {Debug, menuFlag} from '../../util/Debug';

/*
 Functionality:
 - renders dropdown when focused
 - tracks focus and closes if focusElement goes outside the dropdown
 - switches focus to the dropdown when right key pressed
 - listens to dropdown's key events and captures focus back when needed
 - automatically opens the dropdown if mouse is hold over for a period of time
 */

export class Submenu extends HtmlElement {

   explore(context, instance) {
      var oldDropdown = context.content && context.content['dropdown'];
      instance.horizontal = this.horizontal;
      var {lastMenu, lastSubmenu} = context;
      if (lastMenu)
         instance.horizontal = lastMenu.horizontal;

      context.lastSubmenu = this;
      contentSandbox(context, "dropdown", () => {
         super.explore(context, instance);
      });
      context.lastSubmenu = lastSubmenu;
   }

   render(context, instance, key) {
      return <SubmenuComponent key={key}
                               items={this.items}
                               instance={instance}>
         {this.renderChildren(context, instance)}
      </SubmenuComponent>
   }
}

Submenu.prototype.baseClass = 'submenu';
Submenu.prototype.hoverFocusTimeout = 200;
Submenu.prototype.clickToOpen = false;
Submenu.prototype.horizontal = true;
Submenu.prototype.memoize = false;

class SubmenuComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {}
   }

   shouldComponentUpdate(props, state) {
      return props.instance.shouldUpdate
         || state != this.state
         || state.dropdownOpen //always render if dropdown is open as we don't know if dropdown contents has changed
         || false;
   }

   getDropdown() {
      if (!this.dropdown) {
         var {horizontal, controller} = this.props.instance;
         this.dropdown = Widget.create(Dropdown, {
            relatedElement: this.el.parentElement,
            placementOrder: horizontal ? 'down-right down down-left up-right up up-left' : 'right-down right right-up left-down left left-up',
            controller: controller,
            trackScroll: true,
            inline: true,
            matchWidth: false,
            onKeyDown: ::this.onDropdownKeyDown,
            items: {
               type: ContentPlaceholder,
               name: 'dropdown',
               items: this.props.items
            }
         });
      }
      return this.dropdown;
   }

   render() {

      var {instance} = this.props;
      var {data, store} = instance;
      var dropdown = this.state.dropdownOpen && instance.prepareRenderCleanupChild(this.getDropdown(), store, {name: 'submenu'});

      return <div className={data.classNames}
                  style={data.style}
                  tabIndex="0"
                  ref={el=>{this.el = el}}
                  onKeyDown={::this.onKeyDown}
                  onMouseDown={::this.onMouseDown}
                  onMouseEnter={::this.onMouseEnter}
                  onMouseLeave={::this.onMouseLeave}
                  onFocus={::this.onFocus}
                  onClick={::this.onClick}
                  onBlur={::this.onBlur}>
         {this.props.children}
         {dropdown}
      </div>
   }

   onDropdownKeyDown(e) {
      Debug.log(menuFlag, 'Submenu', 'dropdownKeyDown');
      var {horizontal} = this.props.instance;
      if (e.keyCode == 27 || (horizontal ? e.keyCode == 38 : e.keyCode == 37)) {
         FocusManager.focus(this.el);
         e.preventDefault();
         e.stopPropagation();
      }
   }

   clearAutoFocusTimer() {
      if (this.autoFocusTimerId) {
         Debug.log(menuFlag, 'Submenu', 'autoFocusCancel');
         clearTimeout(this.autoFocusTimerId);
         delete this.autoFocusTimerId;
      }
   }

   onMouseEnter(e) {
      Debug.log(menuFlag, 'Submenu', 'mouseEnter', this.el);
      if (!this.state.dropdownOpen) {
         var {widget} = this.props.instance;

         this.clearAutoFocusTimer();

         if (!widget.clickToOpen) {
            // Automatically open the dropdown only if parent menu is focused
            var commonParentMenu = closest(this.el, el=>el.tagName == 'UL' && el.contains(document.activeElement));
            if (commonParentMenu)
               this.autoFocusTimerId = setTimeout(() => {
                  delete this.autoFocusTimerId;
                  if (!this.state.dropdownOpen) {
                     Debug.log(menuFlag, 'Submenu', 'hoverFocusTimeout:before', this.el);
                     FocusManager.focus(this.el);
                     Debug.log(menuFlag, 'Submenu', 'hoverFocusTimeout:after', this.el, document.activeElement);
                  }
               }, widget.hoverFocusTimeout);
         }

         e.stopPropagation();
         e.preventDefault();
      }
   }

   onMouseLeave(e) {
      Debug.log(menuFlag, 'Submenu', 'mouseLeave', this.el);
      this.clearAutoFocusTimer();
   }

   onKeyDown(e) {
      Debug.log(menuFlag, 'Submenu', 'keyDown', this.el);
      var {horizontal} = this.props.instance;
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

   onMouseDown(e) {
      //IE sometimes does not focus parent on child click
      if (!isFocusedDeep(this.el))
         FocusManager.focus(this.el);
      e.stopPropagation();
   }

   onClick(e) {
      this.setState({
         dropdownOpen: true
      });
   }

   onFocus(e) {
      oneFocusOut(this, this.el, ::this.onFocusOut);
      Debug.log(menuFlag, 'Submenu', 'focus', this.el, document.activeElement);
      this.clearAutoFocusTimer();
      if (!this.state.dropdownOpen) {
         this.setState({
            dropdownOpen: true
         })
      }
   }

   onBlur() {
      FocusManager.nudge();
   }

   onFocusOut(focusedElement) {
      Debug.log(menuFlag, 'Submenu', 'focusout', this.el, focusedElement);
      this.clearAutoFocusTimer();
      if (!isSelfOrDescendant(this.el, focusedElement)) {
         Debug.log(menuFlag, 'Submenu', 'closing dropdown', this.el, focusedElement);
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

Widget.alias('submenu', Submenu);