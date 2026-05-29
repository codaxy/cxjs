import { createAccessorModelProxy } from "../../data/createAccessorModelProxy";
import { LookupField } from "./LookupField";
import { Store } from "../../data/Store";
import { ValidationGroup } from "./ValidationGroup";
import { bind } from "../../ui/bind";
import { createTestRenderer } from "../../util/test/createTestRenderer";
import assert from "assert";

interface User {
   id: number;
   name: string;
   email: string;
}

interface SelectedUser {
   id: number;
   name: string;
}

interface Model {
   users: User[];
   selectedUsers: SelectedUser[];
   selectedUserId: number;
}

describe("LookupField", () => {
   it("infers TOption from AccessorChain<T[]> in options prop", () => {
      const model = createAccessorModelProxy<Model>();

      // TOption should be inferred as User from model.users (AccessorChain<User[]>)
      let widget = (
         <cx>
            <LookupField
               options={model.users}
               onQuery={(query, instance) => {
                  // Should return User[]
                  return [] as User[];
               }}
               onCreateVisibleOptionsFilter={(params, instance) => (option) => {
                  // option should be typed as User
                  const id: number = option.id;
                  const name: string = option.name;
                  const email: string = option.email;
                  return true;
               }}
            />
         </cx>
      );
   });

   it("infers TRecord from AccessorChain<T[]> in records prop", () => {
      const model = createAccessorModelProxy<Model>();

      // TRecord should be inferred as SelectedUser from model.selectedUsers
      let widget = (
         <cx>
            <LookupField
               multiple
               records={model.selectedUsers}
               onGetRecordDisplayText={(record, instance) => {
                  // record should be typed as SelectedUser
                  const id: number = record.id;
                  const name: string = record.name;
                  return record.name;
               }}
            />
         </cx>
      );
   });

   it("infers both TOption and TRecord from accessor chains", () => {
      const model = createAccessorModelProxy<Model>();

      let widget = (
         <cx>
            <LookupField
               multiple
               options={model.users}
               records={model.selectedUsers}
               onQuery={(query) => {
                  // Should return User[]
                  return [] as User[];
               }}
               onCreateVisibleOptionsFilter={(params) => (option) => {
                  // option should be User
                  const email: string = option.email;
                  return true;
               }}
               onGetRecordDisplayText={(record) => {
                  // record should be SelectedUser
                  const name: string = record.name;
                  return name;
               }}
            />
         </cx>
      );
   });

   describe("validateOptionExists", () => {
      const options = [
         { id: 1, text: "One" },
         { id: 2, text: "Two" },
      ];

      it("reports an error when the selected value is missing from options", async () => {
         let widget = (
            <cx>
               <ValidationGroup errors={bind("errors")}>
                  <LookupField
                     value={bind("value")}
                     text={bind("text")}
                     options={options}
                     validateOptionExists
                  />
               </ValidationGroup>
            </cx>
         );

         let store = new Store();
         store.set("value", 99);
         store.set("text", "Stale");

         await createTestRenderer(store, widget);

         let errors = store.get("errors");
         assert.equal(errors.length, 1);
         assert.equal(errors[0].message, "The selected option is no longer available.");
      });

      it("does not report an error when the selected value matches an option", async () => {
         let widget = (
            <cx>
               <ValidationGroup errors={bind("errors")}>
                  <LookupField
                     value={bind("value")}
                     text={bind("text")}
                     options={options}
                     validateOptionExists
                  />
               </ValidationGroup>
            </cx>
         );

         let store = new Store();
         store.set("value", 1);
         store.set("text", "One");

         await createTestRenderer(store, widget);

         let errors = store.get("errors");
         assert.equal(errors.length, 0);
      });

      it("does not report an error when the field is empty", async () => {
         let widget = (
            <cx>
               <ValidationGroup errors={bind("errors")}>
                  <LookupField
                     value={bind("value")}
                     text={bind("text")}
                     options={options}
                     validateOptionExists
                  />
               </ValidationGroup>
            </cx>
         );

         let store = new Store();

         await createTestRenderer(store, widget);

         let errors = store.get("errors");
         assert.equal(errors.length, 0);
      });

      it("does not report an error when options are not provided (server-side mode)", async () => {
         let widget = (
            <cx>
               <ValidationGroup errors={bind("errors")}>
                  <LookupField
                     value={bind("value")}
                     text={bind("text")}
                     onQuery={() => []}
                     validateOptionExists
                  />
               </ValidationGroup>
            </cx>
         );

         let store = new Store();
         store.set("value", 99);
         store.set("text", "Stale");

         await createTestRenderer(store, widget);

         let errors = store.get("errors");
         assert.equal(errors.length, 0);
      });

      it("reports an error in multiple mode when some ids are not in options", async () => {
         let widget = (
            <cx>
               <ValidationGroup errors={bind("errors")}>
                  <LookupField
                     multiple
                     values={bind("values")}
                     options={options}
                     validateOptionExists
                  />
               </ValidationGroup>
            </cx>
         );

         let store = new Store();
         store.set("values", [1, 99]);

         await createTestRenderer(store, widget);

         let errors = store.get("errors");
         assert.equal(errors.length, 1);
      });

      it("does not validate by default (back-compat)", async () => {
         let widget = (
            <cx>
               <ValidationGroup errors={bind("errors")}>
                  <LookupField value={bind("value")} text={bind("text")} options={options} />
               </ValidationGroup>
            </cx>
         );

         let store = new Store();
         store.set("value", 99);
         store.set("text", "Stale");

         await createTestRenderer(store, widget);

         let errors = store.get("errors");
         assert.equal(errors.length, 0);
      });
   });
});
