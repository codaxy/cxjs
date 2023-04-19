import { Field } from "./Field";

export class Validator extends Field {
   declareData() {
      return super.declareData(...arguments, {
         value: {
            structured: true,
         },
         disabled: undefined,
      });
   }

   isEmpty(data) {
      return false;
   }

   render(context, instance, key) {
      if (!instance.state.visited || !instance.data.error) return;
      return this.renderChildren(context, instance, key);
   }
}
