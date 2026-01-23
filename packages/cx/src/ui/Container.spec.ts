import assert from "assert";
import { ContainerBase, ContainerConfig } from "./Container";
import { Store } from "../data";
import { Instance } from "./Instance";
import { RenderingContext } from "./RenderingContext";
import { HtmlElement } from "../widgets/HtmlElement";
import { Widget } from "./Widget";

function collectKeys(obj: any, path = "", result: Record<string, boolean> = {}, seen = new WeakSet()): Record<string, boolean> {
   if (!obj || typeof obj !== "object" || seen.has(obj)) return result;
   seen.add(obj);
   for (const key of Object.keys(obj)) {
      const fullPath = path ? `${path}.${key}` : key;
      result[fullPath] = true;
      collectKeys(obj[key], fullPath, result, seen);
   }
   return result;
}

describe("Container", function () {
   it("should not mutate config during init", function () {
      const config = {
         type: HtmlElement,
         tag: "div",
         children: [
            { type: HtmlElement, tag: "span", text: "Hello" },
            { type: HtmlElement, tag: "span", text: "World" },
         ],
      };

      const keysBefore = collectKeys(config);

      const widget = Widget.create(config);
      const store = new Store();
      const context = new RenderingContext();
      const instance = new Instance(widget, "1", null as any, store);
      instance.init(context);

      const keysAfter = collectKeys(config);
      const newKeys = Object.keys(keysAfter).filter((k) => !keysBefore[k]);

      assert.deepStrictEqual(newKeys, [], `Config was mutated. New keys: ${newKeys.join(", ")}`);
   });

   it("should not use the same children array instance as config", function () {
      const configChildren = [
         { type: HtmlElement, tag: "span", text: "Hello" },
         { type: HtmlElement, tag: "span", text: "World" },
      ];
      const config = {
         type: HtmlElement,
         tag: "div",
         children: configChildren,
      };

      const widget = Widget.create(config) as HtmlElement;
      widget.init();

      assert.notStrictEqual(widget.items, configChildren, "Widget should not use the same children array instance as config");
   });
});

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
