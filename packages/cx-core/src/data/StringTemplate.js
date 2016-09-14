import {Expression, expression} from './Expression';

import {quoteStr} from '../util/quote';

function plus(str) {
   return str.length ? str + ' + ' : str;
}

var tplCache = {};

export function stringTemplate(str) {

   var expr = tplCache[str];
   if (expr)
      return expr;

   expr = '';

   var termStart = -1,
      quoteStart = 0,
      term,
      bracketsOpen = 0,
      percentSign;

   for (var i = 0; i < str.length; i++) {
      var c = str[i];
      switch (c) {

         case '{':
            if (termStart < 0) {
               if (str[i + 1] == '{' && str[i - 1] != '%') {
                  expr = plus(expr) + quoteStr(str.substring(quoteStart, i) + '{');
                  i++;
                  quoteStart = i + 1;
               }
               else {
                  termStart = i + 1;
                  percentSign = str[i - 1] == '%';
                  if (i > quoteStart)
                     expr = plus(expr) + quoteStr(str.substring(quoteStart, percentSign ? i-1 : i));
                  bracketsOpen = 1;
               }
            }
            else
               bracketsOpen++;
            break;

         case '}':
            if (termStart >= 0) {
               if (--bracketsOpen == 0) {
                  term = str.substring(termStart, i);
                  if (term.indexOf(':') == -1)
                     term += ':s';
                  expr = plus(expr) + (percentSign ? '%{' : '{') + term + '}';
                  termStart = -1;
                  quoteStart = i + 1;
                  bracketsOpen = 0;
               }
            } else if (str[i + 1] == '}') {
               expr = plus(expr) + quoteStr(str.substring(quoteStart, i) + '}');
               i++;
               quoteStart = i + 1;
            }
            break;
      }
   }

   if (quoteStart < str.length)
      expr = plus(expr) + quoteStr(str.substring(quoteStart));

   //console.log(expr);

   return tplCache[str] = expression(expr);
}

export class StringTemplate {

   static get(str) {
      return stringTemplate(str);
   }

   static compile(str) {
      return this.get(str).memoize();
   }

   static format(format, ...args) {
      return this.get(format)(args);
   }
}
