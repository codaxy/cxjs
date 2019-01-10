export = Cx;
export as namespace Cx;

import * as React from 'react';
import {Layout} from './ui/layout/Layout';

declare namespace Cx {

   type Bind = {
      bind: string,
      defaultValue?: any,
      throttle?: number,
      debounce?: number
   }

   type Tpl = {
      tpl: string,
      defaultValue?: any
   }

   type Expr = {
      expr: string,
      defaultValue?: any
   }

   type Binding = Bind | Tpl | Expr;

   type Selector<T> = (data: any) => T;

   interface StructuredSelector {
      [prop: string]: Selector<any>
   }

   type Prop<T> = Binding | T | Selector<T>;

   interface Record {
      [prop: string]: any
   }

   interface Config {
      [prop: string]: any
   }

   interface StructuredProp {
      [prop: string]: Prop<any>
   }

   type StringProp = Prop<string>;
   type StyleProp = Prop<string | React.CSSProperties> | StructuredProp;
   type NumberProp = Prop<number>;
   type BooleanProp = Prop<boolean>;
   type ClassProp = Prop<string> | StructuredProp;
   type RecordsProp = Prop<Record[]>;
   type SortersProp = Prop<Sorter[]>;

   interface WidgetProps {

      /** Inner layout used to display children inside the widget. */
      layout?: any,

      /** Outer (wrapper) layout used to display the widget in. */
      outerLayout?: any,

      /** Name of the ContentPlaceholder that should be used to display the widget. */
      putInto?: string,

      /** Name of the ContentPlaceholder that should be used to display the widget. */
      contentFor?: string,

      /** Controller. */
      controller?: any,

      /** Visibility of the widget. Defaults to `true`. */
      visible?: BooleanProp,

      /** Visibility of the widget. Defaults to `true`. */
      if?: BooleanProp,

      /** Appearance modifier. For example, mod="big" will add the CSS class `.cxm-big` to the block element. */
      mod?: StringProp | Prop<string[]> | StructuredProp,
      
      /** Cache render output. Default is `true`. */
      memoize?: BooleanProp,

      /** Widget supports class, className and style attributes. */
      styled?: boolean,
   }

   interface PureContainerProps extends WidgetProps {
      
      /** Keep whitespace in text based children. Default is `false`. See also `trimWhitespace`. */
      ws?: boolean,

      /** Remove all whitespace in text based children. Default is `true`. See also `preserveWhitespace`. */
      trimWhitespace?: boolean,

      /** Keep whitespace in text based children. Default is `false`. See also `trimWhitespace`. */
      preserveWhitespace?: boolean,

      /** List of child elements. */
      items?: any,

      /** List of child elements. */
      children?: React.ReactNode,

      plainText?: boolean

   }

   interface StyledContainerProps extends PureContainerProps {

     /** 
     * Additional CSS classes to be applied to the element. 
     * If an object is provided, all keys with a "truthy" value will be added to the CSS class list.
     */
      class?: ClassProp,

      /** 
      * Additional CSS classes to be applied to the element. 
      * If an object is provided, all keys with a "truthy" value will be added to the CSS class list.
      */
      className?: ClassProp,

      /** Style object applied to the element */
      style?: StyleProp,

      /** Style object applied to the element */
      styles?: Cx.StyleProp
   }

   interface HtmlElementProps extends StyledContainerProps {

      /** Id of the element */
      id?: string | number | Binding | Selector<string | number>,

      /** Inner text contents. */
      text?: string | number | Binding | Selector<string | number>

      /** Tooltip configuration. */
      tooltip?: StringProp | StructuredProp
   }

   interface Sorter {
      field?: string;
      value?: (Record) => any;
      direction: 'ASC' | 'DESC';
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
         cx: any
      }
   }
}

declare module "react" {
   interface ClassAttributes<T> extends Cx.PureContainerProps {
      class?: Cx.ClassProp,
      styles?: Cx.StyleProp,
      text?: Cx.StringProp,
      innerText?: Cx.StringProp,
      html?: Cx.StringProp,
      innerHtml?: Cx.StringProp
   }

   //this doesn't work, however, it would be nice if it does
   // interface EventHandler<E extends React.SyntheticEvent<any>> {
   //    (event: E, instance?: any): void;
   // }
}