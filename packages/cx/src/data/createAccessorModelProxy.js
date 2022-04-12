const emptyFn = () => {};

export function createAccessorModelProxy(chain = "") {
   let lastOp = null;
   let lastName = null;

   const proxy = new Proxy(emptyFn, {
      get: (_, name) => {
         if (typeof name !== "string") return proxy;

         switch (name) {
            case "isAccessorChain":
               return true;

            case "toString":
            case "valueOf":
            case "nameOf":
               lastOp = name;
               return proxy;
         }

         let newChain = chain;
         if (newChain.length > 0) newChain += ".";
         newChain += name;
         lastName = name;
         return createAccessorModelProxy(newChain);
      },

      apply() {
         switch (lastOp) {
            case "nameOf":
               if (lastName != null) return lastName;
               const lastDotIndex = chain.lastIndexOf(".");
               return lastDotIndex > 0 ? chain.substring(lastDotIndex + 1) : chain;

            default:
               return chain;
         }
      },
   });
   return proxy;
}

export function isAccessorChain(value) {
   return value != null && !!value.isAccessorChain;
}
