import assert from 'assert';
import {Store} from './Store';
import {Ref} from "./Ref";
import {append} from "./ops/append";

describe('Ref', () => {

   const getStore = () => {
      return new Store({
         data: {
            a: 3,
            item: {
               firstName: 'Jack'
            },
            array: []
         }
      });
   };

   it('can init data', () => {
      let store = getStore();
      let b = store.ref("b", 1);
      assert.equal(store.get('b'), 1);
   });

   it('can set data', () => {
      let store = getStore();
      let b = store.ref("b", 1);
      b.set(2);
      assert.equal(store.get('b'), 2);
   });

   it('can delete data', () => {
      let store = getStore();
      let b = store.ref("item");
      b.delete();
      assert.equal(store.get('item'), undefined);
   });

   it('can cast itself to a ref of another type', () => {
      class ArrayRef extends Ref {
         append(...args) {
            this.update(append, ...args);
         }
      }
      let store = getStore();
      let array = store.ref("array").as(ArrayRef);
      array.append(1, 2, 3);
      assert.deepEqual(array.get(), [1, 2, 3]);
   });

   it('can extend itself in a functional way', () => {

      let store = getStore();

      let array = store.ref("array").as(({ update, set, path }) => ({
         append(...args) {
            update(path, append, ...args);
         },

         clear() {
            set(path, []);
         }
      }));
      array.append(1, 2, 3);
      assert.deepEqual(array.get(), [1, 2, 3]);
      array.clear();
      assert.deepEqual(array.get(), []);
   });
});
