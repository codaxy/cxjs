import jsx from "@babel/plugin-transform-react-jsx";
import fbind from "@babel/plugin-proposal-function-bind";

import { transform } from "@babel/core";
import * as env from "@babel/preset-env";
import * as cx from "babel-plugin-transform-cx-jsx";

export function transpile(code) {
   try {
      var doc = transform(code, {
         presets: [[env, { loose: true }]],
         plugins: [cx, jsx, fbind],
      });
      return doc.code;
   } catch (e) {
      return `/* Error: ${e.message} \n ${e.stack} */`;
   }
}
