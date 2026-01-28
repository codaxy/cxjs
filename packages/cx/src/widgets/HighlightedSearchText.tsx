/** @jsxImportSource react */
import { Instance } from "../ui/Instance";
import type { RenderingContext } from "../ui/RenderingContext";
import { Widget, WidgetConfig } from "../ui/Widget";
import { getSearchQueryHighlighter } from "../util/getSearchQueryPredicate";
import { StringProp, Prop } from "../ui/Prop";

export interface HighlightedSearchTextConfig extends WidgetConfig {
   /** Search query used to highlight matching text. */
   query?: StringProp;

   /** Text content to be searched and highlighted. */
   text?: StringProp;

   /** Pre-computed text chunks where odd-indexed chunks are highlighted. */
   chunks?: Prop<string[]>;
}

export class HighlightedSearchText extends Widget<HighlightedSearchTextConfig> {
   constructor(config?: HighlightedSearchTextConfig) {
      super(config);
   }

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
