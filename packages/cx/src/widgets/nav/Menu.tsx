/** @jsxImportSource react */
import { FocusManager } from "../../ui/FocusManager";
import { RenderingContext } from "../../ui/RenderingContext";
import { ResizeManager } from "../../ui/ResizeManager";
import { VDOM, Widget } from "../../ui/Widget";
import { isTextInputElement } from "../../util";
import { debug, menuFlag } from "../../util/Debug";
import { closest, findFirst, getFocusedElement, isFocusable, isFocusedDeep, isSelfOrDescendant } from "../../util/DOM";
import { isDefined } from "../../util/isDefined";
import { isString } from "../../util/isString";
import { isUndefined } from "../../util/isUndefined";
import { KeyCode } from "../../util/KeyCode";
import { HtmlElement, HtmlElementConfig, HtmlElementInstance } from "../HtmlElement";
import { MenuItem } from "./MenuItem";
import { MenuSpacer } from "./MenuSpacer";

export interface MenuConfig extends HtmlElementConfig {
   /** Set to `true` for horizontal menus. */
   horizontal?: boolean;

   /**
    * Controls size of menu items. Supported values are `xsmall`, `small`, `medium`, `large` or `xlarge`.
    * For horizontal menus default size is `small` and for vertical it's `medium`.
    */
   itemPadding?: string;

   defaultVerticalItemPadding?: string;
   defaultHorizontalItemPadding?: string;

   /** Set to true to put overflow items into a submenu on the right. */
   overflow?: boolean;

   /** Icon to be used for the overflow menu. */
   overflowIcon?: string;

   /** Base CSS class to be applied to the element. No class is applied by default. */
   baseClass?: string;

   /** Show only overflow items. Used internally for overflow menus. */
   showOnlyOverflowItems?: boolean;

   /** Auto focus first menu item. */
   autoFocus?: boolean;
}

/*
 Functionality:
 - renders a list of items in a form of horizontal or vertical menu
 - provides cursor with mouse and keyboard nav
 - changes focusElement to the first focusable child when cursor is moved using keyboard
 */

export class Menu extends HtmlElement<MenuConfig, MenuInstance> {
   declare public baseClass: string;
   declare public horizontal: boolean;
   declare public itemPadding: string | boolean;
   declare public defaultHorizontalItemPadding: string;
   declare public defaultVerticalItemPadding: string;
   declare public overflow: boolean;
   declare public overflowIcon: string;
   declare public tag: string;
   declare public showOnlyOverflowItems?: boolean;
   declare public autoFocus?: boolean;
   static Item: typeof MenuItem;
   static Spacer: typeof MenuSpacer;
   init() {
      if (this.itemPadding === true) this.itemPadding = "medium";

      if (this.horizontal && isUndefined(this.itemPadding)) this.itemPadding = this.defaultHorizontalItemPadding;

      if (!this.horizontal && isUndefined(this.itemPadding)) this.itemPadding = this.defaultVerticalItemPadding;

      super.init();

      if (this.overflow) {
         if (!this.horizontal) throw new Error("Overflow works only on horizontal menus.");

         this.items.push(
            MenuItem.create({
               icon: this.overflowIcon,
               mod: "overflow",
               items: [
                  {
                     type: Menu,
                     putInto: "dropdown",
                     items: [...this.items],
                     showOnlyOverflowItems: true,
                  },
               ],
            }),
         );
      }
   }

   prepareData(context: RenderingContext, instance: MenuInstance) {
      let { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         horizontal: this.horizontal,
         vertical: !this.horizontal,
         overflow: this.overflow,
         [this.itemPadding + "-item-padding"]: this.itemPadding,
      };
      super.prepareData(context, instance);
   }

   explore(context: RenderingContext, instance: MenuInstance) {
      context.push("lastMenu", this);
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: MenuInstance) {
      context.pop("lastMenu");
   }

   render(context: RenderingContext, instance: MenuInstance, key: string) {
      return (
         <MenuComponent key={key} instance={instance}>
            {this.renderChildren(context, instance)}
         </MenuComponent>
      );
   }

   add(item: any) {
      if (item && (item.tag == "a" || item.tag == "hr")) {
         let mi: any = {
            type: MenuItem,
            items: item,
            autoClose: item.tag == "a",
         };

         if (isDefined(item.if)) mi.if = item.if;

         if (isDefined(item.visible)) mi.visible = item.visible;

         super.add(mi);
      } else super.add(...arguments);
   }
}

Menu.prototype.horizontal = false;
Menu.prototype.defaultVerticalItemPadding = "medium";
Menu.prototype.defaultHorizontalItemPadding = "small";
Menu.prototype.icons = false;
Menu.prototype.overflow = false;
Menu.prototype.overflowIcon = "drop-down";
Menu.Item = MenuItem;
Menu.Spacer = MenuSpacer;

export class MenuInstance extends HtmlElementInstance<Menu> {
   nonOverflownItemCount?: number;
}

