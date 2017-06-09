interface Item {
   name: string;
   route?: string;
   content?: () => Promise<any>;
   items?: Item[]
}

let list: Item[] = [{
   name: 'Button',
   route: '+/button',
   content: () => System.import("./general/button")
}, {
   route: '+/grid',
   name: 'Grid',
   content: () => System.import("./general/grids")
}, {
   route: '+/window',
   name: 'Window',
   content: () => System.import("./general/window")
}, {
   route: '+/menu',
   name: 'Menu',
   content: () => System.import("./general/menu")
}, {
   name: 'Misc',
   items: [{
      route: '+/list',
      name: 'List',
      content: () => System.import("./general/list")
   }, {
      route: '+/tab',
      name: 'Tab',
      content: () => System.import("./general/tab")
   }, {
      route: '+/toast',
      name: 'Toast',
      content: () => System.import("./general/toast")
   }, {
      route: '+/flex-row',
      name: 'FlexRow',
      content: () => System.import("./general/flex-row")
   }, {
      route: '+/flex-col',
      name: 'FlexCol',
      content: () => System.import("./general/flex-col")
   }]
}, {
   name: 'Forms',
   items: [{
      route: '+/checkbox',
      name: 'Checkbox',
      content: () => System.import("./forms/checkbox")
   }, {
      route: '+/radio',
      name: 'Radio',
      content: () => System.import("./forms/radio")
   }, {
      route: '+/switch',
      name: 'Switch',
      content: () => System.import("./forms/switch")
   }, {
      route: '+/text-field',
      name: 'TextField',
      content: () => System.import("./forms/text-field")
   }, {
      route: '+/number-field',
      name: 'NumberField',
      content: () => System.import("./forms/number-field")
   }, {
      route: '+/date-field',
      name: 'DateField',
      content: () => System.import("./forms/date-field")
   }, {
      route: '+/calendar',
      name: 'Calendar',
      content: () => System.import("./forms/calendar")
   }, {
      route: '+/month-picker',
      name: 'MonthPicker',
      content: () => System.import("./forms/month-picker")
   }, {
      route: '+/month-field',
      name: 'MonthField',
      content: () => System.import("./forms/month-field")
   }, {
      route: '+/text-area',
      name: 'TextArea',
      content: () => System.import("./forms/text-area")
   }, {
      route: '+/select',
      name: 'Select',
      content: () => System.import("./forms/select")
   }, {
      route: '+/lookup-field',
      name: 'LookupField',
      content: () => System.import("./forms/lookup-field")
   }, {
      route: '+/color-field',
      name: 'ColorField',
      content: () => System.import("./forms/color-field")
   }, {
      route: '+/color-picker',
      name: 'ColorPicker',
      content: () => System.import("./forms/color-picker")
   }, {
      route: '+/slider',
      name: 'Slider',
      content: () => System.import("./forms/slider")
   }, {
      route: '+/date-time-field',
      name: 'DateTimeField',
      content: () => System.import("./forms/date-time-field")
   }]
}, {
   name: 'Charts',
   items: [{
      route: '+/pie-chart',
      name: 'PieChart',
      content: () => System.import("./charts/pie-chart")
   }, {
      route: '+/line-graph',
      name: 'LineGraph',
      content: () => System.import("./charts/line-graph")
   }, {
      route: '+/column-graph',
      name: 'ColumnGraph',
      content: () => System.import("./charts/column-graph")
   }, {
      route: '+/bar-graph',
      name: 'BarGraph',
      content: () => System.import("./charts/bar-graph")
   }, {
      route: '+/scatter-graph',
      name: 'ScatterGraph',
      content: () => System.import("./charts/scatter-graph")
   }, {
      route: '+/range',
      name: 'Range',
      content: () => System.import("./charts/range")
   }]
}];

list.map(section => {
   if (section.items) {
      section.items.sort((a, b) => {
         if (a.name >= b.name)
            return 1;
         else
            return -1
      });
      return section;
   }
});

export default list;