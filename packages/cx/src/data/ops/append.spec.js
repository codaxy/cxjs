import {Store} from '../Store';
import {append} from './append';
import assert from 'assert';

describe('append', function() {
   it('should add elements to an array', function () {
      let store = new Store({
         data: {
            array: []
         }
      });

      assert(store.update('array', append, 1));
      assert.deepEqual(store.get('array'), [1]);
   });

   it('should work with undefined arrays', function () {
      let store = new Store();
      assert(store.update('array', append, 1));
      assert.deepEqual(store.get('array'), [1]);
   });

   it('accepts multiple arguments', function () {
      let store = new Store();
      assert(store.update('array', append, 1, 2, 3));
      assert.deepEqual(store.get('array'), [1, 2, 3]);
   });
});
