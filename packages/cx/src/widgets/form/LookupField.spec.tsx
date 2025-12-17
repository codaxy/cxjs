import { createAccessorModelProxy } from "../../data/createAccessorModelProxy";
import { LookupField } from "./LookupField";

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
});
