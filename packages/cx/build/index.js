const buildJS = require("cx-build-tools/buildJS"),
   buildSCSS = require("cx-build-tools/buildSCSS"),
   getPathResolver = require("cx-build-tools/getPathResolver"),
   fs = require("fs"),
   resolvePath = getPathResolver(__dirname),
   cxSrc = getPathResolver(resolvePath("../src"));

const entries = [
   {
      name: "util",
      options: {
         input: cxSrc("util/index.js"),
      },
      output: {},
   },
   {
      name: "data",

      options: {
         input: cxSrc("data/index.js"),
      },
      output: {},
   },
   {
      name: "ui",
      options: {
         input: cxSrc("ui/index.js"),
      },
      output: {},
   },
   {
      name: "widgets",
      options: {
         input: cxSrc("widgets/index.js"),
      },
      output: {},
   },
   {
      name: "svg",
      options: {
         input: cxSrc("svg/index.js"),
      },
      output: {},
   },
   {
      name: "charts",
      options: {
         input: cxSrc("charts/index.js"),
      },
      output: {},
   },
   {
      name: "hooks",
      options: {
         input: cxSrc("hooks/index.js"),
      },
      output: {},
   },
];

const externalPaths = {
   [cxSrc("./util/")]: "cx/util",
   [cxSrc("./data/")]: "cx/data",
   [cxSrc("./ui/")]: "cx/ui",
   [cxSrc("./widgets")]: "cx/widgets",
   [cxSrc("./charts")]: "cx/charts",
   [cxSrc("./svg/")]: "cx/svg",
   [cxSrc("./hooks/")]: "cx/hooks",
};

(async function buildAll() {
   console.log("Building cx...");
   try {
      let distPath = resolvePath("../dist");
      if (!fs.existsSync(distPath)) {
         fs.mkdirSync(distPath);
      }

      await Promise.all([
         buildJS(resolvePath("../src"), resolvePath("../dist"), entries, externalPaths),
         buildSCSS([resolvePath("../../cx-build-tools/reset.scss")], resolvePath("../dist/reset.css")),
         buildSCSS(
            [
               cxSrc("variables.scss"),
               resolvePath("../../cx-build-tools/divide.scss"),
               cxSrc("widgets/index.scss"),
               cxSrc("ui/index.scss"),
            ],
            resolvePath("../dist/widgets.css")
         ),
         buildSCSS(
            [cxSrc("variables.scss"), resolvePath("../../cx-build-tools/divide.scss"), cxSrc("charts/index.scss")],
            resolvePath("../dist/charts.css")
         ),
         buildSCSS(
            [cxSrc("variables.scss"), resolvePath("../../cx-build-tools/divide.scss"), cxSrc("svg/index.scss")],
            resolvePath("../dist/svg.css")
         ),
      ]);
   } catch (err) {
      console.log("Build error.", err);
   }

   // console.log("Building cx-redux...");
   // await build(
   //    resolvePath("../../cx-redux/src"),
   //    resolvePath("../../cx-redux/dist"),
   //    [
   //       {
   //          name: "index",
   //          options: {
   //             input: [resolvePath("../../cx-redux/src/index.js")]
   //          },
   //          output: {}
   //       }
   //    ],
   //    null,
   //    ["redux", "cx/data"]
   // );
})();
