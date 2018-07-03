const
   build = require('./build'),
   getPathResolver = require('./getPathResolver'),
   resolvePath = getPathResolver(__dirname),
   cxSrc = getPathResolver(resolvePath('../src'));

const entries = [{
   name: 'util',
   options: {
      entry: [cxSrc('util/index.js')]
   },
   output: {}
}, {
   name: 'data',

   options: {
      entry: cxSrc('data/index.js')
   },
   output: {}
}, {
   name: 'ui',
   options: {
      entry: [cxSrc('ui/index.js')]
   },
   output: {}
}, {
   name: 'widgets',
   css: true,
   options: {
      entry: [cxSrc('widgets/index.js'), cxSrc('variables.scss'), cxSrc('widgets/index.scss'), cxSrc('ui/index.scss')]
   },
   output: {}
}, {
   name: 'svg',
   css: true,
   options: {
      entry: [cxSrc('svg/index.js'), cxSrc('variables.scss'), cxSrc('svg/index.scss')]
   },
   output: {}
}, {
   name: 'charts',
   css: true,
   options: {
      entry: [cxSrc('charts/index.js'), cxSrc('variables.scss'), cxSrc('charts/index.scss')]
   },
   output: {}
}, {
   name: 'reset',
   css: true,
   options: {
      entry: [cxSrc('variables.scss'), resolvePath("reset.scss"), cxSrc('global.scss')]
   },
   output: {}
}];

const externalPaths = {
   [cxSrc('./util/')]: '@/util',
   [cxSrc('./data/')]: '@/data',
   [cxSrc('./ui/')]: '@/ui',
   [cxSrc('./widgets')]: '@/widgets',
   [cxSrc('./charts')]: '@/charts',
   [cxSrc('./svg/')]: '@/svg'
};

build(resolvePath('../src'), resolvePath('../dist'), entries, externalPaths);


//cx-redux
build(
   resolvePath('../../cx-redux/src'),
   resolvePath('../../cx-redux/dist'),
   [{
      name: 'index',
      options: {
         entry: [resolvePath('../../cx-redux/src/index.js')]
      },
      output: {}
   }],
   {},
   ['redux', 'cx/data']
);

function buildTheme(themeName) {

   let theme = getPathResolver(resolvePath('../../' + themeName));
   let themeSrc = getPathResolver(theme('src'));

   return build(
      theme('src'),
      theme('dist'),
      [{
         name: 'index',
         options: {
            entry: [themeSrc('index.js')]
         },
         output: {}
      }, {
         name: 'reset',
         css: true,
         options: {
            entry: [themeSrc('variables.scss'), resolvePath("reset.scss"), themeSrc('reset.scss')]
         },
         output: {}
      }, {
         name: 'charts',
         css: true,
         options: {
            entry: [themeSrc('variables.scss'), cxSrc('charts/index.scss')]
         },
         output: {}
      }, {
         name: 'widgets',
         css: true,
         options: {
            entry: [themeSrc('variables.scss'), cxSrc('widgets/index.scss'), cxSrc('ui/index.scss'), themeSrc('widgets.scss')]
         },
         output: {}
      }, {
         name: 'svg',
         css: true,
         options: {
            entry: [themeSrc('variables.scss'), cxSrc('svg/index.scss')]
         },
         output: {}
      }],
      {},
      ['cx/ui', 'cx/widgets']
   )
}

buildTheme("cx-theme-material");
buildTheme("cx-theme-aquamarine");
buildTheme("cx-theme-dark");
buildTheme("cx-theme-frost");

