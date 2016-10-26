import assert from 'assert';
import {Store} from './Store';

describe('Store', () => {

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

   it('changes version on each update', ()=> {
      let store = getStore();
      store.set('a', 4);
      assert.equal(store.getMeta().version, 1);
   });
});
