import { Widget, VDOM, getContentArray } from "../ui/Widget";
import { HtmlElement } from "./HtmlElement";
import { yesNo } from "./overlay/alerts";
import { Icon } from "./Icon";
import { preventFocus } from "../ui/FocusManager";
import { isFunction } from "../util/isFunction";
import { isDefined } from "../util/isDefined";
import { coalesce } from "../util/coalesce";
import type { RenderingContext } from "../ui/RenderingContext";
import type { Instance, WidgetData, RenderProps } from "../ui/Instance";
import { YesNoResult } from "../ui/Instance";

interface ButtonData extends WidgetData {
   pressed?: boolean;
   icon?: string | boolean;
   disabled?: boolean;
   enabled?: boolean;
}

export class Button extends HtmlElement {
   public tag?: string;
   public baseClass?: string;
   public icon?: boolean | string;
   public focusOnMouseDown?: boolean;
   public submit?: boolean;
   public dismiss?: boolean;
   public onMouseDown?: string | ((e: MouseEvent, instance: Instance) => void);

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         confirm: { structured: true },
         pressed: undefined,
         icon: undefined,
         disabled: undefined,
         enabled: undefined,
      });
   }

   prepareData(context: RenderingContext, instance: Instance): void {
      const { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         pressed: data.pressed,
      };
      if (isDefined(data.enabled)) data.disabled = !data.enabled;

      super.prepareData(context, instance);
   }

   explore(context: RenderingContext, instance: Instance): void {
      instance.data.parentDisabled = context.parentDisabled;
      instance.data.parentStrict = context.parentStrict;

      if (instance.cache("parentDisabled", context.parentDisabled)) instance.markShouldUpdate(context);
      if (instance.cache("parentStrict", context.parentStrict)) instance.markShouldUpdate(context);

      super.explore(context, instance);
   }

   attachProps(context: RenderingContext, instance: Instance, props: RenderProps): void {
      super.attachProps(context, instance, props);

      if (!this.focusOnMouseDown) {
         props.onMouseDown = (e: React.MouseEvent) => {
            if (this.onMouseDown && instance.invoke("onMouseDown", e.nativeEvent, instance) === false) return;
            preventFocus(e);
         };
      }

      if (this.dismiss) {
         const { onClick } = props;

         props.onClick = (e: React.MouseEvent) => {
            if (onClick) {
               const result = onClick(e);
               if (result === false) return;
            }

            if (instance.parentOptions && isFunction(instance.parentOptions.dismiss)) {
               instance.parentOptions.dismiss();
            }
         };
      }

      if (this.tag === "button") props.type = this.submit ? "submit" : "button";

      delete props.confirm;
      delete props.dismiss;
      delete props.pressed;
      delete props.submit;
      delete props.focusOnMouseDown;
      delete props.icon;
      delete props.enabled;

      const { data } = instance;

      props.disabled = coalesce(data.parentStrict ? data.parentDisabled : null, data.disabled, data.parentDisabled) as
         | boolean
         | undefined;

      if (data.confirm) {
         const oldOnClick = props.onClick;
         props.onClick = (e: React.MouseEvent) => {
            yesNo(data.confirm!).then((btn: string) => {
               if (btn === YesNoResult.Yes && oldOnClick) {
                  oldOnClick(e);
               }
            });
         };
      }

      if (data.icon) {
         const icon = Icon.render(data.icon, {
            key: "icon",
            className: this.CSS.element(this.baseClass, "icon"),
         });
         const children = getContentArray(props.children);
         props.children = [icon, ...children];
         props.className = this.CSS.expand(
            props.className,
            this.CSS.state("icon"),
            children.length === 0 && this.CSS.state("empty"),
         );

         if (children.length === 0) {
            (props.children as React.ReactNode[]).push(
               <span key="baseline" className={this.CSS.element(this.baseClass, "baseline")}>
                  &nbsp;
               </span>,
            );
         }
      }
   }
}

Button.prototype.tag = "button";
Button.prototype.baseClass = "button";
Button.prototype.icon = false;
Button.prototype.focusOnMouseDown = false;
Button.prototype.submit = false;

Widget.alias("button", Button);
