import type { RenderingContext } from "../ui/RenderingContext";
import type { Widget } from "../ui/Widget";
import type { View } from "../data/View";
import type React from "react";

/**
 * Serializable value types that can be safely passed through the framework
 */
export type SerializableValue = string | number | boolean | object | null | undefined;

/**
 * Core instance data structure used by widgets
 *
 * For custom widget data, extend this interface:
 * @example
 * interface MyWidgetData extends WidgetData {
 *    customProp: string;
 * }
 */
export interface WidgetData {
   visible?: boolean;
   disabled?: boolean;
   enabled?: boolean;
   text?: string;
   innerHtml?: string;
   attrs?: Record<string, unknown>;
   data?: Record<string, unknown>;
   classNames?: string;
   className?: string;
   class?: string;
   style?: Record<string, string | number> | string;
   stateMods?: Record<string, boolean | undefined>;
   mod?: Record<string, boolean | undefined>;
   pressed?: boolean;
   icon?: string | boolean;
   confirm?: string | ConfirmConfig;
   parentDisabled?: boolean;
   parentStrict?: boolean;
}

/**
 * Confirmation dialog configuration
 */
export interface ConfirmConfig {
   message: string;
   title?: string;
   yesText?: string;
   noText?: string;
}

/**
 * Widget instance - runtime object created by the framework
 */
export interface WidgetInstance<TData extends WidgetData = WidgetData> {
   widget: Widget;
   data: TData;
   store: View;
   parentStore?: View;
   cached?: {
      rawData?: Record<string, SerializableValue>;
      children?: WidgetInstance[];
      parentDisabled?: boolean;
      parentStrict?: boolean;
      data?: Record<string, SerializableValue>;
      state?: Record<string, SerializableValue>;
      widgetVersion?: string;
      globalCacheIdentifier?: string;
   };
   children?: WidgetInstance[];
   components?: Record<string, WidgetInstance>;
   events?: Record<string, (e: Event) => void>;
   parentOptions?: ParentOptions;

   // Methods
   cache(key: string, value: SerializableValue): boolean;
   markShouldUpdate(context: RenderingContext): void;
   invoke(method: string, ...args: SerializableValue[]): SerializableValue;
   getChild(context: RenderingContext, widget: Widget, key: string, store: View): WidgetInstance;
   scheduleExploreIfVisible(context: RenderingContext): boolean;
}

/**
 * Parent options passed down from overlay/modal components
 *
 * For custom parent options, extend this interface:
 * @example
 * interface MyParentOptions extends ParentOptions {
 *    customOption: string;
 * }
 */
export interface ParentOptions {
   dismiss?: () => void;
}

/**
 * Props object used for rendering (passed to React.createElement)
 *
 * For custom render props, extend this interface or use intersection types:
 * @example
 * interface MyRenderProps extends RenderProps {
 *    'data-custom': string;
 * }
 */
export interface RenderProps {
   // React standard props
   key?: string | number;
   className?: string;
   style?: Record<string, string | number>;
   ref?: (element: HTMLElement | null) => void;
   children?: React.ReactNode;

   // CxJS custom props
   instance?: WidgetInstance;

   // Common HTML attributes
   id?: string;
   disabled?: boolean;
   type?: string;
   value?: string | number | readonly string[];
   checked?: boolean;
   tabIndex?: number;
   title?: string;
   role?: string;

   // Event handlers - allow returning false to prevent default behavior
   onClick?: (e: React.MouseEvent) => void | false;
   onMouseDown?: (e: React.MouseEvent) => void | false;
   onMouseMove?: (e: React.MouseEvent) => void | false;
   onMouseLeave?: (e: React.MouseEvent) => void | false;
   onMouseEnter?: (e: React.MouseEvent) => void | false;
   onKeyDown?: (e: React.KeyboardEvent) => void | false;
   onKeyUp?: (e: React.KeyboardEvent) => void | false;
   onFocus?: (e: React.FocusEvent) => void | false;
   onBlur?: (e: React.FocusEvent) => void | false;
   onChange?: (e: React.ChangeEvent) => void | false;
}

/**
 * Result type for yes/no dialogs
 */
export const enum YesNoResult {
   Yes = "yes",
   No = "no",
}
