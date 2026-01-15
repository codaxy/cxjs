import { isString } from "./isString";
import { isFunction } from "./isFunction";
import { isArray } from "./isArray";

interface DecoratorFactory<T> {
   (t: T): T;
}

/** A Component class constructor (supports abstract classes) */
export type ComponentConstructor<T extends Component = Component> =
   (abstract new (config?: any) => T) & {
      isComponentType: true;
      prototype: T;
   };

/** Extract the config type from a Component class constructor */
export type ComponentConfigType<T> = T extends abstract new (
   config?: infer C,
) => any
   ? C & { isComponentType?: never }
   : unknown;

/** Extract the instance type from a Component class constructor */
export type ComponentInstanceType<T> = T extends abstract new (
   config?: any,
) => infer I
   ? I
   : Component;

/**
 * Type representing any valid input to Component.create that will produce an instance of T.
 *
 * Accepts:
 * - An instance of T (pass-through)
 * - A constructor for T or any subtype
 * - A config object for T (when T has a known config type)
 * - A config object with `type` or `$type` property specifying the constructor
 *
 * @example
 * // In a Chart widget config:
 * interface ChartConfig {
 *    xAxis?: Creatable<Axis>;  // Accepts NumericAxis, CategoryAxis, etc.
 *    yAxis?: Creatable<Axis>;
 * }
 *
 * // Usage:
 * <Chart xAxis={NumericAxis} />  // Just the type
 * <Chart xAxis={{ type: NumericAxis, min: 0, max: 100 }} />  // Config with type
 * <Chart xAxis={new NumericAxis({ min: 0 })} />  // Instance
 */

// Helper type: constructor for T or any subclass
type SubclassConstructor<TBaseCtor extends ComponentConstructor> =
   ComponentConstructor<ComponentInstanceType<TBaseCtor>>;

// Helper: get config type, falling back to base if subclass config is `any`
type ResolveConfigType<
   TBaseCtor extends ComponentConstructor,
   TSubCtor extends ComponentConstructor,
> = 0 extends 1 & ComponentConfigType<TSubCtor>
   ? ComponentConfigType<TBaseCtor> // TSubCtor config is `any`, use base config
   : ComponentConfigType<TSubCtor>; // Use specific subclass config

// Config with type property - uses inference to capture the actual subclass constructor
// When a specific subclass is provided, its config is used; otherwise base config + extra props allowed
type ConfigWithType<
   TBaseCtor extends ComponentConstructor,
   TSubCtor extends SubclassConstructor<TBaseCtor>,
> = {
   type: TSubCtor;
} & ResolveConfigType<TBaseCtor, TSubCtor> &
   // Allow extra properties when using generic subclass (enables subclass-specific props)
   (0 extends 1 & ComponentConfigType<TSubCtor>
      ? { [key: string]: unknown }
      : {});

type ConfigWith$Type<
   TBaseCtor extends ComponentConstructor,
   TSubCtor extends SubclassConstructor<TBaseCtor>,
> = {
   $type: TSubCtor;
} & ResolveConfigType<TBaseCtor, TSubCtor> &
   // Allow extra properties when using generic subclass (enables subclass-specific props)
   (0 extends 1 & ComponentConfigType<TSubCtor>
      ? { [key: string]: unknown }
      : {});

export type CreateConfig<
   TBaseCtor extends ComponentConstructor,
   TSubCtor extends
      SubclassConstructor<TBaseCtor> = SubclassConstructor<TBaseCtor>,
> =
   | TSubCtor // Constructor for T or subclass
   | ConfigWithType<TBaseCtor, TSubCtor> // Config object with type
   | ConfigWith$Type<TBaseCtor, TSubCtor>; // Config object with $type

export type Create<TCtor extends ComponentConstructor> =
   | ComponentInstanceType<TCtor> // Instance pass-through
   | CreateConfig<TCtor>;

