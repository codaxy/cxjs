import {Widget, VDOM, getContent} from '../Widget';
import {HtmlElement} from '../HtmlElement';
import {findFirst, isFocusable, getFocusedElement, isSelfOrDescendant} from '../../util/DOM';
import {KeyCode} from '../../util/KeyCode';
import {Debug, menuFlag} from '../../util/Debug';
import {FocusManager, oneFocusOut, offFocusOut} from '../FocusManager';

/*
 Functionality:
 - renders a list of items in a form of horizontal or vertical menu
 - provides cursor with mouse and keyboard nav
 - changes focusElement to the first focusable child when cursor is moved using keyboard
 */

export class Menu extends HtmlElement {

   prepareData(context, instance) {
      var {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         horizontal: this.horizontal
      };
      super.prepareData(context, instance);
   }

   explore(context, instance) {
      var lastMenu = context.lastMenu;
      context.lastMenu = this;
      super.explore(context, instance);
      context.lastMenu = lastMenu;
   }

   render(context, instance, key) {
      return <MenuComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </MenuComponent>
   }
}

Menu.prototype.horizontal = false;

class MenuComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         cursor: null
      }
   }

   render() {
      var {instance, children} = this.props;
      var {data} = instance;
      this.itemInfo = Array.from({length: children.length});
      return <ul ref={el=> {
         this.el = el
      }}
                 className={data.classNames}
                 style={data.style}
                 onFocus={::this.onFocus}
                 onBlur={FocusManager.nudge()}
                 onKeyDown={::this.onKeyDown}
      >
         {children.map((c, i)=> {
            let key = c && typeof c == 'object' && c.key ? c.key : i;
            return <MenuItemComponent key={key}
                                      cursor={key === this.state.cursor}
                                      instance={instance}
                                      itemInfo={this.itemInfo}
                                      itemKey={key}
                                      itemIndex={i}
                                      moveCursor={::this.moveCursor}>
               {c}
            </MenuItemComponent>;
         })}
      </ul>;
   }

   moveCursor(itemKey) {
      if (itemKey != this.state.cursor) {
         Debug.log(menuFlag, 'Menu', 'moveCursor', itemKey);
         this.setState({cursor: itemKey});
      }
   }

   onKeyDown(e) {
      var {instance} = this.props;
      var {widget} = instance;

      var keyCode = e.keyCode;
      Debug.log(menuFlag, 'Menu', 'keyDown', this.el, keyCode);
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
      Debug.log(menuFlag, 'Menu', 'focusout', this.el, elementReceivingFocus);
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
      var {itemInfo, itemIndex, itemKey, instance, cursor} = this.props;
      var {widget} = instance;
      var {CSS, baseClass} = widget;
      var mods = {
         cursor: cursor,
         focusable: this.state.focusable
      };
      return <li
         ref={c=> {
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
         <div className={CSS.element(baseClass, "item-body")}>
            {this.props.children}
         </div>
      </li>
   }

   onFocus(e) {
      FocusManager.nudge();
      Debug.log(menuFlag, 'MenuItem', 'focus', this.el, e.target);
      this.props.moveCursor(this.props.itemKey);
   }

   onKeyDown(e) {
      var {instance} = this.props;
      var {widget} = instance;

      if (widget.onKeyDown)
         widget.onKeyDown(e, instance);
   }

   onMouseDown(e) {
      e.stopPropagation();
      e.preventDefault();
      Debug.log(menuFlag, 'MenuItem', 'mouseDown', this.el);
      if (this.state.focusable) {
         let {itemInfo, itemIndex} = this.props;
         let el = itemInfo[itemIndex].el;
         var focusedEl = getFocusedElement();
         var focusedChild = FocusManager.focusFirst(el);
         if (focusedChild != focusedEl) {
            Debug.log(menuFlag, 'MenuItem', 'focusChild', focusedChild, focusedEl);
         }
      }
   }

   componentDidMount() {
      this.componentDidUpdate();
   }

   componentDidUpdate() {
      var {itemInfo, itemIndex, cursor} = this.props;
      var focusable = findFirst(itemInfo[itemIndex].el, isFocusable) != null;
      if (focusable != this.state.focusable) {
         itemInfo[itemIndex].focusable = focusable;
         this.setState({focusable: focusable});
      }
   }
}
