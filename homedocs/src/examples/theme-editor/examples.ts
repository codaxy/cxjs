// Example definitions with category mappings
// Categories: primary, accent, text, background, border, shadows, sizing, buttons, inputs, grid, calendar, transitions

export interface ExampleDef {
  id: string;
  name: string;
  categories: string[];
  component: () => Promise<any>;
}

export const examples: ExampleDef[] = [
  // Buttons
  {
    id: "button",
    name: "Button",
    categories: ["buttons", "primary", "border", "sizing", "shadows", "transitions"],
    component: () => import("../layout/ButtonBasicExample"),
  },

  // Inputs
  {
    id: "text-field",
    name: "TextField",
    categories: ["inputs", "border", "background", "text", "sizing", "transitions"],
    component: () => import("../forms/TextFieldExample"),
  },
  {
    id: "text-area",
    name: "TextArea",
    categories: ["inputs", "border", "background", "sizing"],
    component: () => import("../forms/TextAreaExample"),
  },
  {
    id: "number-field",
    name: "NumberField",
    categories: ["inputs", "border", "sizing"],
    component: () => import("../forms/NumberFieldFormattingExample"),
  },
  {
    id: "checkbox",
    name: "Checkbox",
    categories: ["inputs", "primary", "border", "sizing", "transitions"],
    component: () => import("../forms/CheckboxExample"),
  },
  {
    id: "radio",
    name: "Radio",
    categories: ["inputs", "primary", "border", "sizing", "transitions"],
    component: () => import("../forms/RadioExample"),
  },
  {
    id: "switch",
    name: "Switch",
    categories: ["inputs", "primary", "border", "shadows", "transitions"],
    component: () => import("../forms/SwitchExample"),
  },
  {
    id: "select",
    name: "Select",
    categories: ["inputs", "border", "background", "shadows", "transitions"],
    component: () => import("../forms/SelectExample"),
  },
  {
    id: "lookup-field",
    name: "LookupField",
    categories: ["inputs", "border", "background", "shadows"],
    component: () => import("../forms/LookupFieldExample"),
  },
  {
    id: "slider",
    name: "Slider",
    categories: ["inputs", "primary", "shadows", "transitions"],
    component: () => import("../forms/SliderExample"),
  },
  {
    id: "date-field",
    name: "DateField",
    categories: ["inputs", "calendar", "border", "shadows"],
    component: () => import("../forms/DateFieldExample"),
  },
  {
    id: "calendar",
    name: "Calendar",
    categories: ["calendar", "primary", "border", "background", "shadows"],
    component: () => import("../forms/CalendarDayDataExample"),
  },
  {
    id: "color-field",
    name: "ColorField",
    categories: ["inputs", "border"],
    component: () => import("../forms/ColorFieldExample"),
  },
  {
    id: "color-picker",
    name: "ColorPicker",
    categories: ["inputs", "background", "border"],
    component: () => import("../forms/ColorPickerExample"),
  },

  // Validation / Status
  {
    id: "validation",
    name: "Validation",
    categories: ["inputs", "accent", "border", "text"],
    component: () => import("../forms/ValidationModesExample"),
  },

  // Cards & Panels
  {
    id: "section",
    name: "Section",
    categories: ["background", "shadows", "border", "text"],
    component: () => import("../layout/SectionExample"),
  },
  {
    id: "window",
    name: "Window",
    categories: ["background", "shadows", "border", "text", "primary"],
    component: () => import("../layout/WindowExample"),
  },
  {
    id: "toast",
    name: "Toast",
    categories: ["shadows", "accent", "background", "text"],
    component: () => import("../layout/ToastExample"),
  },
  {
    id: "tooltip",
    name: "Tooltip",
    categories: ["shadows", "background", "text", "border"],
    component: () => import("../layout/TooltipExample"),
  },

  // Tables & Grids
  {
    id: "grid",
    name: "Grid",
    categories: ["grid", "border", "background", "text", "sizing"],
    component: () => import("../tables/GridExample"),
  },

  // Typography
  {
    id: "text",
    name: "Text",
    categories: ["text", "sizing"],
    component: () => import("../layout/TextExample"),
  },
  {
    id: "heading",
    name: "Heading",
    categories: ["text", "sizing"],
    component: () => import("../layout/HeadingExample"),
  },
  {
    id: "link",
    name: "Link",
    categories: ["text", "primary", "transitions"],
    component: () => import("../layout/LinkExample"),
  },

  // Layout / Spacing
  {
    id: "labels-top",
    name: "LabelsTopLayout",
    categories: ["inputs", "sizing", "text", "border"],
    component: () => import("../layout/LabelsTopLayoutExample"),
  },
  {
    id: "labels-left",
    name: "LabelsLeftLayout",
    categories: ["inputs", "sizing", "text", "border"],
    component: () => import("../layout/LabelsLeftLayoutExample"),
  },

  // Charts
  {
    id: "line-chart",
    name: "Line Chart",
    categories: ["primary", "text"],
    component: () => import("../charts/OverviewLineChartExample"),
  },
  {
    id: "pie-chart",
    name: "Pie Chart",
    categories: ["primary", "text"],
    component: () => import("../charts/OverviewPieChartExample"),
  },

  // Tabs / Navigation
  {
    id: "tabs",
    name: "Tabs",
    categories: ["buttons", "primary", "border", "text", "transitions"],
    component: () => import("../layout/TabsExample"),
  },
  {
    id: "menu",
    name: "Menu",
    categories: ["background", "shadows", "border", "text", "transitions"],
    component: () => import("../layout/MenuVerticalExample"),
  },

  // Icons
  {
    id: "icon",
    name: "Icon",
    categories: ["text", "sizing", "primary"],
    component: () => import("../layout/IconExample"),
  },

  // Progress
  {
    id: "progress-bar",
    name: "ProgressBar",
    categories: ["primary", "border", "background", "sizing"],
    component: () => import("../layout/ProgressBarExample"),
  },

  // List
  {
    id: "list",
    name: "List",
    categories: ["background", "inputs", "border", "text", "sizing"],
    component: () => import("../forms/ListExample"),
  },
];
