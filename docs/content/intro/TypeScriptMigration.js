import { CodeSnippet } from "../../components/CodeSnippet";
import { CodeSplit } from "../../components/CodeSplit";
import { Md } from "../../components/Md";

export const TypeScriptMigration = (
   <cx>
      <Md>
         # TypeScript Migration Guide

         Starting with CxJS 25.x, the core framework has been migrated to TypeScript. This guide covers the patterns
         and best practices for working with TypeScript in CxJS applications, whether you're migrating an existing
         project or starting fresh.

         ## Project Setup

         ### TypeScript Configuration

         Configure your `tsconfig.json` with the following settings for optimal CxJS support:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
{
   "compilerOptions": {
      "jsx": "react-jsx",
      "jsxImportSource": "cx",
      "moduleResolution": "bundler",
      "esModuleInterop": true
   }
}
            `}</CodeSnippet>
         </CodeSplit>

         The key setting is `"jsxImportSource": "cx"`. CxJS now provides its own JSX type definitions
         instead of relying on React's JSX types. This means CxJS-specific attributes like `visible`,
         `controller`, `layout`, and data-binding functions (`bind()`, `expr()`, `tpl()`) are
         properly typed without conflicts with React's typings.

         ### Webpack Configuration

         With TypeScript, you no longer need `babel-loader` or special Babel plugins for CxJS.
         Simply use `ts-loader` to handle TypeScript files:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
{
   test: /\\.(ts|tsx)$/,
   loader: 'ts-loader',
   exclude: /node_modules/
}
            `}</CodeSnippet>
         </CodeSplit>

         ### Without `transform-cx-jsx` Plugin

         Applications should continue to work with the `transform-cx-jsx` plugin enabled. However, if you want to run
         your application without this plugin, the following requirements apply:

         1. All functional components must be wrapped in `createFunctionalComponent` calls
         2. The special JSX prop syntax (`-bind`, `-expr`, `-tpl`) must be converted to function calls
            (`bind()`, `tpl()`, `expr()`) or object form like `&#123;&#123; bind: "prop" &#125;&#125;`,
            `&#123;&#123; tpl: "template" &#125;&#125;`, or `&#123;&#123; expr: "1+1" &#125;&#125;`
         3. All components previously developed in JavaScript must be ported to TypeScript.

         ### Bundle Size Optimization (Optional)

         While not required, you can use `babel-plugin-transform-cx-imports` to minimize bundle size
         by transforming CxJS imports to more specific paths:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
// Install the plugin
npm install babel-plugin-transform-cx-imports --save-dev

// In babel.config.js
{
   plugins: [
      ["transform-cx-imports", { useSrc: true }]
   ]
}
            `}</CodeSnippet>
         </CodeSplit>

         If using this plugin, chain `babel-loader` after `ts-loader`:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
{
   test: /\\.(ts|tsx)$/,
   exclude: /node_modules/,
   use: ['babel-loader', 'ts-loader']
}
            `}</CodeSnippet>
         </CodeSplit>

         ## General Improvements

         ### Typed Controller Methods

         With TypeScript, you can use `getControllerByType` to get a typed controller reference instead of
         using string method names. This provides compile-time safety and IDE autocomplete.

         <CodeSplit>
            <CodeSnippet copy={false}>{`
import { Controller, bind } from "cx/ui";
import { Button, Section } from "cx/widgets";

class PageController extends Controller {
   onSave() {
      // save logic
   }

   onDelete(id: string) {
      // delete logic
   }
}

export default (
   <cx>
      <Section controller={PageController}>
         {/* Type-safe controller method calls */}
         <Button
            onClick={(e, instance) =>
               instance.getControllerByType(PageController).onSave()
            }
         >
            Save
         </Button>
         <Button
            onClick={(e, instance) =>
               instance.getControllerByType(PageController).onDelete("123")
            }
         >
            Delete
         </Button>
      </Section>
   </cx>
);
            `}</CodeSnippet>
         </CodeSplit>

         The `getControllerByType(ControllerClass)` method searches up the widget tree and returns a
         typed controller instance, enabling full autocomplete and compile-time type checking for
         controller methods and their parameters.

         ### Typed RenderingContext

         CxJS uses a `RenderingContext` object to pass information down the widget tree during rendering.
         Different widget families define typed context interfaces that extend `RenderingContext` for
         type-safe access to context properties.

         **Available typed contexts:**

         - `FormRenderingContext` - Form validation context (`parentDisabled`, `parentReadOnly`, `validation`, etc.)
         - `SvgRenderingContext` - SVG layout context (`parentRect`, `inSvg`, `addClipRect`)
         - `ChartRenderingContext` - Chart context extending SVG (`axes`)

         When creating custom widgets that consume these context properties, import and use the typed
         context interface in your method signatures:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
