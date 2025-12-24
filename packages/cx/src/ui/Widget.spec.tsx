import { Controller, ControllerConfig } from "./Controller";
import { ControllerProp } from "./Widget";
import { validateConfig } from "../util/Component";
import assert from "assert";

describe("ControllerProp type safety", () => {
   interface RequiredPropControllerConfig extends ControllerConfig {
      multiplier: number;
   }

   class RequiredPropController extends Controller {
      constructor(config?: RequiredPropControllerConfig) {
         super(config);
      }
   }

   interface StrictControllerConfig extends ControllerConfig {
      validProp: number;
   }

   class StrictController extends Controller {
      constructor(config?: StrictControllerConfig) {
         super(config);
      }
   }

   it.skip("rejects CreateConfig missing required properties", () => {
      // @ts-expect-error - multiplier is required
      const controller: ControllerProp = validateConfig({
         type: RequiredPropController,
      });
      assert.ok(controller);
   });

   it("rejects CreateConfig with non-existing properties", () => {
      const controller: ControllerProp = validateConfig({
         type: StrictController,
         validProp: 1,
         // @ts-expect-error - nonExistingProp does not exist
         nonExistingProp: "invalid",
      });
      assert.ok(controller);
   });

   it("rejects CreateConfig with wrong property type", () => {
      const controller: ControllerProp = validateConfig({
         type: StrictController,
         // @ts-expect-error - validProp should be number, not string
         validProp: "wrong type",
      });
      assert.ok(controller);
   });
});
