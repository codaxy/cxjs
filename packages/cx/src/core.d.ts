export = Cx;
export as namespace Cx;

import * as React from "react";
import { Instance } from "./ui/Instance";
import { RenderingContext } from "./ui/RenderingContext";
import { AccessorChain as AccessorChainType } from "./data/createAccessorModelProxy";
import { Selector as SelectorType } from "./data/Selector";
import type {
   Bind as BindType,
   Tpl as TplType,
   Expr as ExprType,
   Binding as BindingType,
   GetSet as GetSetType,
   Prop as PropType,
   StructuredSelector as StructuredSelectorType,
   DataRecord,
   Config as ConfigType,
   StructuredProp as StructuredPropType,
   StringProp as StringPropType,
   StyleProp as StylePropType,
   NumberProp as NumberPropType,
   BooleanProp as BooleanPropType,
   ClassProp as ClassPropType,
   RecordsProp as RecordsPropType,
   SortersProp as SortersPropType,
   UnknownProp as UnknownPropType,
   RecordAlias as RecordAliasType,
   SortDirection as SortDirectionType,
   Sorter as SorterType,
   CollatorOptions as CollatorOptionsType,
} from "./ui/Prop";

/** @deprecated */
declare namespace Cx {
   // Re-export AccessorChain type from createAccessorModelProxy
   type AccessorChain<M> = AccessorChainType<M>;

   // Re-export Selector type from data/Selector
   type Selector<T> = SelectorType<T>;

   // Re-export binding types from Prop.ts
   type Bind = BindType;
   type Tpl = TplType;
   type Expr = ExprType;
   type Binding = BindingType;
   type GetSet<T> = GetSetType<T>;

   // Re-export types from Prop.ts
   type Prop<T> = PropType<T>;

   interface StructuredSelector extends StructuredSelectorType {}

   interface Record extends DataRecord {}

   interface Config extends ConfigType {}

   interface StructuredProp extends StructuredPropType {}

   type StringProp = StringPropType;
   type StyleProp = StylePropType;
   type NumberProp = NumberPropType;
   type BooleanProp = BooleanPropType;
   type ClassProp = ClassPropType;
   type RecordsProp = RecordsPropType;
   type SortersProp = SortersPropType;
   type UnknownProp = UnknownPropType;

   type RecordAlias = RecordAliasType;

   /** @deprecated */
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

   /** @deprecated */
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

   /** @deprecated */
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

   /** @deprecated */
   interface HtmlElementProps extends StyledContainerProps {
      /** Id of the element */
      id?: Cx.StringProp | Cx.NumberProp;

      /** Inner text contents. */
      text?: Cx.StringProp | Cx.NumberProp;

      /** Tooltip configuration. */
      tooltip?: StringProp | StructuredProp;

      // onMouseDown?: string | ((event: MouseEvent, instance: any) => void);
      // onMouseMove?: string | ((event: MouseEvent, instance: any) => void);
      // onMouseUp?: string | ((event: MouseEvent, instance: any) => void);
      // onTouchStart?: string | ((event: TouchEvent, instance: any) => void);
      // onTouchMove?: string | ((event: TouchEvent, instance: any) => void);
      // onTouchEnd?: string | ((event: TouchEvent, instance: any) => void);
      // onClick?: string | ((event: MouseEvent, instance: any) => void);
      // onContextMenu?: string | ((event: MouseEvent, instance: any) => void);
   }

   type SortDirection = SortDirectionType;

   interface Sorter extends SorterType {}

   interface CollatorOptions extends CollatorOptionsType {}
}
