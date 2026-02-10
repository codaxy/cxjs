import {
  computable,
  createFunctionalComponent,
  PrivateStore,
  ContentResolver,
  Prop,
} from "cx/ui";
import { Repeater } from "cx/widgets";
import { ThemeVarsDiv, ThemeVarsRoot } from "cx-theme-variables";
import { m } from "./model";
import { examples, ExampleDef } from "./examples";
import { categoriesToTheme, fontOptions } from "./data";

// Dynamic example content using ContentResolver
const ExampleContent = createFunctionalComponent(
  ({ example }: { example: Prop<ExampleDef> }) => (
    <ContentResolver
      params={{ example }}
      onResolve={async ({ example }) => {
        const module = await example.component();
        return <PrivateStore>{module.default}</PrivateStore>;
      }}
    />
  ),
);

// Filter examples by category
function getExamplesForCategory(category: string): ExampleDef[] {
  return examples.filter((e) => e.categories.includes(category));
}

// Get Google Font URL for the selected font
function getGoogleFontUrl(fontId: string | null): string | undefined {
  if (!fontId) return undefined;
  // website default font doesn't have to be loaded
  if (fontId == "inter") return undefined;
  const font = fontOptions.find((f) => f.id === fontId);
  return font?.googleFont
    ? `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`
    : undefined;
}

export const Preview = createFunctionalComponent(() => (
  <ThemeVarsDiv
    theme={computable(m.categories, categoriesToTheme)}
    cssSelector=".theme-editor-variables"
    class="flex-1 p-6 overflow-y-auto border-r border-border"
    applyReset
  >
    <ThemeVarsRoot
      theme={computable(m.categories, categoriesToTheme)}
      cssSelector=".theme-editor-variables"
    />
    <link
      href={computable(m.font, getGoogleFontUrl)}
      rel="stylesheet"
      visible={computable(m.font, (f) => !!getGoogleFontUrl(f))}
    />
    <Repeater
      records={computable(m.activeCategory, (category) =>
        getExamplesForCategory(category),
      )}
      recordAlias={m.$example}
      keyField="id"
    >
      <div class="mb-6 max-w-150 mx-auto">
        <h4
          class="text-sm font-medium text-muted-foreground mb-3"
          text={m.$example.name}
        />
        <div
          class="border border-border rounded-lg p-4 overflow-x-auto"
          style={{
            backgroundColor: "var(--cx-theme-surface-color)",
            borderColor: "var(--cx-theme-border-color)",
          }}
        >
          <ExampleContent example={m.$example} />
        </div>
      </div>
    </Repeater>
  </ThemeVarsDiv>
));
