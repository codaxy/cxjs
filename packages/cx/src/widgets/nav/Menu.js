import {Widget, VDOM} from '../../ui/Widget';
import {HtmlElement} from '../HtmlElement';
import {findFirst, isFocusable, getFocusedElement, isSelfOrDescendant} from '../../util/DOM';
import {KeyCode} from '../../util/KeyCode';
import {debug, menuFlag} from '../../util/Debug';
import {FocusManager, oneFocusOut, offFocusOut} from '../../ui/FocusManager';
import {MenuItem} from "./MenuItem";
import {isUndefined} from '../../util/isUndefined';

/*
 Functionality:
 - renders a list of items in a form of horizontal or vertical menu
 - provides cursor with mouse and keyboard nav
 - changes focusElement to the first focusable child when cursor is moved using keyboard
 */

export class Menu extends HtmlElement {

   init() {
      if (this.itemPadding === true)
         this.itemPadding = 'medium';

      if (this.horizontal && isUndefined(this.itemPadding))
         this.itemPadding = this.defaultHorizontalItemPadding;

      if (!this.horizontal && isUndefined(this.itemPadding))
         this.itemPadding = this.defaultVerticalItemPadding;

      super.init();
   }

   prepareData(context, instance) {
      var {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         horizontal: this.horizontal,
         vertical: !this.horizontal,
         [this.itemPadding+'-item-padding']: this.itemPadding
      };
      super.prepareData(context, instance);
   }

   explore(context, instance) {
      context.push('lastMenu', this);
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop('lastMenu');
   }

   render(context, instance, key) {
      return <MenuComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </MenuComponent>
   }

   add(item) {
      if (item && item.tag == 'a') {
         this.add({
            type: MenuItem,
            items: item,
            autoClose: true
         })
      }
      else
         super.add(...arguments);
   }
}

Menu.prototype.horizontal = false;
Menu.prototype.defaultVerticalItemPadding = "medium";
Menu.prototype.defaultHorizontalItemPadding = "small";
Menu.prototype.icons = false;
Menu.Item = MenuItem;

class MenuComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         cursor: null
      }
   }

   render() {
      let {instance, children} = this.props;
      let {data} = instance;
      this.itemInfo = Array.from({length: children.length});
      const ref = el=> {
         this.el = el
      };
      return (
         <ul
            ref={ref}
            className={data.classNames}
            style={data.style}
            onFocus={::this.onFocus}
            onBlur={FocusManager.nudge()}
            onKeyDown={::this.onKeyDown}
         >
            {children.map((c, i)=> {
               let key = i;

               if (c && typeof c == 'object' && c.key)
                  key = c.key;

               return <MenuItemComponent
                  key={key}
                  cursor={key === this.state.cursor}
                  instance={instance}
                  itemInfo={this.itemInfo}
                  itemKey={key}
                  itemIndex={i}
                  moveCursor={::this.moveCursor}
               >
                  {c}
               </MenuItemComponent>;
            })}
         </ul>
      );
   }

   moveCursor(itemKey) {
      if (itemKey != this.state.cursor) {
         debug(menuFlag, 'Menu', 'moveCursor', itemKey);
         this.setState({cursor: itemKey});
      }
   }

   onKeyDown(e) {
      var {instance} = this.props;
      var {widget} = instance;

      var keyCode = e.keyCode;
      debug(menuFlag, 'Menu', 'keyDown', this.el, keyCode);
      var {horizontal} = widget;

      if (keyCode == KeyCode.tab) {
         if (horizontal)
            keyCode = e.shiftKey ? KeyCode.left : KeyCode.up;
         else
            keyCode = e.shiftKey ? KeyCode.right : KeyCode.down;
      }

      if (this.state.cursor != null) {
         var cursorIndex = this.itemInfo.findIndex(a=>a.key == this.state.cursor);

         if (horizontal ? keyCode == KeyCode.left : keyCode == KeyCode.up) {
            for (var c = cursorIndex - 1; c >= 0; c--)
               if (this.itemInfo[c].focusable) {
                  FocusManager.focusFirst(this.itemInfo[c].el);
                  e.stopPropagation();
                  e.preventDefault();
                  return;
               }
         }

         if (horizontal ? keyCode == KeyCode.right : keyCode == KeyCode.down) {
            for (var c = cursorIndex + 1; c < this.itemInfo.length; c++)
               if (this.itemInfo[c].focusable) {
                  FocusManager.focusFirst(this.itemInfo[c].el);
                  e.stopPropagation();
                  e.preventDefault();
                  return;
               }
         }
      }

      switch (keyCode) {
         case KeyCode.home:
            if (this.itemInfo[0].focusable) {
               FocusManager.focusFirst(this.itemInfo[0].el);
               e.stopPropagation();
               e.preventDefault();
            }
            break;

         case KeyCode.end:
            if (this.itemInfo[this.itemInfo.length - 1].focusable) {
               FocusManager.focusFirst(this.itemInfo[this.itemInfo.length - 1].el);
               e.stopPropagation();
               e.preventDefault();
            }
            break;
      }
   }

   onFocusOut(elementReceivingFocus) {
      debug(menuFlag, 'Menu', 'focusout', this.el, elementReceivingFocus);
      if (!isSelfOrDescendant(this.el, elementReceivingFocus))
         this.moveCursor(null);
   }

   componentDidMount() {
      var {widget} = this.props.instance;
      if (widget.autoFocus && this.itemInfo.length > 0)
         FocusManager.focusFirst(this.itemInfo[0].el);
   }

   onFocus() {
      oneFocusOut(this, this.el, ::this.onFocusOut);
   }

   componentWillUnmount() {
      offFocusOut(this);
   }
}

