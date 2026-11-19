import { describe, it, beforeEach, afterEach } from "vitest";
import assert from "assert";
import { Format, enableCultureSensitiveFormatting } from "./Format";
import { Culture, getDefaultCulture } from "./Culture";

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

describe("Format - accounting flag", function () {
   beforeEach(function () {
      enableCultureSensitiveFormatting();
      Culture.setCulture("en-US");
   });

   afterEach(function () {
      getDefaultCulture().defaultCurrency = "USD";
      Culture.setCulture("en");
   });

   it("wraps negative currency amounts in parentheses", function () {
      assert.equal(Format.value(-1234.5, "currency;USD;2;2;a"), "($1,234.50)");
      assert.equal(Format.value(1234.5, "currency;USD;2;2;a"), "$1,234.50");
      assert.equal(Format.value(-1234.5, "currency;EUR;0;0;a"), "(€1,235)");
   });

   it("applies to the default currency", function () {
      Culture.setDefaultCurrency("EUR");
      assert.equal(Format.value(-5, "currency;;0;0;a"), "(€5)");
   });

   it("combines with the sign flag", function () {
      assert.equal(Format.value(-5, "currency;USD;0;0;+a"), "($5)");
      assert.equal(Format.value(5, "currency;USD;0;0;+a"), "+$5");
   });

   it("follows the culture's accounting pattern", function () {
      Culture.setCulture("de-DE");
      assert.equal(Format.value(-5, "currency;EUR;0;0;a"), "-5 €");
   });

   it("wraps negative numbers and percentages in parentheses", function () {
      assert.equal(Format.value(-1234.5, "n;2;2;a"), "(1,234.50)");
      assert.equal(Format.value(1234.5, "n;2;2;a"), "1,234.50");
      assert.equal(Format.value(-0.052, "p;1;1;a"), "(5.2%)");
      assert.equal(Format.value(-5.2, "ps;1;1;a"), "(5.2%)");
   });

   it("combines with the sign flag for numbers", function () {
      assert.equal(Format.value(-5, "n;0;0;+a"), "(5)");
      assert.equal(Format.value(5, "n;0;0;+a"), "+5");
   });

   it("shows values that round to zero without a sign", function () {
      assert.equal(Format.value(-0.001, "n;2;2;a"), "0.00");
      assert.equal(Format.value(-0.001, "currency;USD;2;2;a"), "$0.00");
      assert.equal(Format.value(-0.00001, "p;1;1;a"), "0.0%");
      assert.equal(Format.value(-0.005, "n;2;2;a"), "(0.01)");
   });
});

describe("Format - zero flag", function () {
   beforeEach(function () {
      enableCultureSensitiveFormatting();
      Culture.setCulture("en-US");
   });

   afterEach(function () {
      Culture.setCulture("en");
   });

   it("shows zero as null text", function () {
      assert.equal(Format.value(0, "n;2;2;z|-"), "-");
      assert.equal(Format.value(-0, "n;2;2;z|-"), "-");
      assert.equal(Format.value(0, "currency;USD;2;2;z|n/a"), "n/a");
      assert.equal(Format.value(0, "p;0;0;z"), "");
      assert.equal(Format.value(0, "ps;0;0;z|-"), "-");
      assert.equal(Format.value(5, "n;2;2;z|-"), "5.00");
   });

   it("treats values that round to zero at the displayed precision as zero", function () {
      assert.equal(Format.value(0.1 + 0.2 - 0.3, "n;2;2;z|-"), "-");
      assert.equal(Format.value(0.0049999, "n;2;2;z|-"), "-");
      assert.equal(Format.value(0.005, "n;2;2;z|-"), "0.01");
      assert.equal(Format.value(0.00004, "p;2;2;z|-"), "-");
      assert.equal(Format.value(0.00005, "p;2;2;z|-"), "0.01%");
      assert.equal(Format.value(0.004, "ps;2;2;z|-"), "-");
   });

   it("agrees with the displayed value at the rounding boundary", function () {
      for (let digits = 0; digits <= 10; digits++) {
         for (let [format, half] of [
            [`n;${digits};${digits}`, Number(`5e-${digits + 1}`)],
            [`p;${digits};${digits}`, Number(`5e-${digits + 3}`)],
         ] as const) {
            for (let value of [half, half * (1 - 1e-12), half * (1 + 1e-12)]) {
               let displaysZero = /^[0.]+%?$/.test(Format.value(value, format));
               assert.equal(Format.value(value, format + ";z|-") == "-", displaysZero, `${value} with ${format}`);
            }
         }
      }
   });

   it("treats only exact zero as zero with compact notation", function () {
      assert.equal(Format.value(0, "n;0;0;cz|-"), "-");
      assert.equal(Format.value(0.1, "n;0;0;cz|-"), "0");
   });

   it("skips chained formats", function () {
      assert.equal(Format.value(0, "n;2;2;z:wrap;[;]|-"), "-");
      assert.equal(Format.value(5, "n;2;2;z:wrap;[;]|-"), "[5.00]");
   });

   it("combines with the accounting flag", function () {
      assert.equal(Format.value(-0.001, "n;2;2;az|-"), "-");
      assert.equal(Format.value(-5, "n;2;2;az|-"), "(5.00)");
   });
});
