interface Item {
   name: string;
   route?: string;
   content?: () => Promise<any>;
   items?: Item[]
}

let list: Item[] = [{
   route: '+/grid',
   name: 'Grid',
   content: () => import("./general/grids")
}, {
   route: '+/window',
   name: 'Window',
   content: () => import("./general/window")
}, {
   route: '+/menu',
   name: 'Menu',
   content: () => import("./general/menu")
}, {
   name: 'Misc',
   items: [{
      name: 'Button',
      route: '+/button',
      content: () => import("./general/button")
   }, {
      route: '+/list',
      name: 'List',
      content: () => import("./general/list")
   }, {
      route: '+/tab',
      name: 'Tab',
      content: () => import("./general/tab")
   }, {
      route: '+/toast',
      name: 'Toast',
      content: () => import("./general/toast")
   }, {
      route: '+/flex-row',
      name: 'FlexRow',
      content: () => import("./general/flex-row")
   }, {
      route: '+/flex-col',
      name: 'FlexCol',
      content: () => import("./general/flex-col")
   }, {
      route: '+/section',
      name: 'Section',
      content: () => import("./general/section")
   }, {
      route: '+/progressbar',
      name: 'ProgressBar',
      content: () => import("./general/progressbar")
   }]
}, {
   name: 'Forms',
   items: [{
      route: '+/checkbox',
      name: 'Checkbox',
      content: () => import("./forms/checkbox")
   }, {
      route: '+/radio',
      name: 'Radio',
      content: () => import("./forms/radio")
   }, {
      route: '+/switch',
      name: 'Switch',
      content: () => import("./forms/switch")
   }, {
      route: '+/text-field',
      name: 'TextField',
      content: () => import("./forms/text-field")
   }, {
      route: '+/number-field',
      name: 'NumberField',
      content: () => import("./forms/number-field")
   }, {
      route: '+/date-field',
      name: 'DateField',
      content: () => import("./forms/date-field")
   }, {
      route: '+/calendar',
      name: 'Calendar',
      content: () => import("./forms/calendar")
   }, {
      route: '+/month-picker',
      name: 'MonthPicker',
      content: () => import("./forms/month-picker")
   }, {
      route: '+/month-field',
      name: 'MonthField',
      content: () => import("./forms/month-field")
   }, {
      route: '+/text-area',
      name: 'TextArea',
      content: () => import("./forms/text-area")
   }, {
      route: '+/select',
      name: 'Select',
      content: () => import("./forms/select")
   }, {
      route: '+/lookup-field',
      name: 'LookupField',
      content: () => import("./forms/lookup-field")
   }, {
      route: '+/color-field',
      name: 'ColorField',
      content: () => import("./forms/color-field")
   }, {
      route: '+/color-picker',
      name: 'ColorPicker',
      content: () => import("./forms/color-picker")
   }, {
      route: '+/slider',
      name: 'Slider',
      content: () => import("./forms/slider")
   }, {
      route: '+/date-time-field',
      name: 'DateTimeField',
      content: () => import("./forms/date-time-field")
   }]
}, {
   name: 'Charts',
   items: [{
      route: '+/pie-chart',
      name: 'PieChart',
      content: () => import("./charts/pie-chart")
   }, {
      route: '+/line-graph',
      name: 'LineGraph',
      content: () => import("./charts/line-graph")
   }, {
      route: '+/column-graph',
      name: 'ColumnGraph',
      content: () => import("./charts/column-graph")
   }, {
      route: '+/bar-graph',
      name: 'BarGraph',
      content: () => import("./charts/bar-graph")
   }, {
      route: '+/scatter-graph',
      name: 'ScatterGraph',
      content: () => import("./charts/scatter-graph")
   }, {
      route: '+/range',
      name: 'Range',
      content: () => import("./charts/range")
   }, {
      route: '+/column/',
      name: 'Column',
      content: () => import("./charts/column")
   }, {
      route: '+/bar/',
      name: 'Bar',
      content: () => import("./charts/bar")
   }, {
      route: '+/marker-line',
      name: 'MarkerLine',
      content: () => import("./charts/marker-line")
   }, {
      route: '+/marker/',
      name: 'Marker',
      content: () => import("./charts/marker")
   }]
}];

export let sorted = list.map(section => {
   if (section.items) {
      section.items =  [...section.items].sort((a,b) => {
          if(a.name >= b.name)
             return 1;
          else
             return -1
      });
   }
   
   return section;
});

export default list;