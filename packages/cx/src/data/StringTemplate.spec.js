import {StringTemplate} from './StringTemplate';
import assert from 'assert';

describe('StringTemplate', function() {
    describe('#compile()', function () {
        it('returns a selector', function () {
           var e = StringTemplate.compile('Hello {person.name}');
           var state = {
               person: {
                  name: 'Jim'
               }
            };
            assert.equal(e(state), 'Hello Jim');
        });
    });

   describe('double brackets are used to escape brackets', function() {
      it('double brackets are preserved', function () {
         var e = StringTemplate.compile('Hello {{person.name}}');
         var state = {
            person: {
               name: 'Jim'
            }
         };
         assert.equal(e(state), 'Hello {person.name}');
      });

      it('triple brackets are converted to single brackets and a binding', function () {
         var e = StringTemplate.compile('Hello {{{person.name}}}');
         var state = {
            person: {
               name: 'Jim'
            }
         };
         assert.equal(e(state), 'Hello {Jim}');
      });
   });

   describe('supports expressions', function() {
      it('using []', function () {
         var e = StringTemplate.compile('1 + 2 = {[1+2]}');
         assert.equal(e(), '1 + 2 = 3');
      });

      it('using %', function () {
         var e = StringTemplate.compile('1 + 2 = %{1+2}');
         assert.equal(e(), '1 + 2 = 3');
      });

      it('with subexpressions', function () {
         var e = StringTemplate.compile('1 + 2 = {[%{1+2}]}');
         assert.equal(e(), '1 + 2 = 3');
      });

      it('with a conditional operator', function () {
         var e = StringTemplate.compile('1 + 2 = {[true ? 3 : 2]:s}');
         assert.equal(e(), '1 + 2 = 3');
      });
   });
});
