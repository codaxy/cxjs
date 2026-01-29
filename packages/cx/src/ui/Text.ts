import { Widget, WidgetConfig } from "./Widget";
import { NumberProp, StringProp } from "./Prop";

export interface TextConfig extends WidgetConfig {
   /** The value to be rendered as text. */
   value?: StringProp | NumberProp;

   /** Template string for the text value. */
   tpl?: string;

   /** Expression for the text value. */
   expr?: string;

   /** Binding path for the text value. */
   bind?: string;
}

export class Text extends Widget<TextConfig> {
   declare value?: any;
   declare tpl?: string;
   declare expr?: any;
   declare bind?: string;

   constructor(config?: TextConfig) {
      super(config);
   }

   init() {
      if (!this.value && (this.tpl || this.expr || this.bind))
         this.value = {
            tpl: this.tpl,
            expr: this.expr,
            bind: this.bind,
         };
      super.init();
   }

   declareData(...args: any[]) {
      super.declareData(
         {
            value: undefined,
         },
         ...args,
      );
   }

   render(context: any, { data }: any, key: string) {
      return data.value != null ? data.value : "";
   }
}

Widget.alias("text", Text);
