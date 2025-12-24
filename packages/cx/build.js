const buildJS = require("cx-build-tools/buildJS"),
   buildSCSS = require("cx-build-tools/buildSCSS"),
   copyFiles = require("cx-build-tools/copyFiles"),
   getPathResolver = require("cx-build-tools/getPathResolver"),
   fs = require("fs"),
   resolvePath = getPathResolver(__dirname),
   cxSrc = getPathResolver(resolvePath("./src")),
   cxBuild = getPathResolver(resolvePath("./build"));

const entries = [
   {
      name: "util",
      options: {
         input: cxBuild("util/index.js"),
      },
      output: {},
   },
   {
      name: "data",

      options: {
         input: cxBuild("data/index.js"),
      },
      output: {},
   },
   {
      name: "ui",
      options: {
         input: cxBuild("ui/index.js"),
      },
      output: {},
   },
   {
      name: "widgets",
      options: {
         input: cxBuild("widgets/index.js"),
      },
      output: {},
   },
   {
      name: "svg",
      options: {
         input: cxBuild("svg/index.js"),
      },
      output: {},
   },
   {
      name: "charts",
      options: {
         input: cxBuild("charts/index.js"),
      },
      output: {},
   },
   {
      name: "hooks",
      options: {
         input: cxBuild("hooks/index.js"),
      },
      output: {},
   },
   {
      name: "jsx-runtime",
      options: {
         input: cxBuild("jsx-runtime.js"),
      },
      output: {},
   },
];

const externalPaths = {
   [cxBuild("./util/")]: "cx/util",
   [cxBuild("./data/")]: "cx/data",
   [cxBuild("./ui/")]: "cx/ui",
   [cxBuild("./widgets")]: "cx/widgets",
   [cxBuild("./charts")]: "cx/charts",
   [cxBuild("./svg/")]: "cx/svg",
   [cxBuild("./hooks/")]: "cx/hooks",
   [cxBuild("./jsx-runtime")]: "cx/jsx-runtime",
};

(async function buildAll() {
   console.log("Building cx...");
   try {
      let distPath = resolvePath("./dist");
      if (!fs.existsSync(distPath)) {
         fs.mkdirSync(distPath);
      }

      // // Copy SCSS files from src to build
      // copyFiles(cxSrc("."), cxBuild("."), ".scss");

      await Promise.all([
         buildJS(resolvePath("./src"), resolvePath("./dist"), entries, externalPaths),
         buildSCSS([resolvePath("../cx-build-tools/reset.scss")], resolvePath("./dist/reset.css")),
         buildSCSS(
            [
               cxSrc("variables.scss"),
               resolvePath("../cx-build-tools/divide.scss"),
               cxSrc("widgets/index.scss"),
               cxSrc("ui/index.scss"),
            ],
            resolvePath("./dist/widgets.css"),
         ),
         buildSCSS(
            [cxSrc("variables.scss"), resolvePath("../cx-build-tools/divide.scss"), cxSrc("charts/index.scss")],
            resolvePath("./dist/charts.css"),
         ),
         buildSCSS(
            [cxSrc("variables.scss"), resolvePath("../cx-build-tools/divide.scss"), cxSrc("svg/index.scss")],
            resolvePath("./dist/svg.css"),
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
