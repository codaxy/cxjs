interface Item {
   name: string;
   route?: string;
   content?: () => Promise<any>;
   items?: Item[];
}

let list: Item[] = [
   {
      name: "General",
      items: [
         {
            name: "Button",
            route: "+/button/states",
            content: () => import("./general/button/states")
         },
         {
            route: "+/tab/states",
            name: "Tab",
            content: () => import("./general/tab/states")
         },
         {
            route: "+/menu/states",
            name: "Menu",
            content: () => import("./general/menu/states")
         },
         {
            route: "+/list/states",
            name: "List",
            content: () => import("./general/list/states")
         },
         {
            route: "+/window/states",
            name: "Window",
            content: () => import("./general/window/states")
         },
         {
            route: "+/toast/states",
            name: "Toast",
            content: () => import("./general/toast/states")
         },
         {
            route: "+/section/states",
            name: "Section",
            content: () => import("./general/section/states")
         },
         {
            route: "+/progressbar/states",
            name: "ProgressBar",
            content: () => import("./general/progressbar/states")
         }
      ]
   },
   {
      name: "Grid",
      items: [
         {
            name: "Basic",
            route: "+/grid/basic",
            content: () => import("./general/grids/basic")
         },
         {
            name: "Multiple Selection",
            route: "+/grid/multi-select",
            content: () => import("./general/grids/multi-select")
         },
         {
            name: "Grouping",
            route: "+/grid/grouping",
            content: () => import("./general/grids/grouping")
         },
         {
            name: "Dynamic Grouping",
            route: "+/grid/dynamic-grouping",
            content: () => import("./general/grids/dynamic-grouping")
         },
         {
            name: "Row Drag & Drop",
            route: "+/grid/drag-drop",
            content: () => import("./general/grids/drag-drop")
         },
         {
            name: "Filtering",
            route: "+/grid/filtering",
            content: () => import("./general/grids/filtering")
         },
         {
            name: "Row Editing",
            route: "+/grid/row-editing",
            content: () => import("./general/grids/row-editing")
         },
         {
            name: "Cell Editing",
            route: "+/grid/cell-editing",
            content: () => import("./general/grids/cell-editing")
         },
         {
            name: "Form Editing",
            route: "+/grid/form-editing",
            content: () => import("./general/grids/form-editing")
         },
         {
            name: "Row Expanding",
            route: "+/grid/row-expanding",
            content: () => import("./general/grids/row-expanding")
         },
         {
            name: "Header Menu",
            route: "+/grid/header-menu",
            content: () => import("./general/grids/header-menu")
         },
         {
            name: "Tree Grid",
            route: "+/grid/tree-grid",
            content: () => import("./general/grids/tree-grid")
         },
         {
            name: "Complex Header",
            route: "+/grid/complex-header",
            content: () => import("./general/grids/complex-header")
         },
         {
            name: "Buffering",
            route: "+/grid/buffering",
            content: () => import("./general/grids/buffering")
         },
         {
            name: "Dashboard Grid",
            route: "+/grid/dashboard-grid",
            content: () => import("./general/grids/dashboard-grid")
         },
         {
            name: "Misc",
            route: "+/grid/misc",
            content: () => import("./general/grids/misc")
         }
      ]
   },
   {
      name: "Forms",
      items: [
         {
            route: "+/checkbox",
            name: "Checkbox",
            content: () => import("./forms/checkbox/states")
         },
         {
            route: "+/radio",
            name: "Radio",
            content: () => import("./forms/radio/states")
         },
         {
            route: "+/switch",
            name: "Switch",
            content: () => import("./forms/switch/states")
         },
         {
            route: "+/text-field",
            name: "TextField",
            content: () => import("./forms/text-field/states")
         },
         {
            route: "+/number-field",
            name: "NumberField",
            content: () => import("./forms/number-field/states")
         },
         {
            route: "+/date-field",
            name: "DateField",
            content: () => import("./forms/date-field/states")
         },
         {
            route: "+/calendar",
            name: "Calendar",
            content: () => import("./forms/calendar/states")
         },
         {
            route: "+/month-picker",
            name: "MonthPicker",
            content: () => import("./forms/month-picker/states")
         },
         {
            route: "+/month-field",
            name: "MonthField",
            content: () => import("./forms/month-field/states")
         },
         {
            route: "+/text-area",
            name: "TextArea",
            content: () => import("./forms/text-area/states")
         },
         {
            route: "+/select",
            name: "Select",
            content: () => import("./forms/select/states")
         },
         {
            route: "+/lookup-field",
            name: "LookupField",
            content: () => import("./forms/lookup-field/states")
         },
         {
            route: "+/color-field",
            name: "ColorField",
            content: () => import("./forms/color-field/states")
         },
         {
            route: "+/color-picker",
            name: "ColorPicker",
            content: () => import("./forms/color-picker/states")
         },
         {
            route: "+/slider",
            name: "Slider",
            content: () => import("./forms/slider/states")
         },
         {
            route: "+/date-time-field",
            name: "DateTimeField",
            content: () => import("./forms/date-time-field/states")
         }
      ]
   },
   {
      name: "Charts",
      items: [
         {
            route: "+/pie-chart/standard",
            name: "Standard Pie Chart",
            content: () => import("./charts/pie-chart/standard")
         },
         {
            route: "+/pie-chart/multi-level",
            name: "Multi-level Pie Chart",
            content: () => import("./charts/pie-chart/multilevel")
         },
         {
            route: "+/line-graph/standard",
            name: "Line Graph",
            content: () => import("./charts/line-graph/standard")
         },
         {
            route: "+/line-graph/stacked",
            name: "Stacked Line Graph",
            content: () => import("./charts/line-graph/stacked")
         },
         {
            route: "+/column-graph/standard",
            name: "Column Chart",
            content: () => import("./charts/column-graph/standard")
         },
         {
            route: "+/column-graph/timeline",
            name: "Timeline",
            content: () => import("./charts/column-graph/timeline")
         },
         {
            route: "+/column/stacked",
            name: "Stacked Columns",
            content: () => import("./charts/column/stacked")
         },
         {
            route: "+/column/auto-column-width",
            name: "Auto Stacked Columns",
            content: () => import("./charts/column/auto-column-width")
         },
         {
            route: "+/column/customized",
            name: "Customized Columns",
            content: () => import("./charts/column/customized")
         },
         {
            route: "+/column/combination",
            name: "Column Chart + Grid",
            content: () => import("./charts/column/combination")
         },
         {
            route: "+/column/normalized",
            name: "Normalized Columns",
            content: () => import("./charts/column/normalized")
         },
         {
            route: "+/bar-graph/standard",
            name: "Bar Chart",
            content: () => import("./charts/bar-graph/standard")
         },
         {
            route: "+/bar/stacked",
            name: "Stacked Bar Chart",
            content: () => import("./charts/bar/stacked")
         },
         {
            route: "+/bar/bullets",
            name: "Bullet Chart",
            content: () => import("./charts/bar/bullets")
         },
         {
            route: "+/scatter-graph/standard",
            name: "Scatter Chart",
            content: () => import("./charts/scatter-graph/standard")
         },
         {
            route: "+/marker-line/standard",
            name: "Marker Lines",
            content: () => import("./charts/marker-line/standard")
         },
         {
            route: "+/marker/standard",
            name: "Markers",
            content: () => import("./charts/marker/standard")
         },
         {
            route: "+/range/standard",
            name: "Range",
            content: () => import("./charts/range/standard")
         },
      ]
   },
   {
      name: "Layout",
      items: [
         {
            route: "+/flex-row/options",
            name: "FlexRow",
            content: () => import("./general/flex-row/options")
         },
         {
            route: "+/flex-col/options",
            name: "FlexCol",
            content: () => import("./general/flex-col/options")
         }
      ]
   }
];

// export let sorted = list.map(section => {
//    if (section.items) {
//       section.items = [...section.items].sort((a, b) => {
//          if (a.name >= b.name) return 1;
//          else return -1;
//       });
//    }
//
//    return section;
// });

export default list;
