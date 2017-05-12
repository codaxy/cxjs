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
      route: '+/calendar',
      name: 'Calendar',
      content: () => System.import("./calendar")
   }]
}]