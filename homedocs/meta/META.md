# AI Agent Instructions

Guidelines for AI agents working on the CxJS documentation project.

## Project Context

- Documentation website for CxJS (TypeScript rewrite)
- Built with Astro
- Reference docs: https://github.com/codaxy/cxjs/tree/master/docs/content

## Code Rules

### TypeScript Only

- All code examples must use TypeScript
- Avoid JavaScript

### JSX Syntax (Breaking Change)

- React JSX and CxJS JSX are now separated
- The `<cx>` wrapper tag can be omitted in examples

### Bindings (Breaking Change)

Binding attributes (`-bind`, `-tpl`, `-expr`) are deprecated without plugins.

Use typed accessor chains and helper functions:

- `m.field` - Direct accessor for two-way binding
- `bind(m.field, defaultValue)` - Accessor with default value (written to store if undefined)
- `expr(m.field1, m.field2, (v1, v2) => ...)` - Computed value from multiple accessors
- `tpl(m.field, "Template {0}")` - Formatted template string
- `format(m.field, "n;2")` - Formatted value

Example:
```tsx
// Direct binding - use when no default needed
<TextField value={m.name} />

// With default value - use bind()
<TextField value={bind(m.name, "Default")} />

// Computed value - use expr()
<div text={expr(m.firstName, m.lastName, (f, l) => `${f} ${l}`)} />
```

### File Naming

- Documentation pages and example files should match component names (singular, not plural)
- Use kebab-case for `.mdx` files matching the navigation slug
- Examples: `line-graph.mdx` (not `line-graphs.mdx`), `LineGraphExample.tsx`

## Content Guidelines

- Avoid "Next Steps" sections - the site has next/previous navigation buttons
- Avoid excessive headings where content is low - use sentences instead
- Prefer using `CodeExample` component to show code with a live preview
- Avoid headings (`<h1>`-`<h6>`) inside code examples - use bold text instead to avoid messing up document layout
- Configuration tables should always go last on documentation pages

### ImportPath Component

Use `ImportPath` immediately below page titles to show the import statement. It includes copy-to-clipboard functionality.

```mdx
import ImportPath from "../../components/ImportPath.astro";

# ComponentName

<ImportPath path="import { ComponentName } from 'cx/widgets';" />
```

### CodeExample Component

Use `CodeExample` to display code alongside a running example. This is more meaningful for users than static code blocks.

```mdx
import CodeExample from "../../components/CodeExample.astro";
import MyExample from "../../examples/MyExample.tsx";
import MyExampleCode from "../../examples/MyExample.tsx?raw";

<CodeExample code={MyExampleCode}>
  <MyExample client:load />
</CodeExample>
```

### Section Markers

Use comments in the source code to split it into tabs (Model, Components, Controller, Index):

- `@model` / `@model-end` - For model interfaces and proxy definitions
- `@components` / `@components-end` - For functional components and layouts
- `@controller` / `@controller-end` - For controller classes
- `@index` / `@index-end` - For the main export

```tsx
// @model
interface PageModel {
  name: string;
}
const m = createModel<PageModel>();
// @model-end

// @components
const MyComponent = createFunctionalComponent(({ ... }) => (
  <div>...</div>
));
// @components-end

// @controller
class PageController extends Controller {
  onInit() { ... }
}
// @controller-end

// @index
export default () => (
  <div>...</div>
);
// @index-end
```

The `@index` section is shown by default. If no section markers are present, the entire file is displayed.

## Workflow

- Refer to PLAN.md for tasks and priorities
- Keep this file tidy and well-organized

### Component Documentation

When working on a component page:

1. **Read existing docs** - Check `docs/content/` for existing documentation on the component
2. **Read source code** - Read the component's TypeScript source in `packages/cx/src/` to understand all config props
3. **Create examples** - Build CodeExample files with typed models and section markers
4. **Add configuration table** - Document all relevant props with types and descriptions
