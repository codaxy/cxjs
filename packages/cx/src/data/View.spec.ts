import assert from 'assert';
import {Store} from './Store';

describe('View', () => {

   const getStore = () => {
      return new Store({
         data: {
            a: 3,
            item: {
               firstName: 'Jack'
            }
         }
      });
   };

   describe('.get', () => {

      it('retrieves a value pointed by a selector path', () => {
         let store = getStore();
         assert.equal(store.get('item.firstName'), 'Jack');
      });

      it('will return an array if multiple arguments are passed', () => {
         let store = getStore();
         assert.deepEqual(
            store.get('a', 'item.firstName'),
            [3, 'Jack']
         );
      });

      it('will return an array if array is passed', () => {
         let store = getStore();
         assert.deepEqual(
            store.get(['a', 'item.firstName']),
            [3, 'Jack']
         );
      });
   })

   describe('.set', () => {
      it('supports deep selectors', () => {
         let store = getStore();
         store.set('item.firstName', 'Jill');
         assert.equal(store.get('item.firstName'), 'Jill');
      })

      it('supports setting multiple items through an object', () => {
         let store = getStore();
         store.set({
            'b': 4,
            'item.firstName': 'Jill'
         });
         assert.deepEqual(
            store.get(['b', 'item.firstName']),
            [4, 'Jill']
         );
      })
   });
});