Menu.prototype.baseClass = "menu";
Menu.prototype.tag = 'ul';

Widget.alias('menu', Menu);

class MenuItemComponent extends VDOM.Component {
   constructor(props) {
      super(props);
      this.state = {focusable: true}
   }

   render() {
      let {itemInfo, itemIndex, itemKey, instance, cursor} = this.props;
      let {widget} = instance;
      let {CSS, baseClass} = widget;
      let mods = {
         cursor: cursor,
         focusable: this.state.focusable,
      };

      return <li
         ref={c => {
            this.el = c;
            itemInfo[itemIndex] = {
               el: c,
               focusable: this.state.focusable,
               key: itemKey
            };
         }}
         className={CSS.element(baseClass, "item", mods)}
         onFocus={::this.onFocus}
         onMouseDown={::this.onMouseDown}
         onKeyDown={::this.onKeyDown}
      >
         {this.props.children}
      </li>
   }

   onFocus(e) {
      FocusManager.nudge();
      debug(menuFlag, 'MenuItem', 'focus', this.el, e.target);
      this.props.moveCursor(this.props.itemKey);
   }

   onKeyDown(e) {
      let {instance} = this.props;
      let {widget} = instance;

      if (widget.onKeyDown)
         instance.invoke("onKeyDown", e, instance);
   }

   onMouseDown(e) {
      e.stopPropagation();
      e.preventDefault();
      debug(menuFlag, 'MenuItem', 'mouseDown', this.el);
      if (this.state.focusable) {
         let {itemInfo, itemIndex} = this.props;
         let el = itemInfo[itemIndex].el;
         let focusedEl = getFocusedElement();
         let focusedChild = FocusManager.focusFirst(el);
         if (focusedChild !== focusedEl) {
            debug(menuFlag, 'MenuItem', 'focusChild', focusedChild, focusedEl);
         }
      }
   }

   componentDidMount() {
      this.componentDidUpdate();
   }

   componentDidUpdate() {
      let {itemInfo, itemIndex} = this.props;
      let focusable = !!findFirst(this.el, isFocusable);
      if (focusable !== this.state.focusable) {
         itemInfo[itemIndex].focusable = focusable;
         this.setState({focusable: focusable});
      }
   }
}
