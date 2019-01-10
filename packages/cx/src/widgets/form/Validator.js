import {Field} from './Field';

export class Validator extends Field {

   declareData() {
      return super.declareData(...arguments, {
         value: {
            structured: true
         }
      })
   }

   isEmpty(data) {
      return false;
   }

   render() {
      return null;
   }
}
