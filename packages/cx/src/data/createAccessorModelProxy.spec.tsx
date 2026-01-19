import { createAccessorModelProxy, AccessorChain } from "./createAccessorModelProxy";
import { Prop, ResolvePropType } from "../ui/Prop";
import { Widget, WidgetConfig } from "../ui/Widget";
import assert from "assert";

interface Model {
   firstName: string;
   address: {
      city: string;
      streetNumber: number;
   };
   "@crazy": string;
   users: User[];
   form?: {
      invalid?: boolean;
      files?: { name: string }[];
   };
}

interface User {
   id: number;
   name: string;
   email: string;
}

describe("createAccessorModelProxy", () => {
   it("generates correct paths", () => {
      let model = createAccessorModelProxy<Model>();
      assert.strictEqual(model.firstName.toString(), "firstName");
      assert.strictEqual(model.address.toString(), "address");
      assert.strictEqual(model.address.city.toString(), "address.city");
   });

   it("can be used in string templates", () => {
      let model = createAccessorModelProxy<Model>();
      assert.strictEqual("address.city", `${model.address.city}`);
      assert.strictEqual("address.city", "" + model.address.city);
      assert.strictEqual("address.city.suffix", model.address.city + ".suffix");
   });

   it("nameOf returns name of the last prop ", () => {
      let model = createAccessorModelProxy<Model>();
      assert.strictEqual(model.firstName.nameOf(), "firstName");
      assert.strictEqual(model.address.nameOf(), "address");
      assert.strictEqual(model.address.city.nameOf(), "city");
      assert.strictEqual(model.address.nameOf(), "address");

      let { streetNumber, city } = model.address;
      assert.strictEqual(streetNumber.nameOf(), "streetNumber");
      assert.strictEqual(city.nameOf(), "city");
   });

   it("allows non-standard property identifiers ", () => {
      let model = createAccessorModelProxy<Model>();
      assert.strictEqual(model["@crazy"].nameOf(), "@crazy");
   });

   it("allows access to properties of optional object properties", () => {
      let model = createAccessorModelProxy<Model>();
      // form is optional, but we should still be able to access its properties
      assert.strictEqual(model.form.toString(), "form");
      assert.strictEqual(model.form.invalid.toString(), "form.invalid");
      assert.strictEqual(model.form.files.toString(), "form.files");
   });

   it("AccessorChain<any> allows access to any property", () => {
      // When using an untyped model (any), all property access should be allowed
      let model = createAccessorModelProxy<any>();

      // These should all be valid - no TypeScript errors
      assert.strictEqual(model.foo.toString(), "foo");
      assert.strictEqual(model.bar.baz.toString(), "bar.baz");
      assert.strictEqual(model.deeply.nested.property.toString(), "deeply.nested.property");
      assert.strictEqual(model.anyName.anyChild.anyGrandchild.toString(), "anyName.anyChild.anyGrandchild");
   });

   it("ResolvePropType extracts correct types from AccessorChain", () => {
      let model = createAccessorModelProxy<Model>();

      // ResolvePropType should extract the inner type from AccessorChain
      type ResolvedString = ResolvePropType<typeof model.firstName>;
      type ResolvedNumber = ResolvePropType<typeof model.address.streetNumber>;
      type ResolvedUsers = ResolvePropType<typeof model.users>;

      // These assignments verify the types are correctly inferred
      // If types are wrong, TypeScript will error
      const str: ResolvedString = "test";
      const num: ResolvedNumber = 42;
      const users: ResolvedUsers = [{ id: 1, name: "John", email: "john@example.com" }];

      // Verify array element type is preserved
      type UserArray = ResolvePropType<AccessorChain<User[]>>;
      const userArray: UserArray = [{ id: 1, name: "Test", email: "test@test.com" }];

      // Runtime assertion to make the test meaningful
      assert.ok(true);
   });

   it("generic widget infers type from AccessorChain in JSX", () => {
      let model = createAccessorModelProxy<Model>();

      // Simulates a generic widget config like LookupFieldConfig<TOption>
      interface GenericWidgetConfig<T = unknown> extends WidgetConfig {
         items?: AccessorChain<T[]>;
         onProcess?: (item: T) => void;
      }

      // Simulates a CxJS widget class
      class GenericWidget<T = unknown> extends Widget<GenericWidgetConfig<T>> {}

      // T should be inferred as User from model.users (AccessorChain<User[]>)
      let widget = (
         <cx>
            <GenericWidget
               items={model.users}
               onProcess={(user) => {
                  // user should be typed as User
                  const id: number = user.id;
                  const name: string = user.name;
                  const email: string = user.email;
               }}
            />
         </cx>
      );

      assert.ok(true);
   });

   it("generic widget infers type from Prop<T[]> in JSX", () => {
      let model = createAccessorModelProxy<Model>();

      // Uses Prop<T[]> like LookupFieldConfig does
      interface GenericWidgetConfig<T = unknown> extends WidgetConfig {
         items?: Prop<T[]>;
         onProcess?: (item: T) => void;
      }

      class GenericWidget<T = unknown> extends Widget<GenericWidgetConfig<T>> {}

      // T should be inferred as User from model.users (AccessorChain<User[]>)
      let widget = (
         <cx>
            <GenericWidget
               items={model.users}
               onProcess={(user) => {
                  // user should be typed as User
                  const id: number = user.id;
                  const name: string = user.name;
                  const email: string = user.email;
               }}
            />
         </cx>
      );

      assert.ok(true);
   });
});
