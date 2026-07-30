import assert from "assert";
import { NumericScale } from "./NumericScale";

// Build a scale with a value range of [0, 100] mapped onto a wider pixel range
// [0, 500] (factor ~5), so a value's pixel differs substantially from the value.
function makeScale() {
   const scale = new NumericScale();
   scale.reset(0, 100, 1, [[1, 2, 5, 10]], 25, 0, 40, 0, false, false, 0, 0);
   scale.measure(0, 500);
   return scale;
}

describe("NumericScale.trackValue", function () {
   it("maps a pixel back to its value when unconstrained", function () {
      const scale = makeScale();
      const px = scale.map(50); // pixel for the mid-range value 50 (~250)
      assert.ok(Math.abs(scale.trackValue(px, 0, false) - 50) < 1e-6);
   });

   // Regression guard: `constrain = true` must clamp the computed value, not the
   // raw pixel coordinate. The original bug was:
   //     if (constrain) value = this.constrainValue(v);   // v is the pixel
   // which, because the pixel range is wider than the value range, wrongly
   // clamped an in-range value whose pixel landed outside [min, max]. It should
   // clamp `value`, like TimeScale.trackValue does.
   it("constrains the returned value, not the pixel", function () {
      const scale = makeScale();
      const value = 50; // squarely inside [0, 100]
      const px = scale.map(value); // ~250 px, i.e. outside [0, 100]

      const constrained = scale.trackValue(px, 0, true);

      // 50 is already inside the axis range, so constraining must leave it be.
      assert.ok(
         Math.abs(constrained - 50) < 1e-6,
         `expected trackValue(px, 0, true) to constrain the value to 50, but got ${constrained} ` +
            `(the pixel ${px} was clamped instead of the value)`,
      );
   });
});