/**
 * Type-checks a CreateConfig object based on its `type` or `$type` property.
 * This is a compile-time helper that returns the input unchanged at runtime.
 * Uses `const` type parameter (TypeScript 5.0+) to enable excess property checking.
 *
 * @example
 * // With type property
 * const axisConfig = validateConfig({ type: NumericAxis, min: 0, max: 100 });
 *
 * // With $type property
 * const selectionConfig = validateConfig({ $type: KeySelection, bind: "selection" });
 */
export function validateConfig<const TCtor extends ComponentConstructor>(
   config:
      | ({ type: TCtor; $type?: never } & ComponentConfigType<TCtor>)
      | ({ $type: TCtor; type?: never } & ComponentConfigType<TCtor>),
): any {
   return config;
}

const componentAlias: Record<string, any> = {};

export class Component {
   public static namespace: string;
   public static isComponentType: true;
   public static autoInit: boolean;
   public static factory: (
      alias: string,
      config?: any,
      more?: any,
   ) => Component;
   declare public isComponent: boolean;

   constructor(config?: any) {
      if (config && config.$props) {
         Object.assign(config, config.$props);
         delete config.$props;
      }
      Object.assign(this, config);
   }

   init() {}

   /**
    *
    * @param alias
    * @param type
    */
   static alias<T>(alias: string, type: T): void;
   static alias<T>(alias: string): DecoratorFactory<T>;
   static alias(alias: string, type?: any) {
      if (type) {
         type.prototype.componentAlias = alias;
         componentAlias[this.namespace + alias] = type;
      } //decorator usage
      else
         return (t: any) => {
            this.alias(alias, t);
            return t;
         };
   }

   /**
    * Creates a component instance from various input types.
    *
    * Supported signatures:
    * - Pass-through: If input is already a component instance, returns it unchanged
    * - Array: Maps over array elements, creating components for each
    * - Class type: Creates instance of the specified class with config
    * - Config with type/$type: Creates instance of the type specified in config
    * - String alias: Looks up registered alias and creates that type
    * - Plain config: Creates instance of the class `create` was called on
    *
    * @example
    * // Pass-through
    * const btn = new Button();
    * Button.create(btn) // returns btn as Button
    *
    * // Class type with config
    * Button.create(Button, { text: "Click" }) // returns Button
    *
    * // Config with type property
    * Widget.create({ type: Button, text: "Click" }) // returns Button
    *
    * // Plain config on specific class
    * Button.create({ text: "Click" }) // returns Button with ButtonConfig typing
    */

   // Pass-through: already a component instance
   static create<T extends Component>(instance: T, unused?: any): T;

   // Array of config objects with type or $type property (each item can have different type)
   static create<
      T extends (
         | { type: ComponentConstructor; $type?: never }
         | { $type: ComponentConstructor; type?: never }
      )[],
   >(
      configs: [...T],
      more?: Record<string, any>,
   ): {
      [K in keyof T]: T[K] extends { type: ComponentConstructor<infer U> }
         ? U
         : T[K] extends { $type: ComponentConstructor<infer U> }
           ? U
           : Component;
   };

   // Config object with type or $type property
   static create<
      TCtor extends ComponentConstructor,
      T extends Component = ComponentInstanceType<TCtor>,
   >(
      config: (
         | { type: TCtor; $type?: never; isComponentType?: never }
         | { $type: TCtor; type?: never; isComponentType?: never }
      ) &
         Partial<ComponentConfigType<ComponentConstructor<T>>>,
      more?: Partial<ComponentConfigType<ComponentConstructor<T>>>,
   ): T;

   // Class type with array of configs - returns array of instances
   static create<
      TCtor extends ComponentConstructor,
      T extends Component = ComponentInstanceType<TCtor>,
   >(
      type: TCtor,
      configs: ComponentConfigType<ComponentConstructor<T>>[],
      more?: Partial<ComponentConfigType<ComponentConstructor<T>>>,
   ): T[];

