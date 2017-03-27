import { escapeSpecialRegexCharacters } from './escapeSpecialRegexCharacters';

export function getSearchQueryPredicate(query, options) {
   if (!query)
      return () => true;

   let terms = query.split(' ').filter(Boolean);
   if (terms.length == 0)
      return () => true;

   let regexes = terms.map(w => new RegExp(escapeSpecialRegexCharacters(w), 'gi'));

   if (regexes.length == 1) {
      let regex = regexes[0];
      return text => text.match(regex);
   }

   return text => regexes.every(re => text.match(re));
}

