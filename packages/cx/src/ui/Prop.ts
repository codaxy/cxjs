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
   set?: (value: any, instance?: any) => boolean;
   throttle?: number;
   debounce?: number;
};

export type Binding = Bind | Tpl | Expr;

export type GetSet<T> = {
   get: Selector<T>;
   set?: (value: T, instance?: any) => boolean;
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
