import { Category, VariableType } from "./model";
import {
  ThemeVariables,
  defaultPreset,
  darkBluePreset,
  darkGrayPreset,
  oceanPreset,
  roundingTweaks,
  densityTweaks,
  fontTweaks,
} from "cx-theme-variables";
import homedocsLightPreset from "../../styles/homedocsLight";
import homedocsDarkPreset from "../../styles/homedocsDark";

// Variable metadata - maps ThemeVariables keys to labels, types, and categories
const variableMetadata: Array<{
  key: keyof ThemeVariables;
  label: string;
  type: VariableType;
  category: string;
}> = [
  // Colors
  {
    key: "primaryColor",
    label: "Primary color",
    type: "color",
    category: "colors",
  },
  {
    key: "primaryTextColor",
    label: "Primary text color",
    type: "color",
    category: "colors",
  },
  {
    key: "primaryBorderColor",
    label: "Primary border color",
    type: "text",
    category: "colors",
  },
  {
    key: "accentColor",
    label: "Accent color",
    type: "color",
    category: "colors",
  },
  {
    key: "dangerColor",
    label: "Danger/error color",
    type: "color",
    category: "colors",
  },
  {
    key: "dangerTextColor",
    label: "Danger text color",
    type: "color",
    category: "colors",
  },
  {
    key: "dangerBorderColor",
    label: "Danger border color",
    type: "text",
    category: "colors",
  },
  { key: "textColor", label: "Text color", type: "color", category: "colors" },
  {
    key: "backgroundColor",
    label: "Background color",
    type: "color",
    category: "colors",
  },
  {
    key: "surfaceColor",
    label: "Surface/card color",
    type: "color",
    category: "colors",
  },
  {
    key: "borderColor",
    label: "Border color",
    type: "color",
    category: "colors",
  },

  // Inputs
  {
    key: "inputWidth",
    label: "Width",
    type: "size",
    category: "inputs",
  },
  {
    key: "inputColor",
    label: "Color",
    type: "text",
    category: "inputs",
  },
  {
    key: "inputBackgroundColor",
    label: "Background",
    type: "color",
    category: "inputs",
  },
  {
    key: "inputBorderColor",
    label: "Border color",
    type: "color",
    category: "inputs",
  },
  {
    key: "inputFontSize",
    label: "Font size",
    type: "text",
    category: "inputs",
  },
  {
    key: "inputLineHeight",
    label: "Line height",
    type: "size",
    category: "inputs",
  },
  {
    key: "inputPaddingX",
    label: "Padding X",
    type: "size",
    category: "inputs",
  },
  {
    key: "inputPaddingY",
    label: "Padding Y",
    type: "size",
    category: "inputs",
  },
  // Checks & Switches
  {
    key: "checkboxSize",
    label: "Checkbox/Radio size",
    type: "size",
    category: "checks",
  },
  {
    key: "switchAxisSize",
    label: "Switch axis size",
    type: "size",
    category: "checks",
  },
  {
    key: "switchHandleSize",
    label: "Switch handle size",
    type: "size",
    category: "checks",
  },
  {
    key: "switchWidth",
    label: "Switch width",
    type: "size",
    category: "checks",
  },

  // Buttons
  {
    key: "buttonBackgroundColor",
    label: "Background",
    type: "color",
    category: "buttons",
  },
  {
    key: "buttonBorderColor",
    label: "Border color",
    type: "text",
    category: "buttons",
  },
  {
    key: "buttonFontSize",
    label: "Font size",
    type: "text",
    category: "buttons",
  },
  {
    key: "buttonLineHeight",
    label: "Line height",
    type: "size",
    category: "buttons",
  },
  {
    key: "buttonPaddingX",
    label: "Padding X",
    type: "size",
    category: "buttons",
  },
  {
    key: "buttonPaddingY",
    label: "Padding Y",
    type: "size",
    category: "buttons",
  },
  {
    key: "buttonBorderWidth",
    label: "Border width",
    type: "size",
    category: "buttons",
  },
  {
    key: "buttonFontWeight",
    label: "Font weight",
    type: "text",
    category: "buttons",
  },
  {
    key: "buttonBoxShadow",
    label: "Box shadow",
    type: "text",
    category: "buttons",
  },
  {
    key: "buttonBorderRadius",
    label: "Border radius",
    type: "text",
    category: "buttons",
  },
  {
    key: "buttonHoverBoxShadow",
    label: "Hover box shadow",
    type: "text",
    category: "buttons",
  },
  {
    key: "buttonHoverStateMixColor",
    label: "Hover mix color",
    type: "text",
    category: "buttons",
  },
  {
    key: "buttonHoverStateMixAmount",
    label: "Hover mix amount",
    type: "text",
    category: "buttons",
  },
  {
    key: "buttonActiveStateMixColor",
    label: "Active mix color",
    type: "text",
    category: "buttons",
  },
  {
    key: "buttonActiveStateMixAmount",
    label: "Active mix amount",
    type: "text",
    category: "buttons",
  },

  // Grids
  {
    key: "gridHeaderBackgroundColor",
    label: "Header background",
    type: "text",
    category: "grids",
  },
  {
    key: "gridHeaderFontWeight",
    label: "Header font weight",
    type: "text",
    category: "grids",
  },
  {
    key: "gridDataBackgroundColor",
    label: "Data background",
    type: "color",
    category: "grids",
  },
  {
    key: "gridDataBorderColor",
    label: "Data border",
    type: "color",
    category: "grids",
  },

  // Sizing
  {
    key: "borderRadius",
    label: "Border radius",
    type: "size",
    category: "sizing",
  },
  {
    key: "baseFontSize",
    label: "Base font size",
    type: "size",
    category: "sizing",
  },
  { key: "iconSize", label: "Icon size", type: "size", category: "sizing" },
  {
    key: "fontFamily",
    label: "Font family",
    type: "text",
    category: "sizing",
  },
  {
    key: "fontWeight",
    label: "Font weight",
    type: "text",
    category: "sizing",
  },

  // Effects
  { key: "boxShadow", label: "Box shadow", type: "text", category: "effects" },
  {
    key: "boxShadowElevated",
    label: "Elevated shadow",
    type: "text",
    category: "effects",
  },
  {
    key: "focusBoxShadow",
    label: "Focus ring",
    type: "text",
    category: "effects",
  },
  { key: "transition", label: "Transition", type: "text", category: "effects" },

  // Calendar
  {
    key: "calendarBackgroundColor",
    label: "Background",
    type: "color",
    category: "calendar",
  },
];

