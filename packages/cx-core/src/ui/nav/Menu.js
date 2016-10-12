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

   prepare(context, instance) {
      var lastMenu = context.lastMenu;
      context.lastMenu = this;
      super.prepare(context, instance);
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
         cursor: -1
      }
   }

   render() {
      var {data} = this.props.instance;
      this.itemInfo = {
         length: this.props.children.length
      };
      return <ul ref={el=>{this.el = el}}
                 className={data.classNames}
                 style={data.style}
                 onFocus={::this.onFocus}
                 onBlur={FocusManager.nudge()}
                 onKeyDown={::this.onKeyDown}>

         {this.props.children.map((c, i)=> {
            let key = c && typeof c == 'object' && c.key ? c.key : i;
            return <MenuItemComponent key={key}
                                      cursor={i == this.state.cursor}
                                      instance={this.props.instance}
                                      itemInfo={this.itemInfo}
                                      itemIndex={i}
                                      moveCursor={::this.moveCursor}>
               {c}
            </MenuItemComponent>;
         })}
      </ul>;
   }

   moveCursor(itemIndex, focus) {
      if (focus || itemIndex != this.state.cursor) {
         Debug.log(menuFlag, 'Menu', 'moveCursor', itemIndex, focus);
         this.setState({cursor: itemIndex}, () => {
            if (focus)
               this.focusElementUnderCursor();
         });
      }
   }

   onKeyDown(e) {

      var {instance} = this.props;
      var {widget} = instance;

      if (widget.onKeyDown && widget.onKeyDown(e, instance) === false)
         return;

      var keyCode = e.keyCode;
      Debug.log(menuFlag, 'Menu', 'keyDown', this.el, keyCode);
      var {horizontal} = this.props.instance.widget;

      //tab
      if (keyCode == KeyCode.tab) {
         if (horizontal)
            keyCode = e.shiftKey ? KeyCode.left : KeyCode.up;
         else
            keyCode = e.shiftKey ? KeyCode.right : KeyCode.down;
      }

      if (horizontal ? keyCode == KeyCode.left : keyCode == KeyCode.up) {
         for (var c = this.state.cursor - 1; c >= 0; c--)
            if (this.itemInfo[c].focusable) {
               this.moveCursor(c, true);
               e.stopPropagation();
               e.preventDefault();
               return;
            }
      }

      if (horizontal ? keyCode == KeyCode.right : keyCode == KeyCode.down) {
         for (var c = this.state.cursor + 1; c < this.props.children.length; c++)
            if (this.itemInfo[c].focusable) {
               this.moveCursor(c, true);
               e.stopPropagation();
               e.preventDefault();
               return;
            }
      }

      switch (keyCode) {
         case KeyCode.home:
            if (this.itemInfo[0].focusable) {
               this.moveCursor(0, true);
               e.stopPropagation();
               e.preventDefault();
            }
            break;

         case KeyCode.end:
            if (this.itemInfo[this.props.children.length - 1].focusable) {
               this.moveCursor(this.props.children.length - 1, true);
               e.stopPropagation();
               e.preventDefault();
            }
            break;
      }
   }

   focusElementUnderCursor() {
      var item = this.itemInfo[this.state.cursor];
      if (item)
         FocusManager.focusFirst(item.el);
   }

   onFocusOut(elementReceivingFocus) {
      Debug.log(menuFlag, 'Menu', 'focusout', this.el, elementReceivingFocus);
      if (!isSelfOrDescendant(this.el, elementReceivingFocus))
         this.moveCursor(-1);
   }

   componentDidMount() {
      var {widget} = this.props.instance;
      if (widget.autoFocus)
         this.moveCursor(0, true);
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
      var {itemInfo, itemIndex, instance, cursor} = this.props;
      var {widget} = instance;
      var {CSS, baseClass} = widget;
      var mods = {
         cursor: cursor,
         focusable: this.state.focusable
      };
      return <li ref={c=>{this.el = c;itemInfo[itemIndex] = {el: c, focusable: this.state.focusable};}}
                 className={CSS.element(baseClass, "item", mods)}
                 onFocus={::this.onFocus}
                 onMouseDown={::this.onMouseDown}>
         <div className={CSS.element(baseClass, "item-body")}>
         {this.props.children}
         </div>
      </li>
   }

   onFocus(e) {
      FocusManager.nudge();
      Debug.log(menuFlag, 'MenuItem', 'focus', this.el, e.target);
      this.props.moveCursor(this.props.itemIndex);
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
      var {itemInfo, itemIndex} = this.props;
      var focusable = findFirst(itemInfo[itemIndex].el, isFocusable) != null;
      if (focusable != this.state.focusable) {
         itemInfo[itemIndex].focusable = focusable;
         this.setState({focusable: focusable});
      }
   }
}
