export function createAccessorModelProxy(chain = "") {
   const proxy = new Proxy(() => {}, {
      get: (target, name) => {
         if (name === "isAccessorChain") return true;
         if (typeof name !== "string") return this;
         if (name === "toString" || name === "valueOf") return proxy;

         let newChain = chain;
         if (newChain.length > 0) newChain += ".";
         newChain += name;
         return createAccessorModelProxy(newChain);
      },

      apply() {
         return chain;
      },
   });
   proxy.isAccessorChain = true;
   return proxy;
}

export function isAccessorChain(value) {
   return value != null && !!value.isAccessorChain;
}
