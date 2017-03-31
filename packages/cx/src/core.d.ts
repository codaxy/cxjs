export = Cx;
export as namespace Cx;

import * as React from 'react';

declare namespace Cx {

   interface Binding {
      bind?: string,
      tpl?: string,
      expr?: string,
      defaultValue?: any
   }

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
   type StyleProp = Prop<string | React.CSSProperties>;
   type NumberProp = Prop<number>;
   type BooleanProp = Prop<boolean>;
   type ClassProp = Prop<string> | StructuredProp;
   type RecordsProp = Prop<Record[]>;

   interface WidgetProps {
      layout?: any,
      outerLayout?: any,
      putInto?: string,
      contentFor?: string,
      controller?: any,
      visible?: BooleanProp,
      if?: BooleanProp,
      mod?: StringProp | Prop<string[]> | StructuredProp
   }

   interface PureContainerProps extends WidgetProps {
      ws?: boolean
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
   }

   interface HtmlElementProps extends StyledContainerProps {
      id?: string | number | Binding | Selector<string | number>,

      /** Inner text contents. */
      text?: string | number | Binding | Selector<string | number>
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
   interface HTMLProps<T> extends Cx.PureContainerProps {
      class?: Cx.ClassProp
   }

   //this doesn't work, however, it would be nice if it does
   interface EventHandler<E extends React.SyntheticEvent<any>> {
      (event: E, instance?: any): void;
   }
}