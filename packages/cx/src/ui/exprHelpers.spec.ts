import {
   truthy,
   falsy,
   isTrue,
   isFalse,
   hasValue,
   isEmpty,
   isNonEmpty,
   lessThan,
   lessThanOrEqual,
   greaterThan,
   greaterThanOrEqual,
   equal,
   notEqual,
   strictEqual,
   strictNotEqual,
} from "./exprHelpers";
import assert from "assert";
import { createAccessorModelProxy } from "../data/createAccessorModelProxy";

interface Model {
   value: number;
   name: string;
   flag: boolean;
   nullable: string | null | undefined;
   items: string[];
}

describe("exprHelpers", function () {
   const m = createAccessorModelProxy<Model>();

   describe("truthy", function () {
      it("returns true for truthy values", function () {
         const selector = truthy(m.value);
         assert.strictEqual(selector({ value: 1 }), true);
         assert.strictEqual(selector({ value: 100 }), true);
      });

      it("returns false for falsy values", function () {
         const selector = truthy(m.value);
         assert.strictEqual(selector({ value: 0 }), false);
      });

      it("returns true for non-empty strings", function () {
         const selector = truthy(m.name);
         assert.strictEqual(selector({ name: "hello" }), true);
      });

      it("returns false for empty strings", function () {
         const selector = truthy(m.name);
         assert.strictEqual(selector({ name: "" }), false);
      });

      it("returns false for null", function () {
         const selector = truthy(m.nullable);
         assert.strictEqual(selector({ nullable: null }), false);
      });
   });

   describe("falsy", function () {
      it("returns false for truthy values", function () {
         const selector = falsy(m.flag);
         assert.strictEqual(selector({ flag: true }), false);
      });

      it("returns true for falsy values", function () {
         const selector = falsy(m.flag);
         assert.strictEqual(selector({ flag: false }), true);
      });

      it("returns true for null", function () {
         const selector = falsy(m.nullable);
         assert.strictEqual(selector({ nullable: null }), true);
      });

      it("returns true for zero", function () {
         const selector = falsy(m.value);
         assert.strictEqual(selector({ value: 0 }), true);
      });

      it("returns true for empty string", function () {
         const selector = falsy(m.name);
         assert.strictEqual(selector({ name: "" }), true);
      });
   });

   describe("isTrue", function () {
      it("returns true only for strictly true", function () {
         const selector = isTrue(m.flag);
         assert.strictEqual(selector({ flag: true }), true);
      });

      it("returns false for truthy values that are not true", function () {
         const selector = isTrue(m.value);
         assert.strictEqual(selector({ value: 1 }), false);
         assert.strictEqual(selector({ value: "true" }), false);
      });

      it("returns false for false", function () {
         const selector = isTrue(m.flag);
         assert.strictEqual(selector({ flag: false }), false);
      });
   });

   describe("isFalse", function () {
      it("returns true only for strictly false", function () {
         const selector = isFalse(m.flag);
         assert.strictEqual(selector({ flag: false }), true);
      });

      it("returns false for falsy values that are not false", function () {
         const selector = isFalse(m.value);
         assert.strictEqual(selector({ value: 0 }), false);
         assert.strictEqual(selector({ value: null }), false);
         assert.strictEqual(selector({ value: "" }), false);
      });

      it("returns false for true", function () {
         const selector = isFalse(m.flag);
         assert.strictEqual(selector({ flag: true }), false);
      });
   });

   describe("hasValue", function () {
      it("returns true for defined values", function () {
         const selector = hasValue(m.value);
         assert.strictEqual(selector({ value: 0 }), true);
         assert.strictEqual(selector({ value: 1 }), true);
      });

      it("returns true for empty string", function () {
         const selector = hasValue(m.name);
         assert.strictEqual(selector({ name: "" }), true);
      });

      it("returns true for false", function () {
         const selector = hasValue(m.flag);
         assert.strictEqual(selector({ flag: false }), true);
      });

      it("returns false for null", function () {
         const selector = hasValue(m.nullable);
         assert.strictEqual(selector({ nullable: null }), false);
      });

      it("returns false for undefined", function () {
         const selector = hasValue(m.nullable);
         assert.strictEqual(selector({ nullable: undefined }), false);
      });
   });

   describe("isEmpty", function () {
      it("returns true for empty string", function () {
         const selector = isEmpty(m.name);
         assert.strictEqual(selector({ name: "" }), true);
      });

      it("returns false for non-empty string", function () {
         const selector = isEmpty(m.name);
         assert.strictEqual(selector({ name: "hello" }), false);
      });

      it("returns true for empty array", function () {
         const selector = isEmpty(m.items);
         assert.strictEqual(selector({ items: [] }), true);
      });

      it("returns false for non-empty array", function () {
         const selector = isEmpty(m.items);
         assert.strictEqual(selector({ items: ["a", "b"] }), false);
      });

      it("returns true for null", function () {
         const selector = isEmpty(m.nullable);
         assert.strictEqual(selector({ nullable: null }), true);
      });

      it("returns true for undefined", function () {
         const selector = isEmpty(m.nullable);
         assert.strictEqual(selector({ nullable: undefined }), true);
      });
   });

   describe("isNonEmpty", function () {
      it("returns false for empty string", function () {
         const selector = isNonEmpty(m.name);
         assert.strictEqual(selector({ name: "" }), false);
      });

      it("returns true for non-empty string", function () {
         const selector = isNonEmpty(m.name);
         assert.strictEqual(selector({ name: "hello" }), true);
      });

      it("returns false for empty array", function () {
         const selector = isNonEmpty(m.items);
         assert.strictEqual(selector({ items: [] }), false);
      });

      it("returns true for non-empty array", function () {
         const selector = isNonEmpty(m.items);
         assert.strictEqual(selector({ items: ["a", "b"] }), true);
      });

      it("returns false for null", function () {
         const selector = isNonEmpty(m.nullable);
         assert.strictEqual(selector({ nullable: null }), false);
      });

      it("returns false for undefined", function () {
         const selector = isNonEmpty(m.nullable);
         assert.strictEqual(selector({ nullable: undefined }), false);
      });
   });

   describe("lessThan", function () {
      it("returns true when value is less than target", function () {
         const selector = lessThan(m.value, 10);
         assert.strictEqual(selector({ value: 5 }), true);
         assert.strictEqual(selector({ value: 9 }), true);
      });

      it("returns false when value is equal to target", function () {
         const selector = lessThan(m.value, 10);
         assert.strictEqual(selector({ value: 10 }), false);
      });

      it("returns false when value is greater than target", function () {
         const selector = lessThan(m.value, 10);
         assert.strictEqual(selector({ value: 11 }), false);
         assert.strictEqual(selector({ value: 100 }), false);
      });
   });

   describe("lessThanOrEqual", function () {
      it("returns true when value is less than target", function () {
         const selector = lessThanOrEqual(m.value, 10);
         assert.strictEqual(selector({ value: 5 }), true);
         assert.strictEqual(selector({ value: 9 }), true);
      });

      it("returns true when value is equal to target", function () {
         const selector = lessThanOrEqual(m.value, 10);
         assert.strictEqual(selector({ value: 10 }), true);
      });

      it("returns false when value is greater than target", function () {
         const selector = lessThanOrEqual(m.value, 10);
         assert.strictEqual(selector({ value: 11 }), false);
         assert.strictEqual(selector({ value: 100 }), false);
      });
   });

   describe("greaterThan", function () {
      it("returns true when value is greater than target", function () {
         const selector = greaterThan(m.value, 10);
         assert.strictEqual(selector({ value: 11 }), true);
         assert.strictEqual(selector({ value: 100 }), true);
      });

      it("returns false when value is equal to target", function () {
         const selector = greaterThan(m.value, 10);
         assert.strictEqual(selector({ value: 10 }), false);
      });

      it("returns false when value is less than target", function () {
         const selector = greaterThan(m.value, 10);
         assert.strictEqual(selector({ value: 5 }), false);
         assert.strictEqual(selector({ value: 9 }), false);
      });
   });

   describe("greaterThanOrEqual", function () {
      it("returns true when value is greater than target", function () {
         const selector = greaterThanOrEqual(m.value, 10);
         assert.strictEqual(selector({ value: 11 }), true);
         assert.strictEqual(selector({ value: 100 }), true);
      });

      it("returns true when value is equal to target", function () {
         const selector = greaterThanOrEqual(m.value, 10);
         assert.strictEqual(selector({ value: 10 }), true);
      });

      it("returns false when value is less than target", function () {
         const selector = greaterThanOrEqual(m.value, 10);
         assert.strictEqual(selector({ value: 5 }), false);
         assert.strictEqual(selector({ value: 9 }), false);
      });
   });

   describe("equal (loose equality)", function () {
      it("returns true when value equals target", function () {
         const selector = equal(m.value, 10);
         assert.strictEqual(selector({ value: 10 }), true);
      });

      it("returns false when value does not equal target", function () {
         const selector = equal(m.value, 10);
         assert.strictEqual(selector({ value: 5 }), false);
         assert.strictEqual(selector({ value: 11 }), false);
      });

      it("works with string values", function () {
         const selector = equal(m.name, "hello");
         assert.strictEqual(selector({ name: "hello" }), true);
         assert.strictEqual(selector({ name: "world" }), false);
      });

      it("uses loose equality (null == undefined)", function () {
         const selector = equal(m.nullable, null);
         assert.strictEqual(selector({ nullable: null }), true);
         assert.strictEqual(selector({ nullable: undefined }), true);
      });
   });

   describe("notEqual (loose inequality)", function () {
      it("returns false when value equals target", function () {
         const selector = notEqual(m.value, 10);
         assert.strictEqual(selector({ value: 10 }), false);
      });

      it("returns true when value does not equal target", function () {
         const selector = notEqual(m.value, 10);
         assert.strictEqual(selector({ value: 5 }), true);
         assert.strictEqual(selector({ value: 11 }), true);
      });

      it("works with string values", function () {
         const selector = notEqual(m.name, "hello");
         assert.strictEqual(selector({ name: "hello" }), false);
         assert.strictEqual(selector({ name: "world" }), true);
      });

      it("uses loose inequality (null == undefined)", function () {
         const selector = notEqual(m.nullable, null);
         assert.strictEqual(selector({ nullable: null }), false);
         assert.strictEqual(selector({ nullable: undefined }), false);
      });
   });

   describe("strictEqual", function () {
      it("returns true when value strictly equals target", function () {
         const selector = strictEqual(m.value, 10);
         assert.strictEqual(selector({ value: 10 }), true);
      });

      it("returns false when value does not strictly equal target", function () {
         const selector = strictEqual(m.value, 10);
         assert.strictEqual(selector({ value: 5 }), false);
         assert.strictEqual(selector({ value: 11 }), false);
      });

      it("uses strict equality (null !== undefined)", function () {
         const selector = strictEqual(m.nullable, null);
         assert.strictEqual(selector({ nullable: null }), true);
         assert.strictEqual(selector({ nullable: undefined }), false);
      });
   });

   describe("strictNotEqual", function () {
      it("returns false when value strictly equals target", function () {
         const selector = strictNotEqual(m.value, 10);
         assert.strictEqual(selector({ value: 10 }), false);
      });

      it("returns true when value does not strictly equal target", function () {
         const selector = strictNotEqual(m.value, 10);
         assert.strictEqual(selector({ value: 5 }), true);
         assert.strictEqual(selector({ value: 11 }), true);
      });

      it("uses strict inequality (null !== undefined)", function () {
         const selector = strictNotEqual(m.nullable, null);
         assert.strictEqual(selector({ nullable: null }), false);
         assert.strictEqual(selector({ nullable: undefined }), true);
      });
   });
});
