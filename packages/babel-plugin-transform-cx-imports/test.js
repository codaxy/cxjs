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

   it("imports Cx widgets", function () {

      let code = `import {TextField} from "cx/widgets"`;

      let output = babel.transform(code, {
         plugins: [plugin]
      }).code;

      assert.equal(unwrap(output), 'import { TextField } from "cx-core/src/ui/form/TextField"');
   });

   it("imports scss file if available and option is set", function () {

      let code = `import {TextField} from "cx/widgets"`;

      let output = babel.transform(code, {
         plugins: [[plugin, {scss: true}]]
      }).code;

      assert.deepEqual(lines(output), [
         'import { TextField } from "cx-core/src/ui/form/TextField";',
         'import "cx-core/src/ui/form/TextField.scss"'
      ]);
   });
});
