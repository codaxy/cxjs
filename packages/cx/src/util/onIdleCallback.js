export function onIdleCallback(callback, options) {
   let token = null;
   if (typeof requestIdleCallback == "function")
      token = requestIdleCallback(callback, options);
   else
      token = setTimeout(callback, 1);

   return () => {
      if (typeof cancelIdleCallback == "function")
         cancelIdleCallback(token);
      else
         clearTimeout(token);
   }
}