interface MenuComponentProps {
   instance: MenuInstance;
   children: any[];
}

interface MenuComponentState {
   cursor: any;
   nonOverflownItemCount: number;
}

class MenuComponent extends VDOM.Component<MenuComponentProps, MenuComponentState> {
   el: HTMLElement | null = null;
   itemInfo: any[];
   isMeasureOverflowDisabled: boolean = false;
   unsubscribeFocusOut?: () => void;
   unsubscribeResize?: () => void;

   constructor(props: MenuComponentProps) {
      super(props);
      this.state = {
         cursor: null,
         nonOverflownItemCount: Infinity,
      };
      this.ref = (el: HTMLElement | null) => {
         this.el = el;
      };
   }

   ref: (el: HTMLElement | null) => void;

   render() {
      let { instance, children } = this.props;
      let { data, widget } = instance;
      let { CSS, baseClass } = widget;
      this.itemInfo = Array.from({ length: children.length });

      let parentNonOverflownItemCount = 0;

      if (widget.showOnlyOverflowItems) {
         let { parent } = instance;
         while (parent != null) {
            if (parent instanceof MenuInstance) {
               parentNonOverflownItemCount = parent.nonOverflownItemCount || 0;
               break;
            }
            parent = parent.parent;
         }
      }

      return (
         <ul
            ref={this.ref}
            className={CSS.expand(
               data.classNames,
               CSS.state({
                  pack: this.state.nonOverflownItemCount < children.length - 1,
               }),
            )}
            style={data.style}
            onBlur={FocusManager.nudge}
            onKeyDown={this.onKeyDown.bind(this)}
         >
            {children.map((content, index) => {
               let key = content && typeof content == "object" && content.key ? content.key : index;

               if (content && content.spacer) {
                  return widget.horizontal && <li className={CSS.element(baseClass, "spacer")} key={key} />;
               }

               return (
                  <MenuItemComponent
                     key={key}
                     cursor={key === this.state.cursor}
                     hidden={
                        index < parentNonOverflownItemCount ||
                        (index >= this.state.nonOverflownItemCount && index + 1 != children.length)
                     }
                     instance={instance}
                     itemInfo={this.itemInfo}
                     itemKey={key}
                     itemIndex={index}
                     moveCursor={this.moveCursor.bind(this)}
                  >
                     {content}
                  </MenuItemComponent>
               );
            })}
         </ul>
      );
   }

   moveCursor(itemKey: any) {
      if (itemKey != this.state.cursor) {
         debug(menuFlag, "Menu", "moveCursor", itemKey);
         this.setState({ cursor: itemKey });
      }
   }

