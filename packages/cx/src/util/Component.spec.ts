import assert from "assert";
import { Component, ComponentConstructor, ComponentConfigType, CreatableOrInstance } from "./Component";

// Test classes for type checking
interface TestWidgetConfig {
   text?: string;
   value?: number;
}

class TestWidget extends Component {
   declare text?: string;
   declare value?: number;

   constructor(config?: TestWidgetConfig) {
      super(config);
   }
}

interface TestButtonConfig extends TestWidgetConfig {
   onClick?: () => void;
}

class TestButton extends TestWidget {
   declare onClick?: () => void;

   constructor(config?: TestButtonConfig) {
      super(config);
   }
}

// Register alias for testing
Component.alias("test-widget", TestWidget);
Component.alias("test-button", TestButton);

describe("Component.create", function () {
   describe("pass-through", function () {
      it("returns the same instance if already a component", function () {
         const btn = new TestButton({ text: "Hello" });
         const result = Component.create(btn);
         assert.strictEqual(result, btn);
         assert.equal(result.text, "Hello");
      });

      it("preserves the component type", function () {
         const btn = new TestButton({ text: "Hello" });
         const result: TestButton = Component.create(btn);
         assert.ok(result instanceof TestButton);
      });
   });

   describe("array input", function () {
      it("creates an array of components from array of configs", function () {
         const configs = [{ text: "One" }, { text: "Two" }];
         const results = TestWidget.create(configs);
         assert.equal(results.length, 2);
         assert.equal(results[0].text, "One");
         assert.equal(results[1].text, "Two");
      });

      it("returns array of component instances", function () {
         const configs = [{ text: "One" }];
         const results = TestWidget.create(configs);
         assert.ok(Array.isArray(results));
         assert.ok(results[0] instanceof TestWidget);
      });
   });

   describe("class type as first argument", function () {
      it("creates instance of specified class", function () {
         const result = Component.create(TestButton, { text: "Click me" });
         assert.ok(result instanceof TestButton);
         assert.equal(result.text, "Click me");
      });

      it("returns typed result based on class", function () {
         const result: TestButton = Component.create(TestButton, { text: "Click" });
         assert.ok(result instanceof TestButton);
      });

      it("merges config and more parameters", function () {
         const result = Component.create(TestButton, { text: "Base" }, { value: 42 });
         assert.equal(result.text, "Base");
         assert.equal(result.value, 42);
      });
   });

   describe("config with type property", function () {
      it("creates instance of type specified in config", function () {
         const result = Component.create({ type: TestButton, text: "Typed" });
         assert.ok(result instanceof TestButton);
         assert.equal(result.text, "Typed");
      });

      it("uses config properties for the created instance", function () {
         const result = Component.create({
            type: TestButton,
            text: "Hello",
            value: 123,
         });
         assert.equal(result.text, "Hello");
         assert.equal(result.value, 123);
      });
   });

   describe("config with $type property", function () {
      it("creates instance of $type specified in config", function () {
         const result = Component.create({ $type: TestButton, text: "Dollar" });
         assert.ok(result instanceof TestButton);
         assert.equal(result.text, "Dollar");
      });
   });

   describe("string alias", function () {
      it("creates instance from registered alias", function () {
         const result = Component.create("test-button", { text: "Aliased" });
         assert.ok(result instanceof TestButton);
         assert.equal(result.text, "Aliased");
      });

      it("throws for unknown alias", function () {
         assert.throws(() => {
            Component.create("unknown-alias");
         }, /Unknown component alias/);
      });
   });

   describe("plain config object", function () {
      it("creates instance of the class create is called on", function () {
         const result = TestWidget.create({ text: "Plain" });
         assert.ok(result instanceof TestWidget);
         assert.equal(result.text, "Plain");
      });

      it("works with subclasses", function () {
         const result = TestButton.create({ text: "Sub", onClick: () => {} });
         assert.ok(result instanceof TestButton);
         assert.equal(result.text, "Sub");
      });
   });

   describe("config array as second argument", function () {
      it("creates array when config is an array", function () {
         const results = Component.create(TestWidget, [{ text: "A" }, { text: "B" }]);
         assert.equal(results.length, 2);
         assert.ok(results[0] instanceof TestWidget);
         assert.ok(results[1] instanceof TestWidget);
      });
   });

   describe("type inference", function () {
      it("infers config type from class constructor", function () {
         // This is a compile-time check - if it compiles, the types are correct
         const config: ComponentConfigType<typeof TestButton> = {
            text: "Hello",
            onClick: () => {},
         };
         const result = Component.create(TestButton, config);
         assert.ok(result instanceof TestButton);
      });
   });

   describe("config with type and more argument", function () {
      it("merges config and more parameters", function () {
         const result = Component.create({ type: TestButton, text: "Base" }, { value: 42 });
         assert.ok(result instanceof TestButton);
         assert.equal(result.text, "Base");
         assert.equal(result.value, 42);
      });

      it("works with $type as well", function () {
         const result = Component.create({ $type: TestButton, text: "Dollar" }, { value: 99 });
         assert.ok(result instanceof TestButton);
         assert.equal(result.text, "Dollar");
         assert.equal(result.value, 99);
      });
   });

   describe("heterogeneous array with type property", function () {
      it("creates array of different component types", function () {
         const results = Component.create([
            { type: TestWidget, text: "Widget" },
            { type: TestButton, text: "Button", onClick: () => {} },
         ]);
         assert.equal(results.length, 2);
         assert.ok(results[0] instanceof TestWidget);
         assert.ok(results[1] instanceof TestButton);
         assert.equal(results[0].text, "Widget");
         assert.equal(results[1].text, "Button");
      });

      it("returns properly typed tuple", function () {
         const results = Component.create([
            { type: TestWidget, text: "W" },
            { type: TestButton, text: "B" },
         ]);
         // Type check: results[0] should be TestWidget, results[1] should be TestButton
         const widget: TestWidget = results[0];
         const button: TestButton = results[1];
         assert.ok(widget instanceof TestWidget);
         assert.ok(button instanceof TestButton);
      });
   });

   describe("this-bound create with config", function () {
      it("creates instance when called on specific class", function () {
         const result = TestButton.create({ text: "Bound", onClick: () => {} });
         assert.ok(result instanceof TestButton);
         assert.equal(result.text, "Bound");
      });

      it("accepts more parameter for additional config", function () {
         const result = TestButton.create({ text: "Main" }, { value: 100 });
         assert.ok(result instanceof TestButton);
         assert.equal(result.text, "Main");
         assert.equal(result.value, 100);
      });
   });

   describe("this-bound create with array", function () {
      it("creates array of instances when called on specific class", function () {
         const results = TestButton.create([{ text: "A" }, { text: "B" }]);
         assert.equal(results.length, 2);
         assert.ok(results[0] instanceof TestButton);
         assert.ok(results[1] instanceof TestButton);
      });

      it("accepts more parameter for array", function () {
         const results = TestButton.create([{ text: "X" }, { text: "Y" }], { value: 50 });
         assert.equal(results.length, 2);
         assert.equal(results[0].value, 50);
         assert.equal(results[1].value, 50);
      });
   });
});

describe("Creatable type", function () {
   // Helper function that accepts Creatable
   function createAxis<T extends Component>(creatable: CreatableOrInstance<T>): T {
      return Component.create(creatable as any);
   }

   it("accepts instance pass-through", function () {
      const widget = new TestWidget({ text: "Instance" });
      const result = createAxis(widget);
      assert.strictEqual(result, widget);
   });

   it("accepts constructor", function () {
      const result = createAxis(TestButton);
      assert.ok(result instanceof TestButton);
   });

   it("accepts config with type", function () {
      const result = createAxis({ type: TestButton, text: "Typed" });
      assert.ok(result instanceof TestButton);
      assert.equal(result.text, "Typed");
   });

   it("accepts config with $type", function () {
      const result = createAxis({ $type: TestButton, text: "DollarTyped" });
      assert.ok(result instanceof TestButton);
      assert.equal(result.text, "DollarTyped");
   });
});
