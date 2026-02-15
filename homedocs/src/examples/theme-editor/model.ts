import { createModel } from "cx/data";
import type { ExampleDef } from "./examples";
import type { ThemeVariables } from "cx-theme-variables";

export type VariableType = "color" | "size" | "padding" | "border" | "text";

export interface ThemeVariable {
  key: keyof ThemeVariables;
  label: string;
  value: string;
  type: VariableType;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  variables: ThemeVariable[];
}

export interface ThemeEditorModel {
  activeCategory: string;
  presetName: string;
  rounding: string;
  density: string;
  font: string;
  categories: Category[];
  exportVisible: boolean;
  exportTab: string;
  $category: Category;
  $variable: ThemeVariable;
  $example: ExampleDef;
}

export const m = createModel<ThemeEditorModel>();
