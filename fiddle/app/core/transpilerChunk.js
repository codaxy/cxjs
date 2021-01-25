import { transform } from "@babel/standalone";
//import env from "@babel/preset-env";
import * as cx from "babel-plugin-transform-cx-jsx";
import * as jsx from "@babel/plugin-transform-react-jsx";
import * as fbind from "@babel/plugin-proposal-function-bind";
import * as modules from "@babel/plugin-transform-modules-commonjs";

// const { transform } = require("@babel/standalone"),
//    cx = require("babel-plugin-transform-cx-jsx"),
//    jsx = require("@babel/plugin-transform-react-jsx"),
//    fbind = require("@babel/plugin-proposal-function-bind");

export function transpile(code) {
   console.log(modules);
   try {
      var doc = transform(code, {
         //presets: [[env, { loose: true }]],
         plugins: [cx, fbind],
      });
      return doc.code;
   } catch (e) {
      return `/* Error: ${e.message} \n ${e.stack} */`;
   }
}
