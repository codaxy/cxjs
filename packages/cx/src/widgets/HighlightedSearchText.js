import { Widget } from "../ui/Widget";
import { VDOM } from "../ui/VDOM";
import { getSearchQueryHighlighter } from "../util/getSearchQueryPredicate";

export class HighlightedSearchText extends Widget {
   declareData(...args) {
      super.declareData(...args, {
         text: undefined,
         chunks: undefined,
         query: undefined,
      });
   }

   render(context, instance, key) {
      let { data } = instance;
      let { text, chunks, query, classNames, style } = data;

      if (!chunks && text && query) {
         let highligher = getSearchQueryHighlighter(query, { cache: true });
         chunks = highligher(text);
      }

      if (!chunks) return text;
      return chunks.map((text, i) => {
         if (i % 2 == 0) return text;
         return (
            <span key={`${key}-${i}`} className={classNames} style={style}>
               {text}
            </span>
         );
      });
   }
}

HighlightedSearchText.prototype.styled = true;
HighlightedSearchText.prototype.baseClass = "highlighedsearchtext";
