import { getSearchQueryPredicate, getSearchQueryHighlighter } from "./getSearchQueryPredicate";

import assert from "assert";

describe("getSearchQueryPredicate", function () {
   it("blank means allow all", function () {
      var m = getSearchQueryPredicate("");
      assert(m("cx"));
   });

   it("is case insensitive", function () {
      var m = getSearchQueryPredicate("Cx");
      assert(m("cx"));
   });

   it("if multiple words are provided, all must be matched", function () {
      var m = getSearchQueryPredicate("jo smi");
      assert(m("John Smith"));
      assert(!m("John Nash"));
   });

   it("regex special characters are properly escaped", function () {
      var m = getSearchQueryPredicate("*?");
      assert(m("*?"));
   });
});

describe("getSearchQueryHighlighter", function () {
   it("detects search parts", function () {
      var m = getSearchQueryHighlighter("jo smi");
      let items = m("John Smith");
      assert.deepStrictEqual(items, ["", "Jo", "hn ", "Smi", "th"]);
   });

   it.only("detects search parts occuring multiple times", function () {
      var m = getSearchQueryHighlighter("O");
      let items = m("Option 1");
      assert.deepStrictEqual(items, ["", "O", "pti", "o", "n 1"]);
   });
});
