let fs = require("fs"),
   renderSCSS = require("./renderSCSS");

module.exports = async function buildSCSS(paths, output) {
   try {
      let result = await renderSCSS(paths);
      fs.writeFileSync(output, result.css);
      console.log("CSS", output, `${(result.css.length / 1024).toFixed(1)} kB`);
   } catch (err) {
      console.log("SCSS compilation error.", err);
   }
};
