import { escapeSpecialRegexCharacters } from "./escapeSpecialRegexCharacters";

function getTermsAndRegularExpressions(query) {
   if (!query) return [[], []];
   let terms = query.split(" ").filter(Boolean);
   let regexes = terms.map((word) => new RegExp(escapeSpecialRegexCharacters(word), "gi"));
   return [terms, regexes];
}

export function getSearchQueryPredicate(query, options) {
   let [terms, regexes] = getTermsAndRegularExpressions(query);
   if (terms.length == 0) return () => true;
   if (regexes.length == 1) {
      let regex = regexes[0];
      return (text) => text && text.match(regex);
   }
   return (text) => text && regexes.every((re) => text.match(re));
}

var highlighterCache = {};

export function getSearchQueryHighlighter(query, options) {
   let [terms, regexes] = getTermsAndRegularExpressions(query);
   if (terms.length == 0) return (text) => [text];

   if (highlighterCache[query]) return highlighterCache[query];

   let result = (query) => {
      let chunks = [query];
      for (let i = 0; i < regexes.length; i++) {
         let newChunks = [];
         for (let j = 0; j < chunks.length; j++) {
            let at = 0;
            let chunk = chunks[j];
            let parts = chunk.split(regexes[i]);
            for (let k = 0; k < parts.length; k++) {
               newChunks.push(parts[k]);
               at += parts[k].length;
               if (k < parts.length - 1) {
                  newChunks.push(chunk.substr(at, terms[i].length));
                  at += terms[i].length;
               }
            }
         }
         chunks = newChunks;
      }
      return chunks;
   };

   if (options?.cache) {
      highlighterCache[query] = result;
      setTimeout(() => {
         delete highlighterCache[query];
      }, options?.cachePeriod || 5000);
   }

   return result;
}
