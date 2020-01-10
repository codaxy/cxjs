const
   getPathResolver = require("cx-build-tools/getPathResolver"),
   resolvePath = getPathResolver(__dirname),
   cxSrc = getPathResolver(resolvePath("../cx/src")),
   build = require('./build');

module.exports = function buildTheme(path) {
   let theme = getPathResolver(resolvePath(path));
   let themeSrc = getPathResolver(theme("src"));

   return build(
      theme("src"),
      theme("dist"),
      [
         // {
         //    name: "index",
         //    options: {
         //       input: [themeSrc("index.js")]
         //    },
         //    output: {}
         // },
         // {
         //    name: "reset",
         //    css: true,
         //    options: {
         //       input: [
         //          themeSrc("variables.scss"),
         //          resolvePath("reset.scss"),
         //          themeSrc("reset.scss")
         //       ]
         //    },
         //    output: {}
         // },
         // {
         //    name: "charts",
         //    css: true,
         //    options: {
         //       input: [
         //          themeSrc("variables.scss"),
         //          cxSrc("charts/index.scss")
         //       ]
         //    },
         //    output: {}
         // },
         // {
         //    name: "widgets",
         //    css: true,
         //    options: {
         //       input: [
         //          themeSrc("variables.scss"),
         //          cxSrc("variables.scss"),
         //          cxSrc("widgets/index.scss"),
         //          //cxSrc("ui/index.scss"),
         //          //themeSrc("widgets.scss")
         //       ]
         //    },
         //    output: {}
         // },
         {
            name: "svg",
            css: true,
            options: {
               input: [themeSrc("variables.scss"), cxSrc("variables.scss"), cxSrc("svg/index.scss")]
            },
            output: {}
         }
      ],
      null,
      ["cx/ui", "cx/widgets"]
   );
}