export = Cx;
export as namespace Cx;

import * as React from "react";

declare namespace Cx {
   type Bind = {
      bind: string;
      defaultValue?: any;
      throttle?: number;
      debounce?: number;
   };

   type Tpl = {
      tpl: string;
   };

   type Expr = {
      expr: string;
      set?: (value: any, instance?: any) => boolean;
      throttle?: number;
      debounce?: number;
   };

   type Binding = Bind | Tpl | Expr;

   type Selector<T> = (data: any) => T;

   type GetSet<T> = {
      get: Selector<T>;
      set?: (value: T, instance?: any) => boolean;
      throttle?: number;
      debounce?: number;
   };

   interface StructuredSelector {
      [prop: string]: Selector<any>;
   }

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

   type Prop<T> = T | Binding | Selector<T> | AccessorChain<T> | GetSet<T>;

   interface Record {
      [prop: string]: any;
   }

   interface Config {
      [prop: string]: any;
   }

   interface StructuredProp {
      [prop: string]: Prop<any>;
   }

   type StringProp = Prop<string>;
   type StyleProp = Prop<string | React.CSSProperties> | StructuredProp;
   type NumberProp = Prop<number>;
   type BooleanProp = Prop<boolean>;
   type ClassProp = Prop<string> | StructuredProp;
   type RecordsProp = Prop<Record[]>;
   type SortersProp = Prop<Sorter[]>;
   type UnknownProp = Prop<unknown>;

   type RecordAlias = string | { toString(): string };

   interface WidgetProps {
      /** Inner layout used to display children inside the widget. */
      layout?: any;

      /** Outer (wrapper) layout used to display the widget in. */
      outerLayout?: any;

      /** Name of the ContentPlaceholder that should be used to display the widget. */
      putInto?: string;

      /** Name of the ContentPlaceholder that should be used to display the widget. */
      contentFor?: string;

      /** Controller. */
      controller?: any;

      /** Visibility of the widget. Defaults to `true`. */
      visible?: BooleanProp;

      /** Visibility of the widget. Defaults to `true`. */
      if?: BooleanProp;

      /** Appearance modifier. For example, mod="big" will add the CSS class `.cxm-big` to the block element. */
      mod?: StringProp | Prop<string[]> | StructuredProp;

      /** Cache render output. Default is `true`. */
      memoize?: BooleanProp;

      /** Widget supports class, className and style attributes. */
      styled?: boolean;

      /** Key that will be used as the key when rendering the React component.  */
      vdomKey?: string;

      onExplore?(context?: any, instance?: any): void;

      onPrepare?(context?: any, instance?: any): void;

      onCleanup?(context?: any, instance?: any): void;

      onDestroy?(): void;
   }

   interface PureContainerProps extends WidgetProps {
      /** Keep whitespace in text based children. Default is `false`. See also `trimWhitespace`. */
      ws?: boolean;

      /** Remove all whitespace in text based children. Default is `true`. See also `preserveWhitespace`. */
      trimWhitespace?: boolean;

      /** Keep whitespace in text based children. Default is `false`. See also `trimWhitespace`. */
      preserveWhitespace?: boolean;

      /** List of child elements. */
      items?: any;

      /** List of child elements. */
      children?: React.ReactNode;

      plainText?: boolean;
   }

   interface StyledContainerProps extends PureContainerProps {
      /**
       * Additional CSS classes to be applied to the element.
       * If an object is provided, all keys with a "truthy" value will be added to the CSS class list.
       */
      class?: ClassProp;

      /**
       * Additional CSS classes to be applied to the element.
       * If an object is provided, all keys with a "truthy" value will be added to the CSS class list.
       */
      className?: ClassProp;

      /** Style object applied to the element */
      style?: StyleProp;

      /** Style object applied to the element */
      styles?: StyleProp;
   }

   interface HtmlElementProps extends StyledContainerProps {
      /** Id of the element */
      id?: string | number | Binding | Selector<string | number>;

      /** Inner text contents. */
      text?: Cx.StringProp | Cx.NumberProp;

      /** Tooltip configuration. */
      tooltip?: StringProp | StructuredProp;

      onMouseDown?: string | ((event: MouseEvent, instance: any) => void);
      onMouseMove?: string | ((event: MouseEvent, instance: any) => void);
      onMouseUp?: string | ((event: MouseEvent, instance: any) => void);
      onTouchStart?: string | ((event: TouchEvent, instance: any) => void);
      onTouchMove?: string | ((event: TouchEvent, instance: any) => void);
      onTouchEnd?: string | ((event: TouchEvent, instance: any) => void);
      onClick?: string | ((event: MouseEvent, instance: any) => void);
      onContextMenu?: string | ((event: MouseEvent, instance: any) => void);
   }

   type SortDirection = "ASC" | "DESC";

   interface Sorter {
      field?: string;
      value?: (Record) => any;
      direction: SortDirection;
   }

   interface CollatorOptions {
      localeMatcher?: "lookup" | "best fit";
      usage?: "sort" | "search";
      sensitivity?: "base" | "accent" | "case" | "variant";
      ignorePunctuation?: boolean;
      numeric?: boolean;
      caseFirst?: "upper" | "lower" | "false";
   }

   class Widget<P extends WidgetProps> {
      props: P;
      state: any;
      context: any;
      refs: any;

      constructor(props: P);

      render();

      setState(state: any);

      forceUpdate();

      static create(typeAlias?: any, config?: Cx.Config, more?: Cx.Config): any;
   }
}

declare global {
   namespace JSX {
      interface IntrinsicElements {
         cx: any;
      }

      interface IntrinsicAttributes {
         /** Inner layout used to display children inside the widget. */
         layout?: any;

         /** Outer (wrapper) layout used to display the widget in. */
         outerLayout?: any;

         /** Name of the ContentPlaceholder that should be used to display the widget. */
         putInto?: string;

         /** Name of the ContentPlaceholder that should be used to display the widget. */
         contentFor?: string;

         /** Controller. */
         controller?: any;

         /** Visibility of the widget. Defaults to `true`. */
         visible?: Cx.BooleanProp;

         /** Visibility of the widget. Defaults to `true`. */
         if?: Cx.BooleanProp;

         /** Appearance modifier. For example, mod="big" will add the CSS class `.cxm-big` to the block element. */
         mod?: Cx.StringProp | Cx.Prop<string[]> | Cx.StructuredProp;

         /** Cache render output. Default is `true`. */
         memoize?: Cx.BooleanProp;

         /** Tooltip configuration. */
         tooltip?: Cx.StringProp | Cx.StructuredProp;
      }
   }
}

declare module "react" {
   interface ClassAttributes<T> extends Cx.PureContainerProps {
      class?: Cx.ClassProp;
      styles?: Cx.StyleProp;
      text?: Cx.StringProp | Cx.NumberProp;
      innerText?: Cx.StringProp;
      html?: Cx.StringProp;
      innerHtml?: Cx.StringProp;
      tooltip?: Cx.StringProp | Cx.StructuredProp;
   }

   //this doesn't work, however, it would be nice if it does
   // interface EventHandler<E extends React.SyntheticEvent<any>> {
   //    (event: E, instance?: any): void;
   // }
}
