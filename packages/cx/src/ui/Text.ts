import { Widget } from './Widget';

export class Text extends Widget {
   value?: any;
   tpl?: string;
   expr?: any;
   bind?: string;

   init() {
      if (!this.value && (this.tpl || this.expr || this.bind))
         this.value = {
            tpl: this.tpl,
            expr: this.expr,
            bind: this.bind
         };
      super.init();
   }

   declareData(...args: any[]) {
      super.declareData({
         value: undefined
      }, ...args);
   }

   render(context: any, { data }: any, key: string) {
      return data.value != null ? data.value : '';
   }
}

Widget.alias('text', Text)
