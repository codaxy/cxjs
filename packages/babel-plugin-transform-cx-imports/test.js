"use strict";

var babel  = require("babel-core"),
   plugin = require("./index"),
   assert = require('assert');

function unwrap(code) {
   return code.substring(0, code.length - 1);
   //return code.substring(15, code.length-1);
}

function lines(code) {
   return unwrap(code).split('\n');
}

describe('babel-plugin-transform-cx-imports', function() {

   it("skips non-cx import", function () {

      let code = `import _ from "lodash"`;

      let output = babel.transform(code, {
         plugins: [plugin]
      }).code;

      assert.equal(unwrap(output), 'import _ from "lodash"');
   });

   it("supports multiple imports", function () {

      let code = `import { Widget, VDOM } from "cx/ui"`;

      let output = babel.transform(code, {
         plugins: [plugin]
      }).code;

      assert.equal(unwrap(output), 'import { Widget, VDOM } from "cx/ui"');
   });

   it("imports Cx widgets from source", function () {

      let code = `import {TextField} from "cx/widgets"`;

      let output = babel.transform(code, {
         plugins: [[plugin, { useSrc: true }]]
      }).code;

      assert.equal(unwrap(output), 'import { TextField } from "cx/src/widgets/form/TextField.js"');
   });

   it("imports scss file if available and option is set", function () {

      let code = `import {TextField} from "cx/widgets"`;

      let output = babel.transform(code, {
         plugins: [[plugin, { useSrc: true, scss: true }]]
      }).code;

      assert.deepEqual(lines(output), [
         'import { TextField } from "cx/src/widgets/form/TextField.js";',
         'import "cx/src/widgets/form/TextField.scss"'
      ]);
   });

   it("imports multiple things from source", function () {

      let code = `import { Text, TextField } from "cx/widgets"`;

      let output = babel.transform(code, {
         plugins: [[plugin, { useSrc: true }]]
      }).code;

      assert.deepEqual(lines(output), [
         'import { Text } from "cx/src/ui/Text.js";',
         'import { TextField } from "cx/src/widgets/form/TextField.js"'
      ]);
   });
});
