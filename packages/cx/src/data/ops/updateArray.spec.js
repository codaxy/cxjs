import {Store} from '../Store';
import {updateArray} from './updateArray';
import assert from 'assert';

describe('updateArray', function() {
   it('updates all elements that satisfy criteria', function () {
      let store = new Store({
         data: {array: [1, 2, 3, 4, 5, 6]}
      });

      assert(store.update('array', updateArray, x => x + 1, x => x > 3));
      assert.deepEqual(store.get('array'), [1, 2, 3, 5, 6, 7]);
   });

   it('does not modify data if not necessary', function () {
      let array = [1, 2, 3, 4, 5, 6];
      let store = new Store({
         data: {array}
      });

      assert(false === store.update('array', updateArray, x => x + 1, x => x > 10));
      assert(store.get('array') === array);
   });

   it('works with null or undefined', function () {
      let store = new Store();
      assert(false === store.update('array', updateArray, x => x + 1, x => x > 0));
   });

   it('can remove elements given the criteria', function () {
      let store = new Store({
         data: {array: [1, 2, 3, 4, 5, 6]}
      });

      assert(store.update('array', updateArray, x => x + 1, x => x > 3, x => x <= 3));
      assert.deepEqual(store.get('array'), [5, 6, 7]);
   });
});
