import { PureContainerBase, PureContainerConfig } from "./PureContainer";
import { isPromise } from "../util/isPromise";
import { RenderingContext } from "./RenderingContext";
import { BooleanProp, StructuredProp, ResolveStructuredProp, Bind, Tpl, Expr, GetSet } from "./Prop";
import { Selector } from "../data/Selector";
import { AccessorChain } from "../data/createAccessorModelProxy";
import { Instance } from "./Instance";

/**
 * Helper type that extracts the value type from typed props (Selector, AccessorChain, GetSet).
 * Returns never for bindings (Bind, Tpl, Expr) since they don't carry type information.
 * This is used to properly resolve Prop<T> unions where we want to extract T.
 */
type ExtractTypedPropValue<P> = P extends Selector<infer T>
   ? T
   : P extends AccessorChain<infer T>
     ? T
     : P extends GetSet<infer T>
       ? T
       : P extends Bind
         ? never
         : P extends Tpl
           ? never
           : P extends Expr
             ? never
             : P extends Record<string, any>
               ? never
               : P;

/**
 * Utility type that resolves params which can be either a simple Prop<T> or a StructuredProp.
 * - For Prop<T> unions (including Selector, AccessorChain, GetSet, bindings), extracts T
 * - For plain bindings (Bind, Expr) used directly, resolves to any
 * - For structured props (objects), applies ResolveStructuredProp to resolve each property
 */
type ResolveParams<P> = ExtractTypedPropValue<P> extends never
   ? P extends Bind
      ? any
      : P extends Tpl
        ? string
        : P extends Expr
          ? any
          : P extends Record<string, any>
            ? ResolveStructuredProp<P>
            : P
   : ExtractTypedPropValue<P>;

/**
 * Configuration for ContentResolver widget.
 *
 * The params type parameter enables type inference for the onResolve callback:
 * - Literal values (numbers, strings, booleans) preserve their types
 * - AccessorChain<T> resolves to T
 * - Bind/Tpl/Expr resolve to any (type cannot be determined at compile time)
 * - Structured props (objects) have each property resolved individually
 *
 * @example
 * ```typescript
 * // Structured params (object)
 * <ContentResolver
 *    params={{
 *       count: 42,           // number
 *       name: model.user.name // AccessorChain<string> -> string
 *    }}
 *    onResolve={(params) => {
 *       // params.count is number, params.name is string
 *    }}
 * />
 *
 * // Simple param (single value)
 * <ContentResolver
 *    params={model.user.name}  // AccessorChain<string>
 *    onResolve={(name) => {
 *       // name is string
 *    }}
 * />
 * ```
 */
export interface ContentResolverConfig<P = StructuredProp> extends PureContainerConfig {
   /** Parameters that trigger content resolution when changed. Can be a structured object or a single Prop. */
   params?: P;

   /**
    * Callback function that resolves content based on params. Can return content directly or a Promise.
    * The params type is inferred from the params property - literal values and AccessorChain<T>
    * preserve their types, while bindings (bind/tpl/expr) resolve to `any`.
    */
   onResolve?: string | ((params: ResolveParams<P>, instance: Instance) => any);

   /** How to combine resolved content with initial content. Default is 'replace'. */
   mode?: "replace" | "prepend" | "append";

   /** Indicates if content is being loaded. */
   loading?: BooleanProp;
}

export class ContentResolver<P = StructuredProp> extends PureContainerBase<ContentResolverConfig<P>> {
   constructor(config?: ContentResolverConfig<P>) {
      super(config);
   }

   declare mode: "replace" | "prepend" | "append";
   declare onResolve?: string | ((params: ResolveParams<P>, instance: Instance) => any);
   declare initialItems: any;

   declareData(...args: any[]): void {
      super.declareData(...args, {
         params: { structured: true },
         loading: undefined,
      });
   }

   init(): void {
      super.init();
      this.initialItems = this.layout ? this.layout.items : this.items;
      this.clear();
   }

   initInstance(context: RenderingContext, instance: any): void {
      instance.content = this.initialItems;
      instance.cachedParams = {}; //unique value which will never pass the equality check
   }

   prepareData(context: RenderingContext, instance: any): void {
      let { data } = instance;

      if (data.params !== instance.cachedParams && this.onResolve) {
         instance.cachedParams = data.params;
         let content = instance.invoke("onResolve", data.params, instance);
         if (isPromise(content)) {
            instance.set("loading", true);
            this.setContent(instance, null);
            content.then((cnt: any) => {
               this.setContent(instance, cnt);
               instance.setState({ cacheBuster: {} });
               instance.set("loading", false);
            });
         } else this.setContent(instance, content);
      }
   }

   setContent(instance: any, content: any): void {
      if (content) {
         this.clear();
         switch (this.mode) {
            case "prepend":
               this.add(content);
               this.add(this.initialItems);
               break;

            case "append":
               this.add(this.initialItems);
               this.add(content);
               break;

            case "replace":
               this.add(content);
               break;
         }
         instance.content = this.layout ? this.layout.items : this.items;
         this.clear();
      } else instance.content = this.initialItems;
   }

   explore(context: RenderingContext, instance: any): void {
      //a little bit hacky
      if (this.layout) this.layout.items = instance.content;
      else this.items = instance.content;
      super.explore(context, instance);
   }
}

ContentResolver.prototype.mode = "replace";
