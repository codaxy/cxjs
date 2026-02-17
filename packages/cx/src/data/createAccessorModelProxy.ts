// Homomorphic mapped type preserves Go-to-Definition in IDEs
// -? strips optionality, as clause filters conflicting method names
type AccessorChainMap<M> = {
   [K in keyof M as Exclude<K, "toString" | "valueOf" | "nameOf">]-?: AccessorChain<M[K]>;
};

// Check if a type is `any` using the intersection trick
type IsAny<T> = 0 extends 1 & T ? true : false;

export type AccessorChain<M> = (IsAny<M> extends true
   ? { [key: string]: any } // Allow any property access for `any` type
   : [M] extends [object]
     ? AccessorChainMap<M> // Direct mapping preserves IDE navigation
     : [NonNullable<M>] extends [object]
       ? AccessorChainMap<NonNullable<M>> // Fallback for nullable types (e.g. optional properties)
       : {}) & {
   toString(): string;
   valueOf(): M | undefined;
   nameOf(): string;
};

const emptyFn = () => {};

export function createAccessorModelProxy<M>(chain: string = ""): AccessorChain<M> {
   let lastOp: string | null = null;

   const proxy = new Proxy(emptyFn, {
      get: (_, name: string | symbol) => {
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
         return createAccessorModelProxy(newChain);
      },

      apply(): string {
         switch (lastOp) {
            case "nameOf":
               const lastDotIndex = chain.lastIndexOf(".");
               return lastDotIndex > 0 ? chain.substring(lastDotIndex + 1) : chain;

            default:
               return chain;
         }
      },
   });
   return proxy as unknown as AccessorChain<M>;
}

export const createModel = createAccessorModelProxy;

export function isAccessorChain<M>(value: unknown): value is AccessorChain<M> {
   return value != null && !!(value as any).isAccessorChain;
}
