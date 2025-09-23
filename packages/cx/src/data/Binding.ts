let bindingCache: Record<string, Binding<any>> = {};
import { isString } from "../util/isString";
import { isObject } from "../util/isObject";
import { isAccessorChain } from "./createAccessorModelProxy";
import { AccessorChain } from "./createAccessorModelProxy";

export interface BindingObject {
  bind: string;
  defaultValue?: any;
  throttle?: number;
  debounce?: number;
}

export type BindingInput<T = any> = string | BindingObject | Binding<T> | AccessorChain<T>;

export type ValueGetter<T> = (state: any) => T | undefined;

export class Binding<T = any> {
   public readonly path: string;
   public readonly parts: readonly string[];
   public readonly value: ValueGetter<T>;

   constructor(path: string) {
      this.path = path;
      this.parts = path.split(".") as readonly string[];
      let body = "return x";
      for (let i = 0; i < this.parts.length; i++) body += '?.["' + this.parts[i] + '"]';
      this.value = new Function("x", body) as ValueGetter<T>;
   }

   set<S extends Record<string, any>>(state: S, value: T): S {
      const cv = this.value(state);
      if (cv === value) return state;

      const ns = Object.assign({}, state) as S;
      let o: any = ns;

      for (let i = 0; i < this.parts.length; i++) {
         const part = this.parts[i];
         const no = i === this.parts.length - 1 ? value : Object.assign({}, o[part]);
         o[part] = no;
         o = no;
      }

      return ns;
   }

   delete<S extends Record<string, any>>(state: S): S {
      const ns = Object.assign({}, state) as S;
      let o: any = ns;
      let part: string;

      for (let i = 0; i < this.parts.length - 1; i++) {
         part = this.parts[i];
         const no = Object.assign({}, o[part]);
         o[part] = no;
         o = no;
      }

      part = this.parts[this.parts.length - 1];
      if (!o.hasOwnProperty(part)) return state;

      delete o[part];

      return ns;
   }

   static get<T = any>(path: BindingInput<T>): Binding<T> {
      if (isString(path)) {
         let b = bindingCache[path] as Binding<T> | undefined;
         if (b) return b;

         b = new Binding<T>(path);
         bindingCache[path] = b;
         return b;
      }

      if (isObject(path) && 'bind' in path && isString((path as BindingObject).bind)) {
         return this.get<T>((path as BindingObject).bind);
      }

      if (path instanceof Binding) return path as Binding<T>;

      if (isAccessorChain(path)) return this.get<T>((path as AccessorChain<T>).toString());

      throw new Error("Invalid binding definition provided.");
   }
}

export function isBinding(value: unknown): value is BindingInput {
   if (isObject(value)) {
      const obj = value as Record<string, any>;
      if ('bind' in obj && isString(obj.bind)) return true;
      if ('isAccessorChain' in obj && obj.isAccessorChain === true) return true;
   }
   return value instanceof Binding;
}

export type BindingValue<B> = B extends Binding<infer T> ? T : unknown;

export function isBindingObject(value: unknown): value is BindingObject {
   if (!isObject(value)) return false;
   const obj = value as Record<string, any>;
   return 'bind' in obj && isString(obj.bind);
}

export function isAccessorChainObject<T>(value: unknown): value is AccessorChain<T> {
   if (!isObject(value)) return false;
   const obj = value as Record<string, any>;
   return 'isAccessorChain' in obj && obj.isAccessorChain === true;
}

export { bindingCache };
