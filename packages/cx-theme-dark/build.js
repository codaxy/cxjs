const getPathResolver = require("cx-build-tools/getPathResolver"),
   resolvePath = getPathResolver(__dirname),
   buildJS = require("cx-build-tools/buildJS"),
   buildSCSS = require("cx-build-tools/buildSCSS");

let theme = getPathResolver(resolvePath(__dirname));
let themeSrc = getPathResolver(theme("src"));
let themeBuild = getPathResolver(theme("build"));

async function build() {
   try {
      console.log("Building theme...");
      return Promise.all([
         buildJS(
            theme("src"),
            theme("dist"),
            [
               {
                  name: "index",
                  options: {
                     input: [themeBuild("index.js")]
                  },
                  output: {}
               }
            ],
            null,
            ["cx/ui", "cx/widgets"]
         ),
         buildSCSS(
            [themeSrc("reset.scss")],
            theme("dist/reset.css")
         ),
         buildSCSS(
            [themeSrc("widgets.scss")],
            theme("dist/widgets.css")
         ),
         buildSCSS(
            [themeSrc("charts.scss")],
            theme("dist/charts.css")
         ),
         buildSCSS(
            [themeSrc("svg.scss")],
            theme("dist/svg.css")
         )
      ]);
   } catch (err) {
      console.error(err);
   }
}

build();
