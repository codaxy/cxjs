import { computable } from "cx/ui";
import { Button, Tab, TextArea, Window } from "cx/widgets";
import { themeVariablesToCSS } from "cx-theme-variables";

import { m, ThemeEditorModel } from "./model";
import { categoriesToTheme } from "./data";

function getExportText(
  categories: ThemeEditorModel["categories"],
  tab: string,
): string {
  const theme = categoriesToTheme(categories);
  if (tab === "js") {
    return (
      'import { ThemeVarsRoot } from "cx-theme-variables";\n' +
      'import type { ThemeVariables } from "cx-theme-variables";\n\n' +
      "const theme: ThemeVariables = " +
      JSON.stringify(theme, null, 2) +
      ";\n\n" +
      "// Add <ThemeVarsRoot theme={theme} /> to your app"
    );
  }
  return themeVariablesToCSS(theme);
}

export { getExportText };

export const ExportWindow = (
  <Window
    title="Export Theme"
    visible={m.exportVisible}
    center
    modal
    closeOnEscape
    bodyStyle="width: 600px; height: 500px; overflow: hidden"
  >
    <div class="flex flex-col h-full gap-1">
      <div>
        <Tab value={m.exportTab} tab="css" mod="line" default>
          CSS Variables
        </Tab>
        <Tab value={m.exportTab} tab="js" mod="line">
          JS Preset
        </Tab>
      </div>
      <TextArea
        value={computable(m.categories, m.exportTab, (cats, tab) =>
          getExportText(cats, tab || "css"),
        )}
        readOnly
        class="flex-1 w-auto font-mono text-xs resize-none mx-2"
      />
    </div>
    <div putInto="footer" class="flex gap-2 justify-end">
      <Button icon="copy" text="Copy to Clipboard" onClick="copyExport" />
      <Button
        icon="download"
        text="Download"
        onClick="downloadExport"
        mod="primary"
      />
    </div>
  </Window>
);
