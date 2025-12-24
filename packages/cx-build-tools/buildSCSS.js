let fs = require("fs"),
   path = require("path"),
   renderSCSS = require("./renderSCSS");

module.exports = async function buildSCSS(paths, output) {
   try {
      let result = await renderSCSS(paths);
      let dir = path.dirname(output);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(output, result.css);
      console.log("CSS", output, `${(result.css.length / 1024).toFixed(1)} kB`);
   } catch (err) {
      console.log("SCSS compilation error.", err);
   }
};
