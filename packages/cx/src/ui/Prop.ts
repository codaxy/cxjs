import type { Instance } from "./Instance";
import { Selector } from "../data/Selector";
import { AccessorChain } from "../data/createAccessorModelProxy";

export type Bind = {
   bind: string;
   defaultValue?: any;
   throttle?: number;
   debounce?: number;
};

export type Tpl = {
   tpl: string;
};

export type Expr = {
   expr: string;
   set?: (value: any, instance?: Instance) => boolean;
   throttle?: number;
   debounce?: number;
};

export type Binding = Bind | Tpl | Expr;

export type GetSet<T> = {
   get: Selector<T>;
   set?: (value: T, instance?: Instance) => boolean;
   throttle?: number;
   debounce?: number;
};

export interface StructuredSelector {
   [prop: string]: Selector<any>;
}

export type Prop<T> = T | Binding | Selector<T> | AccessorChain<T> | GetSet<T>;

export type WritableProp<T> = Bind | AccessorChain<T>;

export interface DataRecord {
   [prop: string]: any;
}

export interface Config {
   [prop: string]: any;
}

export interface StructuredProp {
   [prop: string]: Prop<any>;
}

/**
 * Utility type that extracts the resolved value type from a Prop<T>.
 * Used to derive the runtime type of structured props.
 */
export type ResolveProp<P> =
   P extends Selector<infer T>
      ? T
      : P extends AccessorChain<infer T>
        ? T
        : P extends GetSet<infer T>
          ? T
          : P extends Bind
            ? any
            : P extends Tpl
              ? string
              : P extends Expr
                ? any
                : P;

/**
 * Utility type that resolves a structured prop object to its runtime value types.
 * Transforms { name: StringProp, count: NumberProp } to { name: string, count: number }
 */
export type ResolveStructuredPropType<S> = {
   [K in keyof S]: ResolveProp<S[K]>;
};

/**
 * Resolves the runtime value type from either a Prop<T> or a StructuredProp.
 * Use this for generic widgets like ContentResolver and Validator where the
 * input can be either a single prop or a structured object.
 *
 * - For Prop<T> (Selector, AccessorChain, GetSet), resolves to T
 * - For bindings (Bind, Tpl, Expr), resolves to any/string/any
 * - For structured objects, recursively resolves each property via ResolveStructuredProp
 * - For literal values, returns them as-is
 */
export type ResolvePropType<P> =
   P extends Selector<infer T>
      ? T
      : P extends AccessorChain<infer T>
        ? T
        : P extends GetSet<infer T>
          ? T
          : P extends Bind
            ? any
            : P extends Tpl
              ? string
              : P extends Expr
                ? any
                : P extends object
                  ? ResolveStructuredPropType<P>
                  : P;

/**
 * Generic structured prop type that provides type safety for params and their resolved values.
 * Use with ContentResolver and similar widgets to type the onResolve callback params.
 */
export type TypedStructuredProp<T extends Record<string, any>> = {
   [K in keyof T]: Prop<T[K]>;
};

export type StringProp = Prop<string>;
export type StyleProp = Prop<string | React.CSSProperties> | StructuredProp;
export type NumberProp = Prop<number>;
export type BooleanProp = Prop<boolean>;
export type ClassProp = Prop<string> | StructuredProp;
export type RecordsProp = Prop<DataRecord[]>;
export type SortersProp = Prop<Sorter[]>;
export type UnknownProp = Prop<unknown>;
export type ModProp = StringProp | StructuredProp;

export type RecordAlias = string | { toString(): string };

export type SortDirection = "ASC" | "DESC";

export interface Sorter {
   field?: string;
   value?: (record: DataRecord) => any;
   direction: SortDirection;
}

export interface CollatorOptions {
   localeMatcher?: "lookup" | "best fit";
   usage?: "sort" | "search";
   sensitivity?: "base" | "accent" | "case" | "variant";
   ignorePunctuation?: boolean;
   numeric?: boolean;
   caseFirst?: "upper" | "lower" | "false";
}
