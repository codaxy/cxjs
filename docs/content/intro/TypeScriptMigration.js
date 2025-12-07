import { Content, Tab } from "cx/widgets";
import { Md } from "../../components/Md";
import { CodeSplit } from "../../components/CodeSplit";
import { CodeSnippet } from "../../components/CodeSnippet";

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

         1. Remove `//@ts-nocheck` directive
         2. Add JSX pragma `/** @jsxImportSource react */` if file contains JSX
         3. Create `[WidgetName]Config` interface extending appropriate parent
         4. Add generic type parameters to base class if needed
         5. Add constructor accepting the config type
         6. Add `declare` statements for all class properties
         7. Add type annotations to all methods
         8. Create custom instance interface if needed
         9. Fix prototype initializations (use `undefined` not `null` where needed)
         10. Declare `baseClass` as non-nullable if defined in prototype
         11. Delete the corresponding `.d.ts` file

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