import type { FormRenderingContext } from "cx/widgets";

export class MyFormWidget extends Field<MyFormWidgetConfig> {
   explore(context: FormRenderingContext, instance: Instance) {
      // Type-safe access to form context properties
      if (context.parentDisabled) {
         // handle disabled state
      }
      super.explore(context, instance);
   }
}
            `}</CodeSnippet>
         </CodeSplit>

         ### Typed ContentResolver

         The `ContentResolver` widget now supports type inference for the `onResolve` callback params.
         TypeScript automatically infers the resolved types from your params definition:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
import { ContentResolver } from "cx/widgets";
import { createAccessorModelProxy } from "cx/data";

interface AppModel {
   user: { name: string; age: number };
}

const model = createAccessorModelProxy<AppModel>();

<ContentResolver
   params={{
      name: model.user.name,  // AccessorChain<string>
      age: model.user.age,    // AccessorChain<number>
      limit: 10,              // number literal
   }}
   onResolve={(params) => {
      // TypeScript infers:
      // params.name: string
      // params.age: number
      // params.limit: number
      return <div>{params.name} is {params.age} years old</div>;
   }}
/>
            `}</CodeSnippet>
         </CodeSplit>

         **Type resolution behavior:**

         | Param Type | Resolved Type |
         |------------|---------------|
         | Literal values (`42`, `"text"`) | Preserves type (`number`, `string`) |
         | `AccessorChain&lt;T&gt;` | `T` |
         | `Selector&lt;T&gt;` / `GetSet&lt;T&gt;` | `T` |
         | `bind()` / `tpl()` / `expr()` | `any` (runtime-only) |

         The utility types `ResolveProp&lt;P&gt;` and `ResolveStructuredProp&lt;S&gt;` are exported from `cx/ui`
         if you need to use them in your own generic components.

         ### Expression Helpers

         CxJS provides a set of helper functions for creating type-safe selectors from accessor chains.
         These are useful for boolean props like `visible`, `disabled`, or `readOnly`:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
import { createAccessorModelProxy } from "cx/data";
import { truthy, isEmpty, equal, greaterThan } from "cx/ui";
import { TextField, NumberField, Button } from "cx/widgets";

interface FormModel {
   name: string;
   age: number;
   items: string[];
}

const m = createAccessorModelProxy<FormModel>();

<cx>
   <TextField value={m.name} label="Name" />
   <NumberField value={m.age} label="Age" />

   {/* Show warning if name is empty */}
   <div visible={isEmpty(m.name)} class="warning">
      Name is required
   </div>

   {/* Enable button only if age >= 18 */}
   <Button disabled={lessThan(m.age, 18)}>
      Submit
   </Button>

   {/* Show special message for specific age */}
   <div visible={equal(m.age, 21)}>
      Welcome to adulthood!
   </div>
</cx>
            `}</CodeSnippet>
         </CodeSplit>

         **Available helpers:**

         | Helper | Description |
         |--------|-------------|
         | `truthy(accessor)` | True if value is truthy (`!!x`) |
         | `falsy(accessor)` | True if value is falsy (`!x`) |
         | `isTrue(accessor)` | True if value is strictly `true` |
         | `isFalse(accessor)` | True if value is strictly `false` |
         | `hasValue(accessor)` | True if value is not null/undefined |
         | `isEmpty(accessor)` | True if string/array is empty or null |
         | `isNonEmpty(accessor)` | True if string/array has content |
         | `equal(accessor, value)` | True if `x == value` (loose) |
         | `notEqual(accessor, value)` | True if `x != value` (loose) |
         | `strictEqual(accessor, value)` | True if `x === value` |
         | `strictNotEqual(accessor, value)` | True if `x !== value` |
         | `lessThan(accessor, value)` | True if `x &lt; value` |
         | `lessThanOrEqual(accessor, value)` | True if `x &lt;= value` |
         | `greaterThan(accessor, value)` | True if `x &gt; value` |
         | `greaterThanOrEqual(accessor, value)` | True if `x &gt;= value` |

         These helpers return `Selector&lt;boolean&gt;` which can be used anywhere a boolean binding is expected.

         ### Typed Config Properties

         Several widget config properties now have improved type definitions that provide better
         autocomplete and type checking when using the `type` or `$type` pattern.

         #### Selection

         Grid, PieChart, and BubbleGraph support typed `selection` configs:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
import { Grid } from "cx/widgets";
import { KeySelection } from "cx/ui";

<Grid
   selection={{
      type: KeySelection,
      bind: "selection",
      keyField: "id"  // KeySelection-specific prop, fully typed
   }}
   // ...
/>
            `}</CodeSnippet>
         </CodeSplit>

         Supported selection types: `Selection`, `KeySelection`, `PropertySelection`, `SimpleSelection`.

         #### Chart Axes

         Chart axes support typed configs for different axis types:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
