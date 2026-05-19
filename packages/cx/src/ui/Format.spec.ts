import assert from "assert";
import { Format } from "./Format";

// The `quarter` formatter is registered eagerly when ui/Format is imported,
// so these tests do not need enableCultureSensitiveFormatting().
describe("Format - quarter", function () {
   it("renders the calendar quarter with the default pattern", function () {
      assert.equal(Format.value(new Date(2020, 0, 15), "quarter"), "Q1 2020");
      assert.equal(Format.value(new Date(2020, 5, 1), "quarter"), "Q2 2020");
      assert.equal(Format.value(new Date(2020, 11, 31), "quarter"), "Q4 2020");
   });

   it("supports custom patterns and the {yy} token", function () {
      assert.equal(Format.value(new Date(2020, 0, 1), "quarter;{yy}Q{q}"), "20Q1");
      assert.equal(Format.value(new Date(2020, 8, 1), "quarter;{q}Q{yyyy}"), "3Q2020");
   });

   it("accepts both lowercase and uppercase placeholders", function () {
      assert.equal(Format.value(new Date(2020, 0, 1), "quarter;{YY}Q{Q}"), "20Q1");
      assert.equal(Format.value(new Date(2020, 0, 1), "quarter;Q{Q} {YYYY}"), "Q1 2020");
   });

   it("treats the input as an exclusive range end with the exclusive flag", function () {
      assert.equal(Format.value(new Date(2021, 0, 1), "quarter;{yy}Q{q};exclusive"), "20Q4");
      assert.equal(Format.value(new Date(2021, 0, 1), "quarter;{yy}Q{q};ex"), "20Q4");
   });

   it("falls back to the default pattern when the pattern argument is empty (quarter;;e)", function () {
      assert.equal(Format.value(new Date(2021, 0, 1), "quarter;;e"), "Q4 2020");
      assert.equal(Format.value(new Date(2020, 0, 1), "quarter;;e"), "Q4 2019");
   });
});