const categoryMetadata = [
  { id: "colors", name: "Colors", icon: "palette", group: "Theme" },
  { id: "sizing", name: "Sizing", icon: "move", group: "Theme" },
  { id: "effects", name: "Effects", icon: "zap", group: "Theme" },
  { id: "buttons", name: "Buttons", icon: "square", group: "Components" },
  { id: "inputs", name: "Inputs", icon: "text-cursor-input", group: "Components" },
  { id: "checks", name: "Checks & Switches", icon: "toggle-left", group: "Components" },
  { id: "grids", name: "Grids", icon: "table", group: "Components" },
  { id: "calendar", name: "Calendar", icon: "calendar", group: "Components" },
];

export const categoryGroups = [
  {
    name: "Theme",
    categories: categoryMetadata.filter((c) => c.group === "Theme"),
  },
  {
    name: "Components",
    categories: categoryMetadata.filter((c) => c.group === "Components"),
  },
];

/**
 * Converts a ThemeVariables preset to the Category[] structure used by the theme editor
 */
export function themeToCategories(theme: ThemeVariables): Category[] {
  return categoryMetadata.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    variables: variableMetadata
      .filter((v) => v.category === cat.id)
      .map((v) => ({
        key: v.key,
        label: v.label,
        value: theme[v.key],
        type: v.type,
      })),
  }));
}

/**
 * Converts the Category[] structure back to a ThemeVariables object
 */
export function categoriesToTheme(categories: Category[]): ThemeVariables {
  const theme: Partial<ThemeVariables> = {};
  for (const cat of categories) {
    for (const v of cat.variables) {
      theme[v.key] = v.value;
    }
  }
  return theme as ThemeVariables;
}

export const defaultCategories = themeToCategories(defaultPreset);

export const presets = [
  { id: "default", text: "Default", theme: defaultPreset },
  { id: "docs-light", text: "Docs Light", theme: homedocsLightPreset },
  { id: "docs-dark", text: "Docs Dark", theme: homedocsDarkPreset },
  { id: "darkBlue", text: "Dark Blue", theme: darkBluePreset },
  { id: "darkGray", text: "Dark Gray", theme: darkGrayPreset },
  { id: "ocean", text: "Ocean", theme: oceanPreset },
];

export const roundingOptions = [
  { id: "none", text: "None", tweak: roundingTweaks.none },
  { id: "small", text: "Small", tweak: roundingTweaks.small },
  { id: "medium", text: "Medium", tweak: roundingTweaks.medium },
  { id: "large", text: "Large", tweak: roundingTweaks.large },
];

export const densityOptions = [
  { id: "minimal", text: "Minimal", tweak: densityTweaks.minimal },
  { id: "condensed", text: "Condensed", tweak: densityTweaks.condensed },
  { id: "compact", text: "Compact", tweak: densityTweaks.compact },
  { id: "normal", text: "Normal", tweak: densityTweaks.normal },
  { id: "comfortable", text: "Comfortable", tweak: densityTweaks.comfortable },
  { id: "spacious", text: "Spacious", tweak: densityTweaks.spacious },
];

export const fontOptions = [
  { id: "system", text: "System", tweak: fontTweaks.system, googleFont: null },
  { id: "inter", text: "Inter", tweak: fontTweaks.inter, googleFont: "Inter:wght@400;500;600;700" },
  { id: "roboto", text: "Roboto", tweak: fontTweaks.roboto, googleFont: "Roboto:wght@400;500;700" },
  { id: "openSans", text: "Open Sans", tweak: fontTweaks.openSans, googleFont: "Open+Sans:wght@400;500;600;700" },
  { id: "poppins", text: "Poppins", tweak: fontTweaks.poppins, googleFont: "Poppins:wght@400;500;600;700" },
  { id: "lato", text: "Lato", tweak: fontTweaks.lato, googleFont: "Lato:wght@400;700" },
];
