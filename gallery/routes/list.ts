export default [{
   name: 'General',
   items: [{
      route: '+/button',
      name: 'Button',
      content: () => System.import("./button")
   }, {
      route: '+/grid',
      name: 'Grid',
      content: () => System.import("./grids")
   }]
}, {
   name: 'Forms',
   items: [{
      route: '+/checkbox',
      name: 'Checkbox',
      content: () => System.import("./checkbox")
   }, {
      route: '+/text-field',
      name: 'TextField',
      content: () => System.import("./text-field")
   }, {
      route: '+/number-field',
      name: 'NumberField',
      content: () => System.import("./number-field")
   }, {
      route: '+/date-field',
      name: 'DateField',
      content: () => System.import("./date-field")
   }, {
      route: '+/calendar',
      name: 'Calendar',
      content: () => System.import("./calendar")
   }, {
      route: '+/switch',
      name: 'Switch',
      content: () => System.import("./switch")
   }, {
      route: '+/radio',
      name: 'Radio',
      content: () => System.import("./radio")
   }]
}]