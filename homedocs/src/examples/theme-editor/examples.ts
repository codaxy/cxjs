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
    categories: ["colors", "checks", "sizing", "effects"],
    component: () => import("../forms/CheckboxExample"),
  },
  {
    id: "radio",
    name: "Radio",
    categories: ["colors", "checks", "sizing", "effects"],
    component: () => import("../forms/RadioExample"),
  },
  {
    id: "switch",
    name: "Switch",
    categories: ["colors", "checks", "effects"],
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
    categories: ["colors", "inputs", "dropdowns", "sizing", "effects"],
    component: () => import("../forms/LookupFieldExample"),
  },
  {
    id: "lookup-field-query",
    name: "LookupField Query",
    categories: ["colors", "inputs", "dropdowns", "sizing", "effects"],
    component: () => import("../forms/LookupFieldQueryExample"),
  },
  {
    id: "slider",
    name: "Slider",
    categories: ["colors", "sliders", "inputs", "effects"],
    component: () => import("../forms/SliderExample"),
  },
  {
    id: "date-field",
    name: "DateField",
    categories: ["colors", "inputs", "dropdowns", "calendar", "sizing", "effects"],
    component: () => import("../forms/DateFieldExample"),
  },
  {
    id: "calendar",
    name: "Calendar",
    categories: ["colors", "calendar", "sizing", "effects"],
    component: () => import("../forms/CalendarExample"),
  },
  {
    id: "calendar-day-data",
    name: "Calendar Day Data",
    categories: ["colors", "calendar", "sizing", "effects"],
    component: () => import("../forms/CalendarDayDataExample"),
  },
  {
    id: "month-picker",
    name: "MonthPicker",
    categories: ["colors", "calendar", "sizing", "effects"],
    component: () => import("../forms/MonthPickerExample"),
  },
  {
    id: "month-picker-range",
    name: "MonthPicker Range",
    categories: ["colors", "calendar", "sizing", "effects"],
    component: () => import("../forms/MonthPickerRangeExample"),
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
    categories: ["colors", "sections", "sizing", "effects"],
    component: () => import("../layout/SectionExample"),
  },
  {
    id: "section-mods",
    name: "Section Mods",
    categories: ["colors", "sections", "effects"],
    component: () => import("../layout/SectionModsExample"),
  },
  {
    id: "window",
    name: "Window",
    categories: ["colors", "windows", "buttons", "sizing", "effects"],
    component: () => import("../layout/WindowExample"),
  },
  {
    id: "msgbox-alert",
    name: "MsgBox Alert",
    categories: ["colors", "windows", "buttons", "effects"],
    component: () => import("../layout/MsgBoxAlertExample"),
  },
  {
    id: "msgbox-yesno",
    name: "MsgBox Yes/No",
    categories: ["colors", "windows", "buttons", "effects"],
    component: () => import("../layout/MsgBoxYesNoExample"),
  },
  {
    id: "toast",
    name: "Toast",
    categories: ["colors", "toasts", "effects"],
    component: () => import("../layout/ToastExample"),
  },
  {
    id: "toast-mods",
    name: "Toast Mods",
    categories: ["colors", "toasts", "effects"],
    component: () => import("../layout/ToastModsExample"),
  },
  {
    id: "toast-declarative",
    name: "Toast Declarative",
    categories: ["colors", "toasts", "effects"],
    component: () => import("../layout/ToastDeclarativeExample"),
  },
  {
    id: "dropdown-basic",
    name: "Dropdown",
    categories: ["colors", "dropdowns", "effects"],
    component: () => import("../layout/DropdownBasicExample"),
  },
  {
    id: "dropdown-search",
    name: "Dropdown Search",
    categories: ["colors", "dropdowns", "effects"],
    component: () => import("../layout/DropdownSearchExample"),
  },
  {
    id: "tooltip-basic",
    name: "Tooltip Basic",
    categories: ["colors", "tooltips"],
    component: () => import("../layout/TooltipBasicExample"),
  },
  {
    id: "tooltip-interactive",
    name: "Tooltip Interactive",
    categories: ["colors", "tooltips"],
    component: () => import("../layout/TooltipInteractiveExample"),
  },
  {
    id: "tooltip-rich-content",
    name: "Tooltip Rich Content",
    categories: ["colors", "tooltips"],
    component: () => import("../layout/TooltipRichContentExample"),
  },
  {
    id: "tooltip-validation",
    name: "Tooltip Validation",
    categories: ["colors", "tooltips", "inputs"],
    component: () => import("../layout/TooltipValidationExample"),
  },

  // Tables & Grids
  {
    id: "grid",
    name: "Grid",
    categories: ["colors", "grids", "sizing", "effects"],
    component: () => import("../tables/GridExample"),
  },
  {
    id: "grid-cell-editing",
    name: "Cell Editing",
    categories: ["colors", "grids", "inputs", "sizing"],
    component: () => import("../tables/CellEditingExample"),
  },
  {
    id: "grid-grouping",
    name: "Grouping",
    categories: ["colors", "grids", "sizing"],
    component: () => import("../tables/GroupingExample"),
  },
  {
    id: "grid-tree",
    name: "Tree Grid",
    categories: ["colors", "grids", "sizing"],
    component: () => import("../tables/TreeGridExample"),
  },
  {
    id: "grid-complex-headers",
    name: "Complex Headers",
    categories: ["colors", "grids", "sizing"],
    component: () => import("../tables/ComplexHeadersExample"),
  },
  {
    id: "grid-multiple-selection",
    name: "Multiple Selection",
    categories: ["colors", "grids", "sizing", "effects"],
    component: () => import("../tables/MultipleSelectionExample"),
  },
  {
    id: "grid-pagination",
    name: "Pagination",
    categories: ["colors", "grids", "sizing"],
    component: () => import("../tables/PaginationExample"),
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
    categories: ["colors", "menu", "dropdowns", "sizing", "effects"],
    component: () => import("../layout/MenuVerticalExample"),
  },
  {
    id: "menu-horizontal",
    name: "Horizontal Menu",
    categories: ["colors", "menu", "sizing"],
    component: () => import("../layout/MenuHorizontalExample"),
  },
  {
    id: "menu-icons",
    name: "Menu Icons",
    categories: ["colors", "menu", "sizing"],
    component: () => import("../layout/MenuIconsExample"),
  },
  {
    id: "menu-overflow",
    name: "Menu Overflow",
    categories: ["colors", "menu", "sizing"],
    component: () => import("../layout/MenuOverflowExample"),
  },
  {
    id: "context-menu",
    name: "Context Menu",
    categories: ["colors", "menu", "dropdowns", "effects"],
    component: () => import("../layout/ContextMenuExample"),
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
    categories: ["colors", "sliders", "sizing"],
    component: () => import("../layout/ProgressBarExample"),
  },

  // List
  {
    id: "list",
    name: "List",
    categories: ["colors", "lists", "sizing", "effects"],
    component: () => import("../forms/ListExample"),
  },
];
