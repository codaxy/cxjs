export function isSelector(config) {

   if (config == null)
      return true;

   switch (typeof config) {
      case 'object':
         if (config.type || config.$type)
            return false;
         if (config.bind)
            return true;
         if (config.tpl)
            return true;
         if (config.expr)
            return true;
         return false;

      case 'function':
         return true;

      case 'string':
         return true;

      case 'number':
         return true;

      case 'boolean':
         return true;
   }

   return false;
}
