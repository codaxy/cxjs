import {Store} from '../Store';
import {filter} from './filter';
import assert from 'assert';

describe('filter', function() {
   it('should filter array elements', function () {
      let store = new Store({
         data: {
            array: [1, 2, 3]
         }
      });

      assert(store.update('array', filter, x => x > 1));
      assert.deepEqual(store.get('array'), [2, 3]);
   });

   it('should work with undefined arrays', function () {
      let store = new Store();
      assert.equal(false, store.update('array', filter, x => x > 1));
      assert.deepEqual(store.get('array'), undefined);
   });

   it('returns same array if all elements satisfy condition', function () {
      let array = [1, 2, 3];
      let store = new Store({ data: { array }});
      assert.equal(false, store.update('array', filter, x => x > 0));
      assert(store.get('array') === array);
   });
});
