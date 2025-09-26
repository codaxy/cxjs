import {routeAppend} from './routeAppend';

import assert from 'assert';

describe('routeAppend', function () {

   it('adds / if necessary', function () {
      assert(routeAppend('x', 'y'), 'x/y');
   });

   it('does not add extra / if not necessary', function () {
      assert(routeAppend('x/', 'y'), 'x/y');
      assert(routeAppend('x', '/y'), 'x/y');
   });

   it('removes extra slash if both parts contain it', function () {
      assert(routeAppend('x/', '/y'), 'x/y');
   });
});
