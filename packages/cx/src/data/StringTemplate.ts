
import { expression } from "./Expression";
import { MemoSelector } from "./Selector";

import { quoteStr } from "../util/quote";

function plus(str: string) {
   return str.length ? str + " + " : str;
}

export function stringTemplate(str: string): MemoSelector {
   let tplCache = getTplCache();
   let cached = tplCache[str];
   if (cached) return cached;

   let expr = "";

   let termStart = -1,
      quoteStart = 0,
      term: string,
      bracketsOpen = 0,
      percentSign: boolean = false;

   for (let i = 0; i < str.length; i++) {
      switch (str[i]) {
         case "{":
            if (termStart < 0) {
               if (str[i + 1] == "{" && str[i - 1] != "%") {
                  expr = plus(expr) + quoteStr(str.substring(quoteStart, i) + "{");
                  i++;
                  quoteStart = i + 1;
               } else {
                  termStart = i + 1;
                  percentSign = str[i - 1] == "%";
                  if (i > quoteStart) expr = plus(expr) + quoteStr(str.substring(quoteStart, percentSign ? i - 1 : i));
                  bracketsOpen = 1;
                  quoteStart = i; // for the case where the brackets are not closed
               }
            } else bracketsOpen++;
            break;

         case "}":
            if (termStart >= 0) {
               if (--bracketsOpen == 0) {
                  term = str.substring(termStart, i);
                  if (term.indexOf(":") == -1) {
                     let nullSepIndex = term.indexOf("|");
                     if (nullSepIndex == -1) term += ":s";
                     else term = term.substring(0, nullSepIndex) + ":s" + term.substring(nullSepIndex);
                  }
                  expr = plus(expr) + (percentSign ? "%{" : "{") + term + "}";
                  termStart = -1;
                  quoteStart = i + 1;
                  bracketsOpen = 0;
               }
            } else if (str[i + 1] == "}") {
               expr = plus(expr) + quoteStr(str.substring(quoteStart, i) + "}");
               i++;
               quoteStart = i + 1;
            }
            break;
      }
   }

   if (quoteStart < str.length || expr.length == 0) expr = plus(expr) + quoteStr(str.substring(quoteStart));

   return (tplCache[str] = expression(expr));
}

export const StringTemplate = {
   get: function (str: string) {
      return stringTemplate(str);
   },

   compile: function (str: string) {
      return stringTemplate(str).memoize();
   },

   format: function (format: string, ...args: any[]) {
      return stringTemplate(format)(args);
   },
};

let tplCache: Record<string, MemoSelector> = {};

let getTplCache = () => tplCache;

export function invalidateStringTemplateCache() {
   tplCache = {};
}

export function setGetStringTemplateCacheCallback(callback: () => Record<string, MemoSelector>) {
   getTplCache = callback;
}
