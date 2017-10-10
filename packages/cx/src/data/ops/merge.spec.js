import {Store} from '../Store';
import {merge} from './merge';
import assert from 'assert';

describe('merge', function() {
   it('performs multiple set operations', function () {
      let store = new Store({
         data: {
            person: { firstName: 'John', lastName: 'Doe'}
         }
      });

      assert(store.update('person', merge, { firstName: 'Johny', age: 18 }));
      assert.deepEqual(store.get('person'), { firstName: 'Johny', lastName: 'Doe', age: 18 });
   });

   it('does not modify data if not necessary', function () {
      let store = new Store({
         data: {
            person: { firstName: 'John', lastName: 'Doe'}
         }
      });

      assert(store.update('person', merge, { firstName: 'John' }) == false);
      assert.deepEqual(store.get('person'), { firstName: 'John', lastName: 'Doe' });
   });
});
