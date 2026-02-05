import { Controller } from "cx/ui";
import { Button, LookupField } from "cx/widgets";

import "../../icons/lucide";
import { m, ThemeEditorModel } from "./model";
import {
  presets,
  roundingOptions,
  densityOptions,
  fontOptions,
  themeToCategories,
} from "./data";
import { Sidebar } from "./Sidebar";
import { VariableEditor } from "./VariableEditor";
import { Preview } from "./Preview";

class ThemeEditorController extends Controller<ThemeEditorModel> {
  onInit() {
    this.store.init(m.activeCategory, "colors");
    this.store.init(m.presetName, "default");

    this.addTrigger(
      "theme-change",
      [m.presetName, m.rounding, m.density, m.font],
      (presetName, rounding, density, font) => {
        const preset = presets.find((p) => p.id === presetName);
        const roundingTweak = rounding
          ? roundingOptions.find((r) => r.id === rounding)
          : null;
        const densityTweak = density
          ? densityOptions.find((d) => d.id === density)
          : null;
        const fontTweak = font ? fontOptions.find((f) => f.id === font) : null;
        if (preset) {
          const theme = {
            ...preset.theme,
            ...roundingTweak?.tweak,
            ...densityTweak?.tweak,
            ...fontTweak?.tweak,
          };
          this.store.set(m.categories, themeToCategories(theme));
        }
      },
      true,
    );
  }

  copyToClipboard() {
    const categories = this.store.get(m.categories);
    let css = ":root {\n";
    for (const cat of categories) {
      for (const v of cat.variables) {
        css += `  ${v.key}: ${v.value};\n`;
      }
    }
    css += "}\n";
    navigator.clipboard.writeText(css);
  }

  reset() {
    const presetName = this.store.get(m.presetName);
    const rounding = this.store.get(m.rounding);
    const density = this.store.get(m.density);
    const font = this.store.get(m.font);
    const preset = presets.find((p) => p.id === presetName);
    const roundingTweak = rounding
      ? roundingOptions.find((r) => r.id === rounding)
      : null;
    const densityTweak = density
      ? densityOptions.find((d) => d.id === density)
      : null;
    const fontTweak = font ? fontOptions.find((f) => f.id === font) : null;
    if (preset) {
      const theme = {
        ...preset.theme,
        ...roundingTweak?.tweak,
        ...densityTweak?.tweak,
        ...fontTweak?.tweak,
      };
      this.store.set(m.categories, themeToCategories(theme));
    }
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
        <LookupField
          value={m.presetName}
          options={presets}
          required
          style="width: 140px;"
        />
        <span class="text-sm text-muted-foreground">Rounding:</span>
        <LookupField
          value={m.rounding}
          options={roundingOptions}
          placeholder="Use default"
          style="width: 140px;"
        />
        <span class="text-sm text-muted-foreground">Density:</span>
        <LookupField
          value={m.density}
          options={densityOptions}
          placeholder="Use default"
          style="width: 140px;"
        />
        <span class="text-sm text-muted-foreground">Font:</span>
        <LookupField
          value={m.font}
          options={fontOptions}
          placeholder="Use default"
          style="width: 140px;"
        />
        <div class="flex-1" />
        <Button icon="refresh" text="Reset" onClick="reset" mod="hollow" />
        <Button icon="download" text="Download" mod="hollow" />
        <Button
          icon="copy"
          text="Copy to Clipboard"
          onClick="copyToClipboard"
          mod="primary"
        />
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
