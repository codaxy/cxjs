import {getSearchQueryPredicate} from './getSearchQueryPredicate';

import assert from 'assert';

describe('queryMatcher', function () {

   it('blank means allow all', function () {
      var m = getSearchQueryPredicate('');
      assert(m('cx'));
   });

   it('is case insensitive', function () {
      var m = getSearchQueryPredicate('Cx');
      assert(m('cx'));
   });

   it('if multiple words are provided, all must be matched', function () {
      var m = getSearchQueryPredicate('jo smi');
      assert(m('John Smith'));
      assert(!m('John Nash'));
   });

   it('regex special characters are properly escaped', function () {
      var m = getSearchQueryPredicate('*?');
      assert(m('*?'));
   });
});
