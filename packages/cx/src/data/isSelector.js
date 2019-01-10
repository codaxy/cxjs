export function isSelector(config) {

   if (config == null)
      return true;

   switch (typeof config) {
      case 'object':
         if (config.type || config.$type)
            return false;
         return !!(config.bind || config.tpl || config.expr || config.get);

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
