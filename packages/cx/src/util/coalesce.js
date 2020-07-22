export function coalesce(...args) {
   for (let i = 0; i < args.length; i++) {
      if (args[i] != null) return args[i];
   }
   return null;
}
