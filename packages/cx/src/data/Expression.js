import {computable} from './computable';
import {Format} from '../util/Format';

import {quoteStr} from '../util/quote';
import {isDigit} from '../util/isDigit';
import {expandFatArrows} from '../util/expandFatArrows';

/*
   Helper usage example

   Expression.registerHelper('_', _);
   var e = Expression.compile('_.min({data})');
 */

var expCache = {},
   helpers = {},
   helperNames = [],
   helperValues = [];


export function expression(str) {
   var r = expCache[str];
   if (r)
      return r;

   var quote = false;

   var termStart = -1,
      curlyBrackets = 0,
      percentExpression;

   var fb = ['return ('];

   var args = [];
   var formats = [];
   var subExpr = 0;

   for (var i = 0; i < str.length; i++) {
      var c = str[i];
      switch (c) {

         case '{':
            if (curlyBrackets>0)
               curlyBrackets++;
            else {
               if (!quote && termStart < 0 && (str[i + 1] != '{' || str[i-1] == '%')) {
                  termStart = i + 1;
                  curlyBrackets = 1;
                  percentExpression = str[i-1] == '%';
                  if (percentExpression)
                     fb.pop(); //%
               }
               else if (str[i - 1] != '{')
                  fb.push(c);
            }
            break;

         case '}':
            if (termStart >= 0) {
               if (--curlyBrackets == 0) {
                  let term = str.substring(termStart, i);
                  let colon = term.indexOf(':');
                  let binding = colon == -1 ? term : term.substring(0, colon);
                  let format = colon == -1 ? null : term.substring(colon + 1);
                  let argName = binding.replace(/\./g, '_');
                  if (isDigit(argName[0]))
                     argName = '$' + argName;
                  if (percentExpression || (binding[0] == '[' && binding[binding.length - 1] == ']')) {
                     argName = 'expr' + (++subExpr);
                     args[argName] = expression(percentExpression ? binding : binding.substring(1, binding.length - 1));
                  } else
                     args[argName] = binding;
                  if (format) {
                     let formatter = 'fmt' + formats.length;
                     fb.push(formatter, '(', argName, ', ', quoteStr(format), ')');
                     formats.push(Format.parse(format));
                  } else
                     fb.push(argName);
                  termStart = -1;
               }
            }
            else
               fb.push(c);

            break;

         case '"':
         case "'":
            if (!quote)
               quote = c;
            else if (str[i - 1] != '\\' && quote == c)
               quote = false;
            fb.push(c);
            break;

         default:
            if (termStart < 0)
               fb.push(c);
            break;
      }
   }

   fb.push(')');

   var body = fb.join('');

   if (Expression.expandFatArrows)
      body = expandFatArrows(body);

   //console.log(fstr.join(''));
   var keys = Object.keys(args);

   var compute = new Function(...formats.map((f, i) => 'fmt' + i), ...keys, ...helperNames, body).bind(Format, ...formats, ...helperValues);
   var selector = computable(...keys.map(k=>args[k]), compute);
   expCache[str] = selector;
   return selector;
}

export class Expression {

   static get(str) {
      return expression(str);
   }

   static compile(str) {
      return this.get(str).memoize();
   }

   static registerHelper(name, helper) {
      helpers[name] = helper;
      helperNames = Object.keys(helpers);
      helperValues = helperNames.map(n=>helpers[n]);
   }
}

Expression.expandFatArrows = true; //IE, Safari

try {
   if (eval('(() => 5)()') === 5)
      Expression.expandFatArrows = false;
}
catch(e) {}
