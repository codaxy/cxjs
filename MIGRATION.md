# CxJS TypeScript Migration Guide

This document captures patterns and best practices learned during the migration from JavaScript to TypeScript.

## Table of Contents

1. [Config Interfaces](#config-interfaces)
2. [Instance Types](#instance-types)
3. [Generic Base Classes](#generic-base-classes)
4. [Property Declarations](#property-declarations)
5. [Prototype Property Initialization](#prototype-property-initialization)
6. [Type Casting Patterns](#type-casting-patterns)
7. [Component Props and State](#component-props-and-state)
8. [Common Fixes](#common-fixes)
9. [JSX Components](#jsx-components)
10.   [Class Constructors](#class-constructors)

---

## Config Interfaces

Every widget should have a Config interface that extends the appropriate parent config:

```typescript
export interface ButtonConfig extends HtmlElementConfig {
   confirm?: Prop<string | Record<string, unknown>>;
   pressed?: BooleanProp;
   icon?: StringProp;
   disabled?: BooleanProp;
   onClick?: string | ((e: MouseEvent, instance: Instance) => void);
}

export class Button extends HtmlElement<ButtonConfig, HtmlElementInstance> {
   // ...
}
```

### Config Naming Convention

- Use `{WidgetName}Config` for the interface name
- Extend the parent widget's config (e.g., `HtmlElementConfig`, `PureContainerConfig`, `ContainerConfig`)

### Property Types in Config

- Use `Prop<T>` for bindable properties that accept values, bindings, or selectors
- Use `StringProp`, `BooleanProp`, `NumberProp` for common typed props
- Use `BindingInput<T>` when the property is specifically used with `Binding.get()`
- Use literal union types for constrained string values (e.g., `"start" | "center" | "end"`)

---

## Instance Types

### Creating Custom Instance Types

When a widget needs custom properties on its instance (like a specialized store), create a custom instance interface:

```typescript
export interface SandboxInstance extends Instance {
   store: ExposedValueView;
}

export class Sandbox extends PureContainerBase<SandboxConfig, SandboxInstance> {
   initInstance(context: RenderingContext, instance: SandboxInstance): void {
      instance.store = new ExposedValueView({
         /* ... */
      });
   }
}
```

### Standard Instance Types

- `Instance` - Base instance type for most widgets
- `HtmlElementInstance` - For HTML-based widgets, includes `tooltips` property
- Custom interfaces extending `Instance` for specialized needs

### TooltipParentInstance Pattern

Widgets that support tooltips should use `HtmlElementInstance` which implements:

```typescript
export interface TooltipParentInstance extends Instance {
   tooltips: { [key: string]: TooltipInstance };
}
```

---

## Generic Base Classes

### Using Generic vs Non-Generic Base Classes

CxJS provides both generic and non-generic versions of base classes:

| Non-Generic     | Generic                                           |
| --------------- | ------------------------------------------------- |
| `Container`     | `ContainerBase<Config, Instance>`                 |
| `PureContainer` | `PureContainerBase<Config, Instance>`             |
| `HtmlElement`   | `HtmlElement<Config, Instance>` (already generic) |

**Use the generic Base version when creating typed widgets:**

```typescript
// Correct - using generic base
export class FlexBox extends ContainerBase<FlexBoxConfig, Instance> {}

// Incorrect - Container is not generic
export class FlexBox extends Container<FlexBoxConfig, Instance> {} // Error!
```

---

## Property Declarations

### Using `declare` for Class Properties

Use `declare` to inform TypeScript about properties that exist at runtime but aren't initialized in the class body:

```typescript
export class FlexBox extends ContainerBase<FlexBoxConfig, Instance> {
   declare spacing?: string | boolean;
   declare hspacing?: boolean | string;
   declare wrap?: boolean;
   declare baseClass: string; // Non-nullable when defined in prototype
}
```

### When to Use `declare`

- Properties initialized via prototype assignment
- Properties set by the framework during initialization
- Properties from config that are copied to the instance

### Non-Nullable vs Optional

```typescript
// Optional - may or may not be set
declare spacing?: string;

// Non-nullable - always defined (e.g., in prototype)
declare baseClass: string;
```

---

## Prototype Property Initialization

### Using `undefined` Instead of `null`

When TypeScript types don't include `null`, use `undefined` for prototype initialization:

```typescript
// Type doesn't allow null
buttonMod?: string;

// Incorrect - type error
MsgBox.prototype.buttonMod = null;

// Correct
MsgBox.prototype.buttonMod = undefined;
```

### Non-Nullable Prototype Properties

When a property is always defined in the prototype, declare it as non-nullable:

```typescript
export class Section extends ContainerBase<SectionConfig, Instance> {
   declare baseClass: string; // Not optional - defined in prototype
}

Section.prototype.baseClass = "section";
```

---

## Type Casting Patterns

### Accessing Properties Not in Instance Type

When accessing properties that exist at runtime but aren't in the type:

```typescript
// Use type assertion
prepareData(context: RenderingContext, instance: Instance): void {
   let { eventHandlers } = (instance as any);
   // ...
}
```

### Config Object Casting for Constructors

When a constructor uses `Object.assign` but the config type is limited:

```typescript
// First, create a proper config interface
export interface ExposedValueViewConfig extends ViewConfig {
   containerBinding?: Binding;
   key?: string | null;
   recordName?: string;
}

// Then the constructor accepts the extended config
instance.store = new ExposedValueView({
   store: instance.parentStore,
   containerBinding: this.storageBinding,
   key: null,
   recordName: this.recordName,
});
```

---

## Component Props and State

### React Component Props Interface

For VDOM components, create typed props and state interfaces:

```typescript
interface ResizerCmpProps {
   instance: Instance;
   data: Record<string, any>; // Use Record for dynamic data properties
}

interface ResizerCmpState {
   dragged: boolean;
   offset: number;
   initialPosition?: { clientX: number; clientY: number };
}

class ResizerCmp extends VDOM.Component<ResizerCmpProps, ResizerCmpState> {
   // ...
}
```

### Using `Record<string, any>` for Data

When component data has dynamically declared properties (via `declareData`), use `Record<string, any>`:

```typescript
interface MyComponentProps {
   instance: Instance;
   data: Record<string, any>; // Allows accessing any property
}
```

---

## Common Fixes

### 1. "Type 'X' is not generic"

**Problem:** Using non-generic base class with type parameters.

**Fix:** Use the generic `Base` version:

```typescript
// Wrong
class MyWidget extends Container<MyConfig, Instance> {}

// Correct
class MyWidget extends ContainerBase<MyConfig, Instance> {}
```

### 2. "Property does not exist on type 'Instance'"

**Problem:** Accessing custom instance properties.

**Fix:** Create custom instance interface or use type assertion:

```typescript
// Option 1: Custom interface
interface MyInstance extends Instance {
   customProp: string;
}

// Option 2: Type assertion
(instance as any).customProp;
```

### 3. "Object literal may only specify known properties"

**Problem:** Passing extra properties to a constructor.

**Fix:** Extend the config interface:

```typescript
export interface ExtendedConfig extends BaseConfig {
   extraProp?: string;
}
```

### 4. "'X' is possibly 'undefined'"

**Problem:** Accessing potentially undefined properties.

**Fix:** Use optional chaining or non-null assertion:

```typescript
// Optional chaining
if (components?.header) {
   /* ... */
}

// Or declare as non-nullable if always defined
declare;
baseClass: string;
```

### 5. Method Signature Mismatches

**Problem:** Overridden methods have incompatible signatures.

**Fix:** Match parameter types with parent class or use compatible subtypes:

```typescript
// Parent uses Instance, child can use more specific type
prepareData(context: RenderingContext, instance: HtmlElementInstance): void {
   super.prepareData(context, instance);
}
```

---

## JSX Components

### Adding the JSX Pragma

For components that render JSX in their `render` method, add the JSX pragma at the top of the file:

```typescript
/** @jsxImportSource react */

import { BoundedObject, BoundedObjectConfig } from "../svg/BoundedObject";
// ... rest of imports
```

This tells TypeScript/Babel to use React's JSX factory for transforming JSX syntax.

### When to Add the Pragma

- Any `.tsx` file that contains JSX syntax (e.g., `<g>`, `<div>`, `<rect>`)
- Files with `render()` methods that return JSX elements
- Files that use VDOM components

---

## Class Constructors

### Always Add a Constructor

Every widget class should have an explicit constructor that accepts the config type:

```typescript
export class MyWidget extends BoundedObject<MyWidgetConfig, MyWidgetInstance> {
   constructor(config?: MyWidgetConfig) {
      super(config);
   }

   // ... rest of the class
}
```

### Why Add Constructors

- Provides proper type inference when creating widgets
- Ensures config properties are correctly typed
- Makes the class API explicit and self-documenting

---

## Migration Checklist

When migrating a widget from JS to TS:

1. [ ] Remove `//@ts-nocheck` directive
2. [ ] Add JSX pragma `/** @jsxImportSource react */` if file contains JSX
3. [ ] Create `{WidgetName}Config` interface extending appropriate parent
4. [ ] Add generic type parameters to base class if needed
5. [ ] Add constructor accepting the config type
6. [ ] Add `declare` statements for all class properties
7. [ ] Add type annotations to all methods
8. [ ] Create custom instance interface if needed
9. [ ] Fix prototype initializations (use `undefined` not `null` where needed)
10. [ ] Declare `baseClass` as non-nullable if defined in prototype
11. [ ] Verify with `yarn check-types` in packages/cx
12. [ ] Delete the corresponding `.d.ts` file

---

## File Organization

After migration, each widget should have:

- `Widget.tsx` - The implementation with inline types
- No separate `Widget.d.ts` - Types are in the source file

Index files (`index.ts`) should re-export all public types:

```typescript
export { Button, ButtonConfig } from "./Button";
export { FlexBox, FlexBoxConfig } from "./FlexBox";
```

## Nice to Have Improvements

[ ] Typed RenderingContext usage
[ ] Better StructuredProp and typed ContentResolver
[ ] dropdownOptions might typed as DropdownConfig?
[ ] Properly type Component.create, Widget.create, etc.

## Finalization

[ ] Check online .d.ts files for all widgets at the end
[ ] Migrate gallery
[ ] Migrate all docs examples to typescript
[ ] Figure out a fiddle replacement (with AI :)
[ ] Write detailed documentation and migration paths
[ ] Migrate some of the libraries (Google Maps, Diagrams)
