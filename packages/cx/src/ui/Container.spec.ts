import assert from "assert";
import { ContainerBase, ContainerConfig } from "./Container";

describe("ContainerConfig", function () {
   describe("reserved props cannot be introduced by subclasses", function () {
      it("rejects add in extended config interface", function () {
         // @ts-expect-error - add is reserved and cannot be added to extended config
         interface BadConfig extends ContainerConfig {
            add: string;
         }
      });

      it("rejects clear in extended config interface", function () {
         // @ts-expect-error - clear is reserved and cannot be added to extended config
         interface BadConfig extends ContainerConfig {
            clear: string;
         }
      });

      it("allows valid properties in extended config", function () {
         interface GoodConfig extends ContainerConfig {
            customProp?: string;
         }
         const config: GoodConfig = { customProp: "test" };
         assert.ok(config);
      });
   });
});
