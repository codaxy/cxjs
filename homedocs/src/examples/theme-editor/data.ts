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
    type: "color",
    category: "colors",
  },
  {
    key: "accentColor",
    label: "Accent color",
    type: "color",
    category: "colors",
  },
  {
    key: "accentTextColor",
    label: "Accent text color",
    type: "color",
    category: "colors",
  },
  {
    key: "warningColor",
    label: "Warning color",
    type: "color",
    category: "colors",
  },
  {
    key: "warningTextColor",
    label: "Warning text color",
    type: "color",
    category: "colors",
  },
  {
    key: "warningBorderColor",
    label: "Warning border color",
    type: "color",
    category: "colors",
  },
  {
    key: "successColor",
    label: "Success color",
    type: "color",
    category: "colors",
  },
  {
    key: "successTextColor",
    label: "Success text color",
    type: "color",
    category: "colors",
  },
  {
    key: "successBorderColor",
    label: "Success border color",
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
    type: "color",
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

  // Labels & Placeholders
  {
    key: "labelPaddingX",
    label: "Label padding X",
    type: "size",
    category: "inputs",
  },
  {
    key: "labelPaddingY",
    label: "Label padding Y",
    type: "size",
    category: "inputs",
  },
  {
    key: "labelFontSize",
    label: "Label font size",
    type: "text",
    category: "inputs",
  },
  {
    key: "labelFontFamily",
    label: "Label font family",
    type: "text",
    category: "inputs",
  },
  {
    key: "labelFontWeight",
    label: "Label font weight",
    type: "text",
    category: "inputs",
  },
  {
    key: "labelLineHeight",
    label: "Label line height",
    type: "text",
    category: "inputs",
  },
  {
    key: "labelColor",
    label: "Label color",
    type: "color",
    category: "inputs",
  },
  {
    key: "placeholderColor",
    label: "Placeholder color",
    type: "color",
    category: "inputs",
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
    type: "color",
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
  {
    key: "inputBorderWidth",
    label: "Border width",
    type: "size",
    category: "inputs",
  },
  {
    key: "inputTagBackgroundColor",
    label: "Tag background",
    type: "color",
    category: "inputs",
  },
  {
    key: "inputTagFontSize",
    label: "Tag font size",
    type: "text",
    category: "inputs",
  },
  {
    key: "inputTagSpacing",
    label: "Tag spacing",
    type: "size",
    category: "inputs",
  },
  {
    key: "inputTagBorderRadius",
    label: "Tag border radius",
    type: "text",
    category: "inputs",
  },
  {
    key: "inputTagBorderWidth",
    label: "Tag border width",
    type: "text",
    category: "inputs",
  },
  {
    key: "inputTagPadding",
    label: "Tag padding",
    type: "text",
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
    key: "buttonColor",
    label: "Color",
    type: "color",
    category: "buttons",
  },
  {
    key: "buttonBorderColor",
    label: "Border color",
    type: "color",
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
    type: "color",
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
    type: "color",
    category: "buttons",
  },
  {
    key: "buttonActiveStateMixAmount",
    label: "Active mix amount",
    type: "text",
    category: "buttons",
  },

  // Lists
  {
    key: "listItemPaddingX",
    label: "Item padding X",
    type: "text",
    category: "lists",
  },
  {
    key: "listItemPaddingY",
    label: "Item padding Y",
    type: "text",
    category: "lists",
  },

  // Grids
  {
    key: "gridBackground",
    label: "Background",
    type: "color",
    category: "grids",
  },
  {
    key: "gridBorderRadius",
    label: "Border radius",
    type: "size",
    category: "grids",
  },
  {
    key: "gridFontSize",
    label: "Font size",
    type: "text",
    category: "grids",
  },
  {
    key: "gridHeaderFontSize",
    label: "Header font size",
    type: "text",
    category: "grids",
  },
  {
    key: "gridHeaderPaddingX",
    label: "Header padding X",
    type: "size",
    category: "grids",
  },
  {
    key: "gridHeaderPaddingY",
    label: "Header padding Y",
    type: "size",
    category: "grids",
  },
  {
    key: "gridHeaderBackgroundColor",
    label: "Header background",
    type: "color",
    category: "grids",
  },
  {
    key: "gridHeaderFontWeight",
    label: "Header font weight",
    type: "text",
    category: "grids",
  },
  {
    key: "gridDataPaddingX",
    label: "Data padding X",
    type: "size",
    category: "grids",
  },
  {
    key: "gridDataPaddingY",
    label: "Data padding Y",
    type: "size",
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
  {
    key: "scrollbarThumbColor",
    label: "Scrollbar thumb",
    type: "color",
    category: "effects",
  },
  {
    key: "scrollbarTrackColor",
    label: "Scrollbar track",
    type: "color",
    category: "effects",
  },
  {
    key: "scrollbarWidth",
    label: "Scrollbar width",
    type: "text",
    category: "effects",
  },

  // Windows
  {
    key: "windowBackgroundColor",
    label: "Background",
    type: "color",
    category: "windows",
  },
  {
    key: "windowBorderColor",
    label: "Border color",
    type: "color",
    category: "windows",
  },
  {
    key: "windowBorderWidth",
    label: "Border width",
    type: "text",
    category: "windows",
  },
  {
    key: "windowColor",
    label: "Text color",
    type: "color",
    category: "windows",
  },
  {
    key: "windowFontSize",
    label: "Font size",
    type: "text",
    category: "windows",
  },
  {
    key: "windowHeaderColor",
    label: "Header color",
    type: "color",
    category: "windows",
  },
  {
    key: "windowHeaderBackgroundColor",
    label: "Header background",
    type: "color",
    category: "windows",
  },
  {
    key: "windowHeaderPadding",
    label: "Header padding",
    type: "text",
    category: "windows",
  },
  {
    key: "windowHeaderMargin",
    label: "Header margin",
    type: "text",
    category: "windows",
  },
  {
    key: "windowHeaderFontSize",
    label: "Header font size",
    type: "text",
    category: "windows",
  },
  {
    key: "windowHeaderFontWeight",
    label: "Header font weight",
    type: "text",
    category: "windows",
  },
  {
    key: "windowHeaderBorderWidth",
    label: "Header border width",
    type: "size",
    category: "windows",
  },
  {
    key: "windowBodyPadding",
    label: "Body padding",
    type: "text",
    category: "windows",
  },
  {
    key: "windowBodyBackgroundColor",
    label: "Body background",
    type: "color",
    category: "windows",
  },
  {
    key: "windowFooterBackgroundColor",
    label: "Footer background",
    type: "color",
    category: "windows",
  },
  {
    key: "windowFooterPadding",
    label: "Footer padding",
    type: "text",
    category: "windows",
  },
  {
    key: "windowFooterMargin",
    label: "Footer margin",
    type: "text",
    category: "windows",
  },
  {
    key: "windowFooterBorderWidth",
    label: "Footer border width",
    type: "size",
    category: "windows",
  },

  // Sections
  {
    key: "sectionBackgroundColor",
    label: "Background",
    type: "color",
    category: "sections",
  },
  {
    key: "sectionBorderColor",
    label: "Border color",
    type: "color",
    category: "sections",
  },
  {
    key: "sectionColor",
    label: "Text color",
    type: "color",
    category: "sections",
  },
  {
    key: "sectionBoxShadow",
    label: "Box shadow",
    type: "text",
    category: "sections",
  },
  {
    key: "sectionBorderWidth",
    label: "Border width",
    type: "size",
    category: "sections",
  },
  {
    key: "sectionBorderRadius",
    label: "Border radius",
    type: "size",
    category: "sections",
  },
  {
    key: "sectionHeaderPadding",
    label: "Header padding",
    type: "text",
    category: "sections",
  },
  {
    key: "sectionHeaderMargin",
    label: "Header margin",
    type: "text",
    category: "sections",
  },
  {
    key: "sectionHeaderBorderWidth",
    label: "Header border width",
    type: "size",
    category: "sections",
  },
  {
    key: "sectionHeaderFontWeight",
    label: "Header font weight",
    type: "text",
    category: "sections",
  },
  {
    key: "sectionBodyPadding",
    label: "Body padding",
    type: "text",
    category: "sections",
  },
  {
    key: "sectionFooterPadding",
    label: "Footer padding",
    type: "text",
    category: "sections",
  },
  {
    key: "sectionFooterMargin",
    label: "Footer margin",
    type: "text",
    category: "sections",
  },
  {
    key: "sectionFooterBorderWidth",
    label: "Footer border width",
    type: "size",
    category: "sections",
  },
  // Menu
  {
    key: "menuItemPaddingX",
    label: "Item padding X",
    type: "size",
    category: "menu",
  },
  {
    key: "menuItemPaddingY",
    label: "Item padding Y",
    type: "size",
    category: "menu",
  },

  // Tooltips
  {
    key: "tooltipBackgroundColor",
    label: "Background",
    type: "color",
    category: "tooltips",
  },
  {
    key: "tooltipBorderColor",
    label: "Border color",
    type: "color",
    category: "tooltips",
  },
  {
    key: "tooltipBorderWidth",
    label: "Border width",
    type: "size",
    category: "tooltips",
  },
  {
    key: "tooltipBorderRadius",
    label: "Border radius",
    type: "text",
    category: "tooltips",
  },
  {
    key: "tooltipArrowSize",
    label: "Arrow size",
    type: "size",
    category: "tooltips",
  },
  {
    key: "tooltipColor",
    label: "Text color",
    type: "color",
    category: "tooltips",
  },
  {
    key: "tooltipFontSize",
    label: "Font size",
    type: "text",
    category: "tooltips",
  },
  {
    key: "tooltipPadding",
    label: "Padding",
    type: "text",
    category: "tooltips",
  },
  {
    key: "tooltipBoxShadow",
    label: "Box shadow",
    type: "text",
    category: "tooltips",
  },

  {
    key: "tooltipErrorBackgroundColor",
    label: "Error background",
    type: "color",
    category: "tooltips",
  },
  {
    key: "tooltipErrorBorderColor",
    label: "Error border color",
    type: "color",
    category: "tooltips",
  },
  {
    key: "tooltipErrorColor",
    label: "Error text color",
    type: "color",
    category: "tooltips",
  },

  // Dropdowns
  {
    key: "dropdownPadding",
    label: "Padding",
    type: "size",
    category: "dropdowns",
  },
  {
    key: "dropdownBorderWidth",
    label: "Border width",
    type: "size",
    category: "dropdowns",
  },
  {
    key: "dropdownArrowSize",
    label: "Arrow size",
    type: "size",
    category: "dropdowns",
  },
  {
    key: "dropdownArrowOffset",
    label: "Arrow offset",
    type: "size",
    category: "dropdowns",
  },
  {
    key: "dropdownArrowShadowColor",
    label: "Arrow shadow color",
    type: "color",
    category: "dropdowns",
  },
  {
    key: "dropdownArrowShadowSize",
    label: "Arrow shadow size",
    type: "size",
    category: "dropdowns",
  },
  {
    key: "dropdownArrowShadowOffset",
    label: "Arrow shadow offset",
    type: "size",
    category: "dropdowns",
  },

  // Toasts
  {
    key: "toastBackgroundColor",
    label: "Background",
    type: "color",
    category: "toasts",
  },
  {
    key: "toastBorderWidth",
    label: "Border width",
    type: "size",
    category: "toasts",
  },
  {
    key: "toastBorderColor",
    label: "Border color",
    type: "color",
    category: "toasts",
  },
  {
    key: "toastBoxShadow",
    label: "Box shadow",
    type: "text",
    category: "toasts",
  },
  {
    key: "toastBorderRadius",
    label: "Border radius",
    type: "size",
    category: "toasts",
  },
  {
    key: "toastPadding",
    label: "Padding",
    type: "size",
    category: "toasts",
  },
  
  // Calendar
  {
    key: "calendarBorderWidth",
    label: "Calendar border width",
    type: "size",
    category: "calendar",
  },
  {
    key: "calendarBackgroundColor",
    label: "Calendar background",
    type: "color",
    category: "calendar",
  },
  {
    key: "calendarPadding",
    label: "Calendar padding",
    type: "size",
    category: "calendar",
  },
  {
    key: "calendarHeaderFontWeight",
    label: "Calendar header font weight",
    type: "text",
    category: "calendar",
  },
  {
    key: "calendarHeaderBackgroundColor",
    label: "Calendar header background",
    type: "color",
    category: "calendar",
  },
  {
    key: "calendarDayPaddingX",
    label: "Calendar day padding X",
    type: "size",
    category: "calendar",
  },
  {
    key: "calendarDayPaddingY",
    label: "Calendar day padding Y",
    type: "size",
    category: "calendar",
  },
  {
    key: "calendarDayLineHeight",
    label: "Calendar day line height",
    type: "size",
    category: "calendar",
  },
  {
    key: "calendarDayFontSize",
    label: "Calendar day font size",
    type: "text",
    category: "calendar",
  },

  // MonthPicker
  {
    key: "monthPickerBackgroundColor",
    label: "MonthPicker background",
    type: "color",
    category: "calendar",
  },
  {
    key: "monthPickerBorderWidth",
    label: "MonthPicker border width",
    type: "text",
    category: "calendar",
  },
  {
    key: "monthPickerWidth",
    label: "MonthPicker width",
    type: "text",
    category: "calendar",
  },
  {
    key: "monthPickerPadding",
    label: "MonthPicker padding",
    type: "text",
    category: "calendar",
  },
  {
    key: "monthPickerFontSize",
    label: "MonthPicker font size",
    type: "text",
    category: "calendar",
  },
  {
    key: "monthPickerCellFontSize",
    label: "MonthPicker cell font size",
    type: "text",
    category: "calendar",
  },
  {
    key: "monthPickerCellPadding",
    label: "MonthPicker cell padding",
    type: "text",
    category: "calendar",
  },
  {
    key: "monthPickerCellLineHeight",
    label: "MonthPicker cell line height",
    type: "text",
    category: "calendar",
  },
  {
    key: "monthPickerQuarterColor",
    label: "MonthPicker quarter color",
    type: "color",
    category: "calendar",
  },
  {
    key: "monthPickerYearFontSize",
    label: "MonthPicker year font size",
    type: "text",
    category: "calendar",
  },
  {
    key: "monthPickerYearFontWeight",
    label: "MonthPicker year font weight",
    type: "text",
    category: "calendar",
  },
  {
    key: "monthPickerYearColor",
    label: "MonthPicker year color",
    type: "color",
    category: "calendar",
  },

  // Sliders & Progress
  {
    key: "sliderAxisColor",
    label: "Track color",
    type: "color",
    category: "sliders",
  },
  {
    key: "sliderAxisSize",
    label: "Track size",
    type: "size",
    category: "sliders",
  },
  {
    key: "sliderRangeColor",
    label: "Range color",
    type: "color",
    category: "sliders",
  },
  {
    key: "sliderHandleColor",
    label: "Handle color",
    type: "color",
    category: "sliders",
  },
  {
    key: "sliderHandleBorderColor",
    label: "Handle border color",
    type: "color",
    category: "sliders",
  },
  {
    key: "sliderHandleBorderWidth",
    label: "Handle border width",
    type: "text",
    category: "sliders",
  },
  {
    key: "sliderHandleSize",
    label: "Handle size",
    type: "size",
    category: "sliders",
  },
  {
    key: "sliderHandleBoxShadow",
    label: "Handle shadow",
    type: "text",
    category: "sliders",
  },
  {
    key: "sliderHandleHoverBoxShadow",
    label: "Handle hover shadow",
    type: "text",
    category: "sliders",
  },
  {
    key: "progressBarHeight",
    label: "Progress bar height",
    type: "size",
    category: "sliders",
  },
  {
    key: "progressBarBackgroundColor",
    label: "Progress bar background",
    type: "color",
    category: "sliders",
  },
  {
    key: "progressBarIndicatorColor",
    label: "Progress bar indicator",
    type: "color",
    category: "sliders",
  },
  {
    key: "progressBarColor",
    label: "Progress bar text",
    type: "color",
    category: "sliders",
  },
  {
    key: "progressBarBorderRadius",
    label: "Progress bar radius",
    type: "text",
    category: "sliders",
  },
];

const categoryMetadata = [
  { id: "colors", name: "Colors", icon: "palette", group: "Theme" },
  { id: "sizing", name: "Sizing", icon: "move", group: "Theme" },
  { id: "effects", name: "Effects", icon: "zap", group: "Theme" },
  { id: "buttons", name: "Buttons", icon: "square", group: "Components" },
  { id: "inputs", name: "Inputs", icon: "text-cursor-input", group: "Components" },
  { id: "checks", name: "Checks & Switches", icon: "toggle-left", group: "Components" },
  { id: "sliders", name: "Sliders & Progress", icon: "sliders-horizontal", group: "Components" },
  { id: "calendar", name: "Calendar", icon: "calendar", group: "Components" },
  { id: "lists", name: "Lists", icon: "list", group: "Components" },
  { id: "grids", name: "Grids", icon: "table", group: "Components" },
  { id: "sections", name: "Sections", icon: "panel-top", group: "Components" },
  { id: "windows", name: "Windows", icon: "app-window", group: "Components" },
  { id: "toasts", name: "Toasts", icon: "bell", group: "Components" },
  { id: "tooltips", name: "Tooltips", icon: "message-circle", group: "Components" },
  { id: "menu", name: "Menu", icon: "menu", group: "Components" },
  { id: "dropdowns", name: "Dropdowns", icon: "drop-down", group: "Components" },
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
  { id: "veryLarge", text: "Very Large", tweak: roundingTweaks.veryLarge },
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
