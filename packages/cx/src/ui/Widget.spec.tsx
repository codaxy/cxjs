import { Store } from "../data/Store";
import { Controller, ControllerConfig } from "./Controller";
import { ControllerProp } from "./Widget";
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
      // // @ts-expect-error - multiplier is required
      // const controller: ControllerProp = {
      //    type: RequiredPropController,
      // };
      // assert.ok(controller);
   });

   it.skip("rejects CreateConfig with non-existing properties", () => {
      // const controller: ControllerProp = {
      //    type: StrictController,
      //    validProp: 1,
      //    // @ts-expect-error - nonExistingProp does not exist
      //    nonExistingProp: "invalid",
      // };
      // assert.ok(controller);
   });
});
