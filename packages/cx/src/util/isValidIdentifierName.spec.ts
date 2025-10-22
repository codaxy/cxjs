import { isValidIdentifierName } from "./isValidIdentifierName";
import assert from "assert";

describe("isValidIdentifierName", function () {
   it("names starting with a number are not valid", function () {
      assert(!isValidIdentifierName("1a"));
      assert(!isValidIdentifierName("00"));
      assert(!isValidIdentifierName("0_abc"));
   });

   it("names starting with a dollar sign are valid", function () {
      assert(isValidIdentifierName("$a"));
      assert(isValidIdentifierName("$"));
   });

   it("names starting with an underscore are valid", function () {
      assert(isValidIdentifierName("_a"));
      assert(isValidIdentifierName("_"));
   });

   it("names starting with a letter are valid", function () {
      assert(isValidIdentifierName("a"));
      assert(isValidIdentifierName("abc"));
      assert(isValidIdentifierName("abc0123"));
   });

   it("names with invalid characters are not valid", function () {
      assert(!isValidIdentifierName("a b"));
      assert(!isValidIdentifierName("a-b"));
      assert(!isValidIdentifierName("a.b"));
      assert(!isValidIdentifierName("a!b"));
   });
});
