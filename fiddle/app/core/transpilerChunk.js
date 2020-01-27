import { transform } from "@babel/core/lib/transform";
import env from "@babel/preset-env";
import cx from "babel-plugin-transform-cx-jsx";
import jsx from "babel-plugin-transform-react-jsx";
import fbind from "babel-plugin-transform-function-bind";

export function transpile(code) {
   try {
      var doc = transform(code, {
         presets: [[env, { loose: true }]],
         plugins: [cx, jsx, fbind]
      });
      return doc.code;
   } catch (e) {
      return `/* Error: ${e} */`;
   }
}
