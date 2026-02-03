import { Category } from "./model";

export const defaultCategories: Category[] = [
  {
    id: "primary",
    name: "Primary",
    icon: "star",
    variables: [
      { name: "--cx-theme-primary-color", label: "Main primary color", value: "black", type: "color" },
    ],
  },
  {
    id: "accent",
    name: "Accent & Status",
    icon: "info",
    variables: [
      { name: "--cx-theme-accent-color", label: "Accent color for highlights", value: "lightgray", type: "color" },
      { name: "--cx-theme-danger-color", label: "Danger/error color", value: "#d32f2f", type: "color" },
    ],
  },
  {
    id: "text",
    name: "Text Colors",
    icon: "type",
    variables: [
      { name: "--cx-theme-color", label: "Default text color", value: "rgba(0, 0, 0, 0.87)", type: "color" },
    ],
  },
  {
    id: "background",
    name: "Backgrounds",
    icon: "palette",
    variables: [
      { name: "--cx-theme-background-color", label: "Main background color", value: "white", type: "color" },
      { name: "--cx-theme-surface-color", label: "Surface/card background", value: "white", type: "color" },
    ],
  },
  {
    id: "border",
    name: "Borders",
    icon: "square",
    variables: [
      { name: "--cx-theme-border-color", label: "Default border color", value: "lightgray", type: "color" },
      { name: "--cx-theme-border-color-light", label: "Light border color", value: "#e0e0e0", type: "color" },
      { name: "--cx-theme-border-radius", label: "Default border radius", value: "4px", type: "size" },
    ],
  },
  {
    id: "shadows",
    name: "Shadows",
    icon: "circle",
    variables: [
      { name: "--cx-theme-box-shadow", label: "Default box shadow", value: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)", type: "text" },
      { name: "--cx-theme-box-shadow-elevated", label: "Elevated box shadow", value: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)", type: "text" },
      { name: "--cx-theme-focus-box-shadow", label: "Focus ring shadow", value: "0 0 0 2px rgba(0, 0, 0, 0.2)", type: "text" },
    ],
  },
  {
    id: "sizing",
    name: "Sizing",
    icon: "move",
    variables: [
      { name: "--cx-theme-base-size", label: "Base font size", value: "14px", type: "size" },
      { name: "--cx-theme-box-line-height", label: "Box line height", value: "24px", type: "size" },
      { name: "--cx-theme-box-padding", label: "Box padding", value: "5px", type: "size" },
      { name: "--cx-theme-icon-size", label: "Icon size", value: "16px", type: "size" },
    ],
  },
  {
    id: "active-states",
    name: "Active States",
    icon: "mouse-pointer",
    variables: [
      { name: "--cx-theme-active-state-color", label: "Overlay color for hover/press (black for light themes, white for dark)", value: "black", type: "color" },
      { name: "--cx-theme-active-state-hover-amount", label: "Hover overlay opacity", value: "8%", type: "text" },
      { name: "--cx-theme-active-state-pressed-amount", label: "Pressed overlay opacity", value: "12%", type: "text" },
    ],
  },
  {
    id: "buttons",
    name: "Buttons",
    icon: "square",
    variables: [
      { name: "--cx-theme-default-button-background-color", label: "Default button background", value: "color-mix(in srgb, var(--cx-theme-surface-color), var(--cx-theme-active-state-color) 4%)", type: "color" },
      { name: "--cx-theme-default-button-border-color", label: "Default button border color", value: "var(--cx-theme-border-color)", type: "color" },
    ],
  },
  {
    id: "inputs",
    name: "Inputs",
    icon: "type",
    variables: [
      { name: "--cx-theme-input-background-color", label: "Input background", value: "white", type: "color" },
      { name: "--cx-theme-input-border-color", label: "Input border color", value: "lightgray", type: "color" },
    ],
  },
  {
    id: "grid",
    name: "Grid",
    icon: "table",
    variables: [
      { name: "--cx-theme-grid-header-background-color", label: "Grid header background", value: "#fafafa", type: "color" },
      { name: "--cx-theme-grid-header-border-color", label: "Grid header border", value: "lightgray", type: "color" },
      { name: "--cx-theme-grid-data-background-color", label: "Grid data background", value: "white", type: "color" },
      { name: "--cx-theme-grid-data-border-color", label: "Grid data border", value: "#e0e0e0", type: "color" },
    ],
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "calendar",
    variables: [
      { name: "--cx-theme-calendar-background-color", label: "Calendar background", value: "white", type: "color" },
    ],
  },
  {
    id: "transitions",
    name: "Transitions",
    icon: "zap",
    variables: [
      { name: "--cx-theme-transition", label: "Default transition", value: "all 0.2s ease", type: "text" },
    ],
  },
];

export const presets = [
  { id: "dark-blue", text: "Dark Blue (Default)" },
  { id: "light", text: "Light" },
  { id: "dark-gray", text: "Dark Gray" },
  { id: "ocean", text: "Ocean" },
];
