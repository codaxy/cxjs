const getPathResolver = require("cx-build-tools/getPathResolver"),
   resolvePath = getPathResolver(__dirname),
   cxSrc = getPathResolver(resolvePath("../cx/src")),
   buildJS = require("./buildJS"),
   buildSCSS = require("./buildSCSS");

module.exports = function buildTheme(path) {
   let theme = getPathResolver(resolvePath(path));
   let themeSrc = getPathResolver(theme("src"));

   return Promise.all([
      buildJS(
         theme("src"),
         theme("dist"),
         [
            {
               name: "index",
               options: {
                  input: [themeSrc("index.js")]
               },
               output: {}
            }
         ],
         null,
         ["cx/ui", "cx/widgets"]
      ),
      buildSCSS(
         [
            themeSrc("variables.scss"),
            resolvePath("reset.scss")
            //themeSrc("reset.scss")
         ],
         theme("dist/reset.css")
      ),
      buildSCSS(
         [
            themeSrc("variables.scss"),
            cxSrc("variables.scss"),
            cxSrc("widgets/index.scss"),
            cxSrc("ui/index.scss")
            //themeSrc("widgets.scss")
         ],
         theme("dist/widgets.css")
      ),
      buildSCSS(
         [
            themeSrc("variables.scss"),
            cxSrc("variables.scss"),
            cxSrc("charts/index.scss")
            //themeSrc("charts.scss")
         ],
         theme("dist/charts.css")
      ),
      buildSCSS(
         [
            themeSrc("variables.scss"),
            cxSrc("variables.scss"),
            cxSrc("svg/index.scss")
            //themeSrc("svg.scss")
         ],
         theme("dist/svg.css")
      )
   ]);
};
