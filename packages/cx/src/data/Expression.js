import {computable} from './computable';
import {Format} from '../util/Format';
import {Binding} from './Binding';

import {quoteStr} from '../util/quote';
import {isDigit} from '../util/isDigit';
import {isFunction} from '../util/isFunction';

/*
   Helper usage example

   Expression.registerHelper('_', _);
   let e = Expression.compile('_.min({data})');
 */

let expCache = {},
   helpers = {},
   helperNames = [],
   helperValues = [],
   expFatArrows = null;

function getExpr(expr) {

   if (expr.memoize)
      return expr;

   function memoize() {
      let lastValue, lastRunBindings = {}, lastRunResults = {}, getters = {}, currentData, len = -1;

      let get = function(bindingWithFormat) {

         let getter = getters[bindingWithFormat];
         if (!getter) {
            let binding = bindingWithFormat, format;
            let colonIndex = bindingWithFormat.indexOf(':');
            if (colonIndex != -1) {
               format = Format.parse(bindingWithFormat.substring(colonIndex + 1));
               binding = bindingWithFormat.substring(0, colonIndex);
            } else {
               let nullSeparatorIndex = bindingWithFormat.indexOf(':');
               if (nullSeparatorIndex != -1) {
                  format = Format.parse(bindingWithFormat.substring(nullSeparatorIndex));
                  binding = bindingWithFormat.substring(0, nullSeparatorIndex - 1);
               }
            }
            let b = Binding.get(binding);
            getter = (data) => {
               let value = b.value(data);
               lastRunBindings[len] = b.value;
               lastRunResults[len] = value;
               len++;
               return value;
            };

            if (format) {
               let valueGetter = getter;
               getter = data => format(valueGetter(data));
            }

            getters[bindingWithFormat] = getter;
         }
         return getter(currentData);
      };

      return function (data) {
         let i = 0;
         for (; i < len; i++)
            if (lastRunBindings[i](data) !== lastRunResults[i])
               break;
         if (i !== len) {
            len = 0;
            currentData = data;
            lastValue = expr(get);
         }
         return lastValue;
      }
   }

   let result = memoize();
   result.memoize = memoize;
   return result;
}


export function expression(str) {
   if (isFunction(str))
      return getExpr(str);

   let r = expCache[str];
   if (r)
      return r;

   let quote = false;

   let termStart = -1,
      curlyBrackets = 0,
      percentExpression;

   let fb = ['return ('];

   let args = {};
   let formats = [];
   let subExpr = 0;

   for (let i = 0; i < str.length; i++) {
      let c = str[i];
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
                  let formatStart = 0;
                  if (term[0] == '[')
                     formatStart = term.indexOf(']');
                  let colon = term.indexOf(':', formatStart > 0 ? formatStart : 0);
                  let binding = colon == -1 ? term : term.substring(0, colon);
                  let format = colon == -1 ? null : term.substring(colon + 1);
                  if (colon == -1) {
                     let nullSepIndex = binding.indexOf('|');
                     if (nullSepIndex != -1) {
                        format = binding.substring(nullSepIndex);
                        binding = binding.substring(0, nullSepIndex);
                     }
                  }
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
            if (curlyBrackets == 0) {
               if (!quote)
                  quote = c;
               else if (str[i - 1] != '\\' && quote == c)
                  quote = false;
               fb.push(c);
            }
            break;

         default:
            if (termStart < 0)
               fb.push(c);
            break;
      }
   }

   fb.push(')');

   let body = fb.join('');

   if (expFatArrows)
      body = expFatArrows(body);

   //console.log(body);
   let keys = Object.keys(args);

   let compute = new Function(...formats.map((f, i) => 'fmt' + i), ...keys, ...helperNames, body).bind(Format, ...formats, ...helperValues);
   let selector = computable(...keys.map(k=>args[k]), compute);
   expCache[str] = selector;
   return selector;
}

export const Expression = {

   get: function (str) {
      return expression(str);
   },

   compile: function (str) {
      return this.get(str).memoize();
   },

   registerHelper: function (name, helper) {
      helpers[name] = helper;
      helperNames = Object.keys(helpers);
      helperValues = helperNames.map(n => helpers[n]);
   }
};

export function plugFatArrowExpansion(impl) {
   expFatArrows = impl;
}

export function invalidateExpressionCache() {
   expCache = {};
}
