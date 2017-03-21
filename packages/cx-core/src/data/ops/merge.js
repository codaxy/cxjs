import {Binding} from '../Binding'
export function merge(item, data) {
   debugger;
   var result = item;
   if (data)
      for (let key in data)
         result = Binding.get(key).set(result, data[key]);
   return result;
}
