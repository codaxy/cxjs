// Which children the instance cache keeps between explore passes.
import { describe, it } from "vitest";
import assert from "assert";
import { Store } from "../data/Store";
import { Container } from "./Container";
import { ChildState } from "./ChildState";
import { Instance, InstanceCache } from "./Instance";
import { Text } from "./Text";
import { Widget } from "./Widget";

function setup() {
   let store = new Store();
   let parent = new Instance(Widget.create(Container, {}), "parent", undefined, store);
   let cache = new InstanceCache(parent);
   let widgets = [1, 2, 3].map((i) => {
      let widget = Widget.create(Text, { value: "text " + i });
      widget.init();
      return widget;
   });
   return { store, cache, widgets };
}

describe("InstanceCache", () => {
   it("keeps the children marked in the last explore pass and removes the others", () => {
      let { store, cache, widgets } = setup();
      let [a, b, c] = widgets.map((w) => cache.getChild(w, store));
      cache.mark();
      cache.addChild(a);
      cache.addChild(c);
      cache.sweep();

      assert.equal(cache.getChild(widgets[0], store), a);
      assert.equal(cache.getChild(widgets[2], store), c);
      assert.notEqual(cache.getChild(widgets[1], store), b);
   });

   it("keeps a child added in place of the cached child with the same key, and removes unmarked children", () => {
      let { store, cache, widgets } = setup();
      let [a, b] = widgets.slice(0, 2).map((w) => cache.getChild(w, store));
      let replacement = widgets[1].createInstance(b.key, b.parent!, store);

      cache.mark();
      cache.addChild(b);
      cache.addChild(replacement);
      cache.sweep();

      assert.equal(cache.getChild(widgets[1], store), replacement);
      assert.notEqual(cache.getChild(widgets[0], store), a);
   });

   it("creates an instance for a widget that has a state of a child without an instance under its key", () => {
      let { store, cache, widgets } = setup();
      let state = cache.getState(widgets[0], store);
      assert.ok(state instanceof ChildState);

      let instance = cache.getChild(widgets[0], store);
      assert.ok(instance instanceof Instance);
      assert.equal(instance.key, state.key);
   });
});
