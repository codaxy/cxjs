import {
  computable,
  createFunctionalComponent,
  PrivateStore,
  ContentResolver,
  Prop,
} from "cx/ui";
import { Repeater } from "cx/widgets";
import { Category, m } from "./model";
import { examples, ExampleDef } from "./examples";

// Dynamic example content using ContentResolver
const ExampleContent = createFunctionalComponent(
  ({ example }: { example: Prop<ExampleDef> }) => (
    <ContentResolver
      params={{ example }}
      onResolve={async ({ example }) => {
        const module = await example.component();
        return (
          <PrivateStore>
            {module.default}
          </PrivateStore>
        );
      }}
    />
  ),
);

// Filter examples by category
function getExamplesForCategory(category: string): ExampleDef[] {
  return examples.filter((e) => e.categories.includes(category));
}

// Build CSS variables style object from categories
function buildCssVariables(categories: Category[]): Record<string, string> {
  const style: Record<string, string> = {};
  for (const cat of categories) {
    for (const v of cat.variables) {
      style[v.name] = v.value;
    }
  }
  return style;
}

export const Preview = createFunctionalComponent(() => (
  <div
    class="flex-1 p-6 overflow-y-auto bg-background border-x border-border"
    style={computable(m.categories, buildCssVariables)}
  >
    <Repeater
      records={computable(m.activeCategory, (category) =>
        getExamplesForCategory(category),
      )}
      recordAlias={m.$example}
      keyField="id"
    >
      <div class="mb-6 max-w-[600px] mx-auto">
        <h4
          class="text-sm font-medium text-muted-foreground mb-3"
          text={m.$example.name}
        />
        <div class="bg-card border border-border rounded-lg p-4 overflow-x-auto">
          <ExampleContent example={m.$example} />
        </div>
      </div>
    </Repeater>
  </div>
));