   onKeyDown(e: React.KeyboardEvent) {
      //ignore the event if it comes from an input element
      if (isTextInputElement(e.target as Element)) return;

      let { instance } = this.props;
      let { widget } = instance;

      let keyCode = e.keyCode;
      debug(menuFlag, "Menu", "keyDown", this.el, keyCode);
      let { horizontal } = widget;

      if (keyCode == KeyCode.tab) {
         if (horizontal) keyCode = e.shiftKey ? KeyCode.left : KeyCode.up;
         else keyCode = e.shiftKey ? KeyCode.right : KeyCode.down;
      }

      if (this.state.cursor != null) {
         let cursorIndex = this.itemInfo.findIndex((a) => a.key == this.state.cursor);

         if (horizontal ? keyCode == KeyCode.left : keyCode == KeyCode.up) {
            for (let c = cursorIndex - 1; c >= 0; c--)
               if (this.itemInfo[c].focusable) {
                  FocusManager.focusFirst(this.itemInfo[c].el);
                  e.stopPropagation();
                  e.preventDefault();
                  return;
               }
         }

         if (horizontal ? keyCode == KeyCode.right : keyCode == KeyCode.down) {
            for (let c = cursorIndex + 1; c < this.itemInfo.length; c++)
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

   onFocusOut(elementReceivingFocus: any) {
      debug(menuFlag, "Menu", "focusout", this.el, elementReceivingFocus);
      if (this.el && !isSelfOrDescendant(this.el, elementReceivingFocus)) this.moveCursor(null);
   }

   componentDidMount() {
      let { widget } = this.props.instance;
      if (widget.autoFocus && this.itemInfo.length > 0 && !isFocusedDeep(this.el!))
         FocusManager.focusFirst(this.itemInfo[0].el);
      if (widget.overflow) {
         this.measureOverflow();
         this.unsubscribeResize = ResizeManager.trackElement(this.el, this.measureOverflow.bind(this));
      }
      this.unsubscribeFocusOut = FocusManager.onFocusOut(this.el, this.onFocusOut.bind(this));
   }

   componentDidUpdate() {
      this.measureOverflow();
   }

   measureOverflow() {
      let { instance } = this.props;
      let { widget } = instance;
      let { CSS, baseClass } = widget;
      if (!widget.overflow) return;

      let spacerClass = CSS.element(baseClass, "spacer")!;

      let nonOverflownItemCount = 0;
      let fitItemsWidth = 0;
      let children = Array.from(this.el!.children);
      let widths = children.map((c) => {
         if (!(c instanceof HTMLElement)) return 0;
         if (c.classList.contains(spacerClass)) return 0;
         let w = c.offsetWidth;
         let style = getComputedStyle(c);
         let marginLeft = style.getPropertyValue("margin-left");
         if (isString(marginLeft) && marginLeft.endsWith("px")) w += parseFloat(marginLeft);
         let marginRight = style.getPropertyValue("margin-right");
         if (isString(marginRight) && marginRight.endsWith("px")) w += parseFloat(marginRight);
         return w;
      });
      let clientWidth = this.el!.clientWidth;
      let overflowWidth = widths[widths.length - 1];
      for (let i = 0; i < widths.length - 1; i++) {
         let overflowReduction = i == widths.length - 2 ? 0 : overflowWidth;
         if (widths[i] + fitItemsWidth > clientWidth - overflowReduction) break;
         nonOverflownItemCount++;
         fitItemsWidth += widths[i];
      }

      instance.nonOverflownItemCount = nonOverflownItemCount;

      if (!this.isMeasureOverflowDisabled && this.state.nonOverflownItemCount != nonOverflownItemCount) {
         this.isMeasureOverflowDisabled = true;
         this.setState(
            {
               nonOverflownItemCount,
            },
            () => {
               this.isMeasureOverflowDisabled = false;
            },
         );
      }
   }

   componentWillUnmount() {
      this.unsubscribeFocusOut && this.unsubscribeFocusOut();
      this.unsubscribeResize && this.unsubscribeResize();
   }
}

Menu.prototype.baseClass = "menu";
Menu.prototype.tag = "ul";

Widget.alias("menu", Menu);

interface MenuItemComponentProps {
   itemInfo: any[];
   itemIndex: number;
   itemKey: any;
   instance: MenuInstance;
   cursor: boolean;
   hidden: boolean;
   moveCursor: (itemKey: any) => void;
   children?: any;
}

interface MenuItemComponentState {
   focusable: boolean;
}

class MenuItemComponent extends VDOM.Component<MenuItemComponentProps, MenuItemComponentState> {
   el: HTMLElement | null = null;

   constructor(props: MenuItemComponentProps) {
      super(props);
      this.state = { focusable: true };
   }

   render() {
      let { itemInfo, itemIndex, itemKey, instance, cursor, hidden } = this.props;
      let { widget } = instance;
      let { CSS, baseClass } = widget;
      let mods = {
         cursor: cursor,
         focusable: this.state.focusable,
         hidden,
      };

      return (
         <li
            ref={(c) => {
               this.el = c;
               itemInfo[itemIndex] = {
                  el: c,
                  focusable: this.state.focusable,
                  key: itemKey,
               };
            }}
            className={CSS.element(baseClass, "item", mods)}
            onFocus={this.onFocus.bind(this)}
            onMouseDown={this.onMouseDown.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
         >
            {this.props.children}
         </li>
      );
   }

   onFocus(e: React.FocusEvent) {
      FocusManager.nudge();
      debug(menuFlag, "MenuItem", "focus", this.el, e.target);
      this.props.moveCursor(this.props.itemKey);
   }

   onKeyDown(e: React.KeyboardEvent) {
      let { instance } = this.props;
      let { widget } = instance;

      if (widget.onKeyDown) instance.invoke("onKeyDown", e, instance);
   }

   onMouseDown(e: React.MouseEvent) {
      e.stopPropagation();

      //e.preventDefault(); //Causes problems with focusing menu items. Figure out why is this really needed?

      debug(menuFlag, "MenuItem", "mouseDown", this.el);
      if (this.state.focusable) {
         let { itemInfo, itemIndex } = this.props;
         let el = itemInfo[itemIndex].el;
         let focusableSubElement = closest(e.target as Element, (domEl) => domEl === el || isFocusable(domEl));
         if (focusableSubElement == el) {
            //the user clicked on an unfocusable branch of elements
            //lets find a focusable child element and focus it
            //TODO: explain why is this really needed
            let focusedEl = getFocusedElement();
            let focusedChild = FocusManager.focusFirst(el);
            if (focusedChild !== focusedEl) {
               debug(menuFlag, "MenuItem", "focusChild", focusedChild, focusedEl);
            }
         }
      }
   }

   componentDidMount() {
      this.componentDidUpdate();
   }

   componentDidUpdate() {
      let { itemInfo, itemIndex, hidden } = this.props;
      let focusable = !hidden && !!findFirst(this.el!, isFocusable);
      if (focusable !== this.state.focusable) {
         itemInfo[itemIndex].focusable = focusable;
         this.setState({ focusable: focusable });
      }
   }
}