import { Chart } from "cx/charts";
import { NumericAxis, CategoryAxis } from "cx/charts";

<Chart
   axes={{
      x: { type: CategoryAxis, labelAnchor: "end" },
      y: { type: NumericAxis, min: 0, max: 100 }  // NumericAxis-specific props
   }}
>
   {/* chart content */}
</Chart>
            `}</CodeSnippet>
         </CodeSplit>

         Supported axis types: `Axis`, `NumericAxis`, `CategoryAxis`, `TimeAxis`.

         #### Data Adapters

         Grid and List support typed `dataAdapter` configs:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
import { Grid } from "cx/widgets";
import { GroupAdapter } from "cx/ui";

<Grid
   dataAdapter={{
      type: GroupAdapter,
      groupings: [{ key: { bind: "category" } }]  // GroupAdapter-specific props
   }}
   // ...
/>
            `}</CodeSnippet>
         </CodeSplit>

         Supported adapter types: `ArrayAdapter`, `GroupAdapter`, `TreeAdapter`.

         #### Dropdown Options

         Form fields with dropdowns (ColorField, DateTimeField, MonthField, LookupField) accept
         typed `dropdownOptions`:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
import { DateTimeField } from "cx/widgets";

<DateTimeField
   value-bind="date"
   dropdownOptions={{
      placement: "down-right",
      offset: 10,
      touchFriendly: true
   }}
/>
            `}</CodeSnippet>
         </CodeSplit>

         #### Typed Controllers

         The `controller` property accepts multiple forms: a class, a config object with `type`/`$type`,
         an inline config, or a factory function. Because this type is intentionally flexible ("open"),
         TypeScript's generic inference may not catch extra or misspelled properties in config objects.

         Use the `validateConfig` helper to enable strict property checking:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
import { validateConfig } from "cx/util";
import { Controller } from "cx/ui";

interface MyControllerConfig {
   apiEndpoint: string;
   maxRetries: number;
}

class MyController extends Controller {
   declare apiEndpoint: string;
   declare maxRetries: number;

   constructor(config?: MyControllerConfig) {
      super(config);
   }
}

// validateConfig enables strict checking
<Section
   controller={validateConfig({
      type: MyController,
      apiEndpoint: "/api",
      maxRetires: 3,  // Error: 'maxRetires' does not exist (typo)
   })}
/>
            `}</CodeSnippet>
         </CodeSplit>

         The `validateConfig` function is a compile-time helper that returns its input unchanged at runtime.
         It can be used with any config object that follows the `&#123; type: Class, ...props &#125;` pattern.

         ## Authoring Widgets

         Previously, CxJS widgets had to be written in JavaScript with optional
         TypeScript declaration files (`.d.ts`) for typing. With CxJS 25.x, you can now author
         widgets entirely in TypeScript.

         &gt; **Important:** Widget files must use the `/** @jsxImportSource react */` pragma because
         the widget's `render` method uses React JSX.

         ### Complete Widget Example

         Here's a complete example showing all the steps to create a CxJS widget in TypeScript:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
/** @jsxImportSource react */

import { BooleanProp, StringProp, RenderingContext, VDOM } from "cx/ui";
import { HtmlElement, HtmlElementConfig } from "cx/widgets";

// 1. Define the Config interface
export interface MyButtonConfig extends HtmlElementConfig {
   icon?: StringProp;
   pressed?: BooleanProp;
}

// 2. Extend the appropriate generic base class (Instance type argument is optional)
export class MyButton extends HtmlElement<MyButtonConfig> {

   // 3. Use declare for all properties from config/prototype
   declare icon?: string;
   declare pressed?: boolean;
   declare baseClass: string;

   // 4. Declare bindable props in declareData
   declareData(...args) {
      super.declareData(...args, {
         icon: undefined,
         pressed: undefined,
      });
   }

   // 5. Add constructor accepting the config type
   constructor(config?: MyButtonConfig) {
      super(config);
   }

