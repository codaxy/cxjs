export function createAccessorModelProxy(chain = "") {
   let op = null;
   const proxy = new Proxy(() => {}, {
      get: (target, name) => {
         if (typeof name !== "string") return this;
         if (name == "toString") {
            op = name;
            return proxy;
         }
         let newChain = chain;
         if (newChain.length > 0) newChain += ".";
         if (op != null) {
            newChain += op;
            newChain += ".";
         }
         newChain += name;
         op = null;
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
   return !!value.isAccessorChain;
}
