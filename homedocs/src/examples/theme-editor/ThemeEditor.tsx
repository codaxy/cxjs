import { Controller } from "cx/ui";
import { Button, LookupField } from "cx/widgets";

import "../../icons/lucide";
import { m, ThemeEditorModel } from "./model";
import { defaultCategories, presets } from "./data";
import { Sidebar } from "./Sidebar";
import { VariableEditor } from "./VariableEditor";
import { Preview } from "./Preview";

class ThemeEditorController extends Controller<ThemeEditorModel> {
  onInit() {
    this.store.init(m.categories, defaultCategories);
    this.store.init(m.activeCategory, "primary");
    this.store.init(m.presetName, "dark-blue");
  }

  copyToClipboard() {
    const categories = this.store.get(m.categories);
    let css = ":root {\n";
    for (const cat of categories) {
      for (const v of cat.variables) {
        css += `  ${v.name}: ${v.value};\n`;
      }
    }
    css += "}\n";
    navigator.clipboard.writeText(css);
  }

  reset() {
    this.store.set(m.categories, defaultCategories);
  }
}

export default (
  <div
    class="flex flex-col h-full bg-background text-foreground"
    controller={ThemeEditorController}
  >
    {/* Top Bar */}
    <div class="border-b border-border bg-card">
      <div class="container mx-auto flex items-center gap-4 px-4 py-3">
        <span class="text-sm text-muted-foreground">Preset:</span>
        <LookupField value={m.presetName} options={presets} style="width: 180px;" />
        <div class="flex-1" />
        <Button icon="refresh" text="Reset" onClick="reset" mod="hollow" />
        <Button icon="download" text="Download" mod="hollow" />
        <Button icon="copy" text="Copy to Clipboard" onClick="copyToClipboard" mod="primary" />
      </div>
    </div>

    {/* Main Content */}
    <div class="flex-1 overflow-hidden">
      <div class="container mx-auto flex h-full">
        <Sidebar />
        <VariableEditor />
        <Preview />
      </div>
    </div>
  </div>
);
