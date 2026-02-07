import { defaultPreset, ThemeVariables } from "cx-theme-variables";

/**
 * Homedocs theme - references Tailwind/shadcn CSS variables
 * so light/dark mode works automatically via the variable cascade.
 */
const homedocsLightPreset: ThemeVariables = {
  ...defaultPreset,

  // Primary colors
  primaryColor: "var(--cx-c-brand)",
  primaryTextColor: "white",
  primaryBorderColor: "transparent",
  accentColor: "hsl(var(--accent))",
  accentTextColor: "hsl(var(--accent-foreground))",
  dangerColor: "hsl(var(--destructive))",
  dangerTextColor: "white",
  dangerBorderColor: "transparent",

  // Text
  textColor: "hsl(var(--foreground))",

  // Backgrounds
  backgroundColor: "hsl(var(--background))",
  surfaceColor: "hsl(var(--card))",

  // Borders
  borderColor: "hsl(var(--border))",

  buttonActiveStateMixColor: "black",
  buttonHoverStateMixAmount: "2%",
  buttonActiveStateMixAmount: "6%",

  // Shadows - no CSS variable available, hardcoded
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  boxShadowElevated: "0 10px 25px rgba(0, 0, 0, 0.15)",
  focusBoxShadow: "0 0 0 2px rgba(39, 170, 225, 0.2)",

  // Sizing
  borderRadius: "6px",
  baseFontSize: "14px",
  iconSize: "16px",

  // Typography
  fontFamily: "'Inter', system-ui, sans-serif",
  fontWeight: "400",

  // Input
  inputWidth: "210px",
  inputColor: "inherit",
  inputBackgroundColor: "hsl(var(--background))",
  inputBorderColor: "hsl(var(--input))",
  inputFontSize: "var(--cx-theme-base-font-size)",
  inputLineHeight: "20px",
  inputPaddingX: "10px",
  inputPaddingY: "8px",
  checkboxSize: "16px",

  // Button
  buttonBackgroundColor: "hsl(var(--secondary))",
  buttonBorderColor: "hsl(var(--border))",
  buttonFontSize: "var(--cx-theme-base-font-size)",
  buttonFontWeight: "inherit",
  buttonLineHeight: "20px",
  buttonPaddingX: "16px",
  buttonPaddingY: "8px",
  buttonBorderWidth: "1px",

  // Switch
  switchAxisSize: "calc(var(--cx-checkbox-size) + 4px)",
  switchHandleSize: "var(--cx-checkbox-size)",
  switchWidth: "calc(var(--cx-checkbox-size) * 2 + 4px)",

  // Grid
  gridBackground: "hsl(var(--background))",
  gridHeaderBackgroundColor: "hsl(var(--muted))",
  gridHeaderFontWeight: "700",
  gridDataBackgroundColor: "none",
  gridDataBorderColor: "hsl(var(--border))",

  // Calendar
  calendarBackgroundColor: "hsl(var(--popover))",

  // Transitions
  transition: "all 0.15s ease",
};

export default homedocsLightPreset;
