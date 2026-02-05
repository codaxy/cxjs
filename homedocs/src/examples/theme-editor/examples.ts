// Example definitions with category mappings
// Categories: colors, inputs, buttons, grids, sizing, effects, calendar

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
    categories: ["colors", "buttons", "sizing", "effects"],
    component: () => import("../layout/ButtonBasicExample"),
  },
  {
    id: "button-mods",
    name: "Button Mods",
    categories: ["colors", "buttons", "sizing", "effects"],
    component: () => import("../layout/ButtonModsExample"),
  },

  // Inputs
  {
    id: "text-field",
    name: "TextField",
    categories: ["colors", "inputs", "sizing", "effects"],
    component: () => import("../forms/TextFieldExample"),
  },
  {
    id: "text-area",
    name: "TextArea",
    categories: ["colors", "inputs", "sizing"],
    component: () => import("../forms/TextAreaExample"),
  },
  {
    id: "number-field",
    name: "NumberField",
    categories: ["colors", "inputs", "sizing"],
    component: () => import("../forms/NumberFieldFormattingExample"),
  },
  {
    id: "checkbox",
    name: "Checkbox",
    categories: ["colors", "inputs", "sizing", "effects"],
    component: () => import("../forms/CheckboxExample"),
  },
  {
    id: "radio",
    name: "Radio",
    categories: ["colors", "inputs", "sizing", "effects"],
    component: () => import("../forms/RadioExample"),
  },
  {
    id: "switch",
    name: "Switch",
    categories: ["colors", "inputs", "effects"],
    component: () => import("../forms/SwitchExample"),
  },
  {
    id: "select",
    name: "Select",
    categories: ["colors", "inputs", "sizing", "effects"],
    component: () => import("../forms/SelectExample"),
  },
  {
    id: "lookup-field",
    name: "LookupField",
    categories: ["colors", "inputs", "sizing", "effects"],
    component: () => import("../forms/LookupFieldExample"),
  },
  {
    id: "slider",
    name: "Slider",
    categories: ["colors", "inputs", "effects"],
    component: () => import("../forms/SliderExample"),
  },
  {
    id: "date-field",
    name: "DateField",
    categories: ["colors", "inputs", "calendar", "sizing", "effects"],
    component: () => import("../forms/DateFieldExample"),
  },
  {
    id: "calendar",
    name: "Calendar",
    categories: ["colors", "calendar", "sizing", "effects"],
    component: () => import("../forms/CalendarDayDataExample"),
  },
  {
    id: "color-field",
    name: "ColorField",
    categories: ["colors", "inputs", "sizing"],
    component: () => import("../forms/ColorFieldExample"),
  },
  {
    id: "color-picker",
    name: "ColorPicker",
    categories: ["colors"],
    component: () => import("../forms/ColorPickerExample"),
  },

  // Validation / Status
  {
    id: "validation",
    name: "Validation",
    categories: ["colors", "inputs"],
    component: () => import("../forms/ValidationModesExample"),
  },

  // Cards & Panels
  {
    id: "section",
    name: "Section",
    categories: ["colors", "sizing", "effects"],
    component: () => import("../layout/SectionExample"),
  },
  {
    id: "window",
    name: "Window",
    categories: ["colors", "buttons", "sizing", "effects"],
    component: () => import("../layout/WindowExample"),
  },
  {
    id: "toast",
    name: "Toast",
    categories: ["colors", "effects"],
    component: () => import("../layout/ToastExample"),
  },
  {
    id: "tooltip",
    name: "Tooltip",
    categories: ["colors", "effects"],
    component: () => import("../layout/TooltipExample"),
  },

  // Tables & Grids
  {
    id: "grid",
    name: "Grid",
    categories: ["colors", "grids", "sizing", "effects"],
    component: () => import("../tables/GridExample"),
  },

  // Typography
  {
    id: "text",
    name: "Text",
    categories: ["colors", "sizing"],
    component: () => import("../layout/TextExample"),
  },
  {
    id: "heading",
    name: "Heading",
    categories: ["colors", "sizing"],
    component: () => import("../layout/HeadingExample"),
  },
  {
    id: "link",
    name: "Link",
    categories: ["colors", "effects"],
    component: () => import("../layout/LinkExample"),
  },

  // Layout / Spacing
  {
    id: "labels-top",
    name: "LabelsTopLayout",
    categories: ["colors", "inputs", "sizing"],
    component: () => import("../layout/LabelsTopLayoutExample"),
  },
  {
    id: "labels-left",
    name: "LabelsLeftLayout",
    categories: ["colors", "inputs", "sizing"],
    component: () => import("../layout/LabelsLeftLayoutExample"),
  },

  // Charts
  {
    id: "line-chart",
    name: "Line Chart",
    categories: ["colors"],
    component: () => import("../charts/OverviewLineChartExample"),
  },
  {
    id: "pie-chart",
    name: "Pie Chart",
    categories: ["colors"],
    component: () => import("../charts/OverviewPieChartExample"),
  },

  // Tabs / Navigation
  {
    id: "tabs",
    name: "Tabs",
    categories: ["colors", "buttons", "sizing", "effects"],
    component: () => import("../layout/TabsExample"),
  },
  {
    id: "menu",
    name: "Menu",
    categories: ["colors", "sizing", "effects"],
    component: () => import("../layout/MenuVerticalExample"),
  },

  // Icons
  {
    id: "icon",
    name: "Icon",
    categories: ["colors", "sizing"],
    component: () => import("../layout/IconExample"),
  },

  // Progress
  {
    id: "progress-bar",
    name: "ProgressBar",
    categories: ["colors", "sizing"],
    component: () => import("../layout/ProgressBarExample"),
  },

  // List
  {
    id: "list",
    name: "List",
    categories: ["colors", "sizing", "effects"],
    component: () => import("../forms/ListExample"),
  },
];
