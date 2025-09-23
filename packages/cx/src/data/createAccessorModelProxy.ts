import { isObject } from "cx/util";

interface AccessorChainMethods {
   toString(): string;
   valueOf(): string;
   nameOf(): string;
}

type AccessorChainMap<M> = { [prop in keyof M]: AccessorChain<M[prop]> };

type AccessorChain<M> = {
   toString(): string;
   valueOf(): string;
   nameOf(): string;
} & Omit<AccessorChainMap<M>, keyof AccessorChainMethods>;

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

export function isAccessorChain<M>(value: unknown): value is AccessorChain<M> {
   return value != null && isObject(value) && "isAccessorChain" in value && !!value.isAccessorChain;
}

export { AccessorChain, AccessorChainMap, AccessorChainMethods };