   // 6. Implement render method with React JSX
   render(
      context: RenderingContext,
      instance: Instance,
      key: string
   ): React.ReactNode {
      return (
         <button
            key={key}
            className={this.baseClass}
            onClick={(e) => this.handleClick(e, instance)}
         >
            {this.icon && <span className="icon">{Icon.render(instance.data.icon)}</span>}
            {this.renderChildren(context, instance)}
         </button>
      );
   }
}

// 7. Initialize prototype properties
MyButton.prototype.baseClass = "mybutton";
            `}</CodeSnippet>
         </CodeSplit>

         ### Key Steps

         1. **Add React JSX pragma** - Use `/** @jsxImportSource react */` at the top of widget files
         2. **Define Config interface** - Name it `[WidgetName]Config` and extend the parent's config
         3. **Extend generic base class** - Use `HtmlElement&lt;Config&gt;`, `ContainerBase&lt;Config&gt;`, etc.
         4. **Use `declare` for properties** - Prevents TypeScript from overwriting config/prototype values
         5. **Declare bindable props in `declareData`** - Register props that support data binding
         6. **Add typed constructor** - Accepts the config type for proper type inference
         7. **Implement render method** - Returns React JSX elements

         ### Config Property Types

         Use these types for bindable properties in your Config interface:

         | Type | Usage |
         |------|-------|
         | `StringProp` | Bindable string property |
         | `BooleanProp` | Bindable boolean property |
         | `NumberProp` | Bindable number property |
         | `Prop&lt;T&gt;` | Bindable property of custom type T |
         | `RecordsProp` | Array data (Grid, List) |

         ### Using `declare` for Properties

         &gt; **Important:** Widget properties must use `declare` to avoid being overwritten. Without `declare`,
         TypeScript class fields will override values passed through the config (via `Object.assign` in the
         constructor) or values defined on the prototype.

         <CodeSplit>
            <CodeSnippet copy={false}>{`
// WRONG - these fields will override config values with undefined
export class MyWidget extends HtmlElement<MyWidgetConfig> {
   icon?: string;     // Overwrites config.icon!
   pressed?: boolean; // Overwrites config.pressed!
}

// CORRECT - declare tells TypeScript the field exists without initializing it
export class MyWidget extends HtmlElement<MyWidgetConfig> {
   declare icon?: string;
   declare pressed?: boolean;
   declare baseClass: string; // Non-nullable when defined in prototype
}
            `}</CodeSnippet>
         </CodeSplit>

         ### Base Classes

         CxJS provides generic base classes for creating typed widgets. The second type argument (Instance) is optional:

         | Base Class | Use Case |
         |------------|----------|
         | `HtmlElement&lt;Config&gt;` | Widgets rendering HTML elements |
         | `ContainerBase&lt;Config&gt;` | Widgets containing other widgets |
         | `PureContainerBase&lt;Config&gt;` | Containers without HTML wrapper |
         | `Field&lt;Config&gt;` | Form input widgets |

         ### Custom Instance Types

         When a widget needs custom properties on its instance, create a custom instance interface:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
export interface MyWidgetInstance extends Instance {
   customData: SomeType;
}

export class MyWidget extends HtmlElement<MyWidgetConfig, MyWidgetInstance> {
   initInstance(context: RenderingContext, instance: MyWidgetInstance): void {
      instance.customData = initializeSomething();
      super.initInstance(context, instance);
   }
}
            `}</CodeSnippet>
         </CodeSplit>

         ### Migration Checklist

         When migrating a widget from JavaScript to TypeScript:

         1. Add JSX pragma `/** @jsxImportSource react */` if file contains JSX
         2. Create `[WidgetName]Config` interface extending appropriate parent
         3. Add generic type parameters to base class if needed
         4. Add constructor accepting the config type
         5. Add `declare` statements for all class properties
         6. Add type annotations to all methods
         7. Create custom instance interface if needed
         8. Fix prototype initializations (use `undefined` not `null` where needed)
         9. Declare `baseClass` as non-nullable if defined in prototype
         10. Delete the corresponding `.d.ts` file

         ### File Organization

         After migration, each widget should have:

         - `Widget.tsx` - The implementation with inline types
         - No separate `Widget.d.ts` - Types are in the source file

         Index files (`index.ts`) should re-export all public types:

         <CodeSplit>
            <CodeSnippet copy={false}>{`
export { Button, ButtonConfig } from "./Button";
export { FlexBox, FlexBoxConfig } from "./FlexBox";
            `}</CodeSnippet>
         </CodeSplit>
      </Md>
   </cx>
);
