import { createModel } from "cx/data";
import type { ExampleDef } from "./examples";

export type VariableType = "color" | "size" | "padding" | "border" | "text";

export interface ThemeVariable {
  name: string;
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
  categories: Category[];
  $category: Category;
  $variable: ThemeVariable;
  $example: ExampleDef;
}

export const m = createModel<ThemeEditorModel>();
