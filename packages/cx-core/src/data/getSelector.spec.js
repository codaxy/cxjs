import {getSelector} from './getSelector';
import assert from 'assert';

describe('getSelector', function() {

   it('array of selectors converts each element into a selector', function () {
      let arraySelector = [{bind: 'name'}, {expr: '{name}'}];
      let state = { name: 'Joe' };
      let selector = getSelector(arraySelector);
      assert.deepEqual(selector(state), ['Joe', 'Joe']);
   });
});
