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

   describe('#get', () => {

      it('retrieves a value pointed by a path', () => {
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
});
