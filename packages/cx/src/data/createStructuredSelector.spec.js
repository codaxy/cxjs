import {createStructuredSelector} from './createStructuredSelector';
import assert from 'assert';
import {getSelector} from "./getSelector";
import {computable} from "./computable";

describe('createStructuredSelector', function() {

   it('works', function () {
      let structure = {
         name: getSelector({bind: "name"})
      };
      let state = {name: 'Joe'};
      let selector = createStructuredSelector(structure);
      assert.deepEqual(selector(state), {name: "Joe"});
   });

   it('does not memoize by default', function () {
      let computes = 0;
      let structure = {
         name: computable("name", name => {
            computes++;
            return name;
         })
      };
      let state = {name: 'Joe'};
      let selector = createStructuredSelector(structure);
      assert.deepEqual(selector(state), {name: "Joe"});
      selector(state);
      assert.deepEqual(computes, 2);
   });

   it('supports memoize', function () {
      let computes = 0;
      let structure = {
         name: computable("name", name => {
            computes++;
            return name;
         })
      };
      let state = {name: 'Joe'};
      let selector = createStructuredSelector(structure).memoize();
      assert.deepEqual(selector(state), {name: "Joe"});
      selector(state);
      assert.deepEqual(computes, 1);
   });
});
