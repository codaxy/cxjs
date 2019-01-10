export function removeCommonIndent(text) {
   var lines = text.split('\n');
   var indent = 100000;
   var firstNonEmpty = 100000, lastNonEmpty;
   lines.forEach((l, index)=> {
      for (var i = 0; i < l.length; i++) {
         if (l[i] != ' ') {
            if (i < indent)
               indent = i;
            lastNonEmpty = index;
            if (index < firstNonEmpty)
               firstNonEmpty = index;
            break;
         }
      }
   });

   if (indent == 0)
      return text;

   return lines.filter((v, i)=> (i >= firstNonEmpty && i <= lastNonEmpty))
      .map(l=>(l.length > indent ? l.substring(indent) : ''))
      .join('\n');
}
