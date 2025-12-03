/** @jsxImportSource react */
import { Widget, VDOM, WidgetConfig, WidgetStyleConfig } from "../ui/Widget";
import { parseStyle } from "../util/parseStyle";
import { isNumber } from "../util/isNumber";
import { RenderingContext } from "../ui/RenderingContext";
import { Instance } from "../ui/Instance";
import { NumberProp, BooleanProp, StringProp } from "../ui/Prop";

export interface ProgressBarConfig extends WidgetConfig, WidgetStyleConfig {
   /** Progress value, a number between `0` and `1`. Default value is `0`. */
   value?: NumberProp;

   /** Defaults to `false`. Set to `true` to make it look disabled. */
   disabled?: BooleanProp;

   /** Progress bar annotation. */
   text?: StringProp;
}

export class ProgressBar extends Widget<ProgressBarConfig> {
   declare baseClass: string;
   declare disabled?: BooleanProp;

   constructor(config?: ProgressBarConfig) {
      super(config);
   }

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            disabled: undefined,
            text: undefined,
            value: undefined,
         },
         ...args,
      );
   }

   render(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      let { widget, data } = instance;
      let { text, value, disabled } = data;
      let { CSS, baseClass } = widget;

      if (!isNumber(value)) value = 0;

      return (
         <div
            key={key}
            className={CSS.expand(data.classNames as string, CSS.state({ disabled }))}
            style={data.style as any}
         >
            <div
               className={CSS.element(this.baseClass, "indicator")}
               style={{
                  width: `${((value as number) > 1 ? 1 : (value as number) < 0 ? 0 : (value as number)) * 100}%`,
               }}
            />
            <div className={CSS.element(this.baseClass, "label")}>{text}</div>
         </div>
      );
   }
}

ProgressBar.prototype.styled = true;
ProgressBar.prototype.disabled = false;
ProgressBar.prototype.baseClass = "progressbar";
