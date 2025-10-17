import { Instance, RenderingContext } from "src/ui";
import { Widget } from "../ui/Widget";
import { getSearchQueryHighlighter } from "../util/getSearchQueryPredicate";

export class HighlightedSearchText extends Widget {
   declareData(...args: Record<string, unknown>[]) {
      super.declareData(...args, {
         text: undefined,
         chunks: undefined,
         query: undefined,
      });
   }

   render(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      let { data } = instance;
      let { text, chunks, query, classNames, style } = data;

      if (!chunks && text && query) {
         let highlighter = getSearchQueryHighlighter(query, { cache: true });
         chunks = highlighter(text);
      }

      if (!chunks) return text;
      return chunks.map((text: string, i: number) => {
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
HighlightedSearchText.prototype.baseClass = "highlightedsearchtext";