   // Explicit class type as first argument with typed config
   static create<
      TCtor extends ComponentConstructor,
      T extends Component = ComponentInstanceType<TCtor>,
   >(
      type: TCtor,
      config?: ComponentConfigType<ComponentConstructor<T>>,
      more?: Partial<ComponentConfigType<ComponentConstructor<T>>>,
   ): T;

   // Array of configs - returns array of instances of this class (this-bound)
   static create<T extends Component>(
      this: { prototype: T; isComponentType: true },
      configs: ComponentConfigType<ComponentConstructor<T>>[],
      more?: Partial<ComponentConfigType<ComponentConstructor<T>>>,
   ): T[];

   // Config object - returns instance of this class (this-bound)
   static create<T extends Component>(
      this: { prototype: T; isComponentType: true },
      config: ComponentConfigType<ComponentConstructor<T>>,
      more?: Partial<ComponentConfigType<ComponentConstructor<T>>>,
   ): T;

   // String alias (e.g., "div", "button") - returns instance of this class
   static create<T extends Component>(
      this: { prototype: T; isComponentType: true },
      alias: string,
      config?: ComponentConfigType<ComponentConstructor<T>>,
      more?: Partial<ComponentConfigType<ComponentConstructor<T>>>,
   ): T;

   // Implementation
   static create(typeAlias?: any, config?: any, more?: any): any {
      if (!typeAlias) return this.factory(typeAlias, config, more);

      if (typeAlias.isComponent) return typeAlias;

      if (isComponentFactory(typeAlias))
         return this.create(typeAlias.create(config), config, more);

      if (isArray(typeAlias))
         return typeAlias.map((c) => this.create(c as any, config, more));

      if (typeAlias.$type)
         return this.create(typeAlias.$type, typeAlias, config);

      if (typeAlias.type) {
         let { type, ...rest } = typeAlias;
         return this.create(type, rest, config);
      }

      let cmpType: any, alias: string;

      if (typeAlias.isComponentType) cmpType = typeAlias;
      else if (isFunction(typeAlias)) {
         if (this.factory) return this.factory(typeAlias, config, more);
         throw new Error(`Unsupported component type ${typeAlias}.`);
      } else if (isString(typeAlias)) {
         alias = this.namespace + typeAlias;
         cmpType = componentAlias[alias];
         if (!cmpType) {
            if (typeAlias && this.factory)
               return this.factory(typeAlias, config, more);
            throw new Error(`Unknown component alias ${alias}.`);
         }
      } else if (typeof typeAlias == "object") {
         // typeAlias.type and typeAlias.$type are handled above, so this is a plain config object
         cmpType = this;
         more = more ? Object.assign({}, config, more) : config;
         config = typeAlias;
      }

      if (isArray(config))
         return config.map((cfg: any) => this.create(cmpType, cfg, more));

      let cfg = config;

      if (more) cfg = Object.assign({}, config, more);

      // Check if merged cfg has type/$type that should override cmpType
      // Only redirect if cfgType is a class (not a string alias or factory) to prevent infinite recursion
      let cfgType = cfg && (cfg.type || cfg.$type);
      if (cfgType && cfgType.isComponentType && cfgType !== cmpType)
         return this.create(cfg);

      let cmp = new cmpType(cfg);
      if (cmpType.autoInit && cmp.init) cmp.init();
      return cmp;
   }
}

Component.prototype.isComponent = true;

Component.isComponentType = true;
Component.namespace = "";
Component.autoInit = false;

Component.factory = (alias: string, _config?: any, _more?: any): Component => {
   throw new Error(`Unknown component alias ${alias}.`);
};

export function createComponentFactory(
   factory: any,
   jsxDriver: any,
   meta?: any,
) {
   factory.$isComponentFactory = true;
   factory.$meta = meta;
   factory.create = jsxDriver;
   return factory;
}

export function isComponentFactory(factory: any): boolean {
   return factory && factory.$isComponentFactory;
}
