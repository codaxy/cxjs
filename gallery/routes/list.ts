let list = [{
   name: 'General',
   items: [{
      route: '+/button',
      name: 'Button',
      content: () => System.import("./general/button")
   }, {
      route: '+/grid',
      name: 'Grid',
      content: () => System.import("./general/grids")
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
   }]
}];

list.map(section => {
   section.items.sort((a,b) => {
      if(a.name >= b.name)
         return 1;
      else
         return -1
   });
   return section;
});

export default list;