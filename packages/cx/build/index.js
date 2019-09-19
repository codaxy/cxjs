const
   build = require('./build'),
   getPathResolver = require('./getPathResolver'),
   resolvePath = getPathResolver(__dirname),
   cxSrc = getPathResolver(resolvePath('../src'));

const entries = [{
   name: 'util',
   options: {
      input: cxSrc('util/index.js')
   },
   output: {}
}, {
   name: 'data',

   options: {
      input: cxSrc('data/index.js')
   },
   output: {}
}, {
   name: 'ui',
   options: {
      input: [cxSrc('ui/index.js')]
   },
   output: {}
}, {
   name: 'widgets',
   css: true,
   options: {
      input: [cxSrc('widgets/index.js'), cxSrc('variables.scss'), cxSrc('widgets/index.scss'), cxSrc('ui/index.scss')]
   },
   output: {}
}, {
   name: 'svg',
   css: true,
   options: {
      input: [cxSrc('svg/index.js'), cxSrc('variables.scss'), cxSrc('svg/index.scss')]
   },
   output: {}
}, {
   name: 'charts',
   css: true,
   options: {
      input: [cxSrc('charts/index.js'), cxSrc('variables.scss'), cxSrc('charts/index.scss')]
   },
   output: {}
}, {
   name: 'reset',
   css: true,
   options: {
      input: [cxSrc('variables.scss'), resolvePath("reset.scss"), cxSrc('global.scss')]
   },
   output: {}
}, {
   name: 'hooks',
   options: {
      input: [cxSrc('hooks/index.js')]
   },
   output: {}
}];

const externalPaths = {
   [cxSrc('./util/')]: 'cx/util',
   [cxSrc('./data/')]: 'cx/data',
   [cxSrc('./ui/')]: 'cx/ui',
   [cxSrc('./widgets')]: 'cx/widgets',
   [cxSrc('./charts')]: 'cx/charts',
   [cxSrc('./svg/')]: 'cx/svg',
   [cxSrc('./hooks/')]: 'cx/hooks'
};

(async function buildAll() {

   console.log("Building cx...");
   await build(resolvePath('../src'), resolvePath('../dist'), entries, externalPaths);

   console.log("Building cx-redux...");
   await build(
      resolvePath('../../cx-redux/src'),
      resolvePath('../../cx-redux/dist'),
      [{
         name: 'index',
         options: {
            input: [resolvePath('../../cx-redux/src/index.js')]
         },
         output: {}
      }],
      null,
      ['redux', 'cx/data']
   );

   function buildTheme(themeName) {
      console.log(`Building ${themeName}...`);
      let theme = getPathResolver(resolvePath('../../' + themeName));
      let themeSrc = getPathResolver(theme('src'));

      return build(
         theme('src'),
         theme('dist'),
         [{
            name: 'index',
            options: {
               input: [themeSrc('index.js')]
            },
            output: {}
         }, {
            name: 'reset',
            css: true,
            options: {
               input: [themeSrc('variables.scss'), resolvePath("reset.scss"), themeSrc('reset.scss')]
            },
            output: {}
         }, {
            name: 'charts',
            css: true,
            options: {
               input: [themeSrc('variables.scss'), cxSrc('charts/index.scss')]
            },
            output: {}
         }, {
            name: 'widgets',
            css: true,
            options: {
               input: [themeSrc('variables.scss'), cxSrc('widgets/index.scss'), cxSrc('ui/index.scss'), themeSrc('widgets.scss')]
            },
            output: {}
         }, {
            name: 'svg',
            css: true,
            options: {
               input: [themeSrc('variables.scss'), cxSrc('svg/index.scss')]
            },
            output: {}
         }],
         null,
         ['cx/ui', 'cx/widgets']
      )
   }

   await buildTheme("cx-theme-material");
   await buildTheme("cx-theme-aquamarine");
   await buildTheme("cx-theme-dark");
   await buildTheme("cx-theme-frost");

})();