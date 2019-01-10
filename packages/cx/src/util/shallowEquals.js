import {isArray} from './isArray';

export function shallowEquals(v1, v2) {

   if (v1 === v2)
      return true;

   let t1 = typeof v1,
      t2 = typeof v2,
      k, i;

   if (t1 != t2)
      return false;

   if (v1 == null || v2 == null) //this captures undefined too
      return false;

   if (t1 == 'object') {

      if (isArray(v1)) {
         if (!isArray(v2) || v1.length != v2.length)
            return false;

         for (i = 0; i < v1.length; i++)
            if (!shallowEquals(v1[i], v2[i]))
               return false;

         return true;
      }
      else {
         for (k in v1)
            if (v1.hasOwnProperty(k) && (!v2.hasOwnProperty(k) || v1[k] !== v2[k]))
               return false;

         for (k in v2)
            if (v2.hasOwnProperty(k) && (!v1.hasOwnProperty(k) || v1[k] !== v2[k]))
               return false;

         return true;
      }
   }
   return v1 === v2;
}
