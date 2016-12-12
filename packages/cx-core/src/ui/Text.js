import {Widget} from './Widget';

export class Text extends Widget {
   init() {
      if (!this.value && (this.tpl || this.expr || this.bind))
         this.value = {
            tpl: this.tpl,
            expr: this.expr,
            bind: this.bind
         };
      super.init();
   }

   declareData() {
      super.declareData({
         value: undefined
      }, ...arguments);
   }

   render(context, {data}, key) {
      return data.value != null ? data.value : '';
   }


}

Widget.alias('text', Text)
