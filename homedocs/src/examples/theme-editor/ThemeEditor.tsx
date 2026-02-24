import { Controller } from "cx/ui";
import { Button, enableTooltips, LookupField } from "cx/widgets";

import "../../icons/lucide";
import { m, ThemeEditorModel } from "./model";
import {
  categoriesToTheme,
  presets,
  roundingOptions,
  densityOptions,
  fontOptions,
  themeToCategories,
} from "./data";
import { Sidebar } from "./Sidebar";
import { VariableEditor } from "./VariableEditor";
import { Preview } from "./Preview";
import { ExportWindow, getExportText } from "./ExportWindow";

enableTooltips();

class ThemeEditorController extends Controller<ThemeEditorModel> {
  onInit() {
    const saved = this.loadState();
    if (saved) this.store.init(saved);
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

    this.addTrigger(
      "save-state",
      [m.presetName, m.rounding, m.density, m.font, m.activeCategory],
      (presetName, rounding, density, font, activeCategory) => {
        this.saveState({ presetName, rounding, density, font, activeCategory });
      },
    );
  }

  loadState() {
    try {
      const json = localStorage.getItem("cx-theme-editor");
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  }

  saveState(state: Record<string, string>) {
    try {
      localStorage.setItem("cx-theme-editor", JSON.stringify(state));
    } catch {}
  }

  openExport() {
    this.store.set(m.exportVisible, true);
  }

  copyExport() {
    const categories = this.store.get(m.categories);
    const tab = this.store.get(m.exportTab) || "css";
    const text = getExportText(categories, tab);
    navigator.clipboard.writeText(text);
  }

  downloadExport() {
    const categories = this.store.get(m.categories);
    const tab = this.store.get(m.exportTab) || "css";
    const text = getExportText(categories, tab);
    const ext = tab === "js" ? "ts" : "css";
    const filename = `theme.${ext}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
    class="flex flex-col h-full bg-background text-foreground overflow-hidden"
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

        <span class="text-sm text-muted-foreground">Density:</span>
        <LookupField
          value={m.density}
          options={densityOptions}
          placeholder="Use default"
          style="width: 140px;"
        />

        <span class="text-sm text-muted-foreground">Rounding:</span>
        <LookupField
          value={m.rounding}
          options={roundingOptions}
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
        <Button
          icon="download"
          text="Export"
          onClick="openExport"
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

    {ExportWindow}
  </div>
);
