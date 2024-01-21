import { HtmlElement } from "cx/widgets";
import { removeCommonIndent } from "./removeCommonIndent";

import { addLanguage, highlight } from "illuminate-js";
import { jsx } from "illuminate-js/lib/languages/jsx";
addLanguage("jsx", jsx);
addLanguage("scss", jsx);

function lazyHighlight(text, lang) {
   var cache;
   return () => {
      if (typeof cache == "undefined") {
         var withoutIndent = removeCommonIndent(text);
         cache = highlight(withoutIndent, lang);
      }
      return cache;
   };
}

export class CodeSnippet extends HtmlElement {
   render(context, instance, key) {
      let { data } = instance;

      const copyBtn = this.copy != false ? (
         <button
            className={this.CSS.element(this.baseClass, "copy")}
            onClick={() => this.copyToClipboard()}
            title="Copy code to clipboard"
         >
            <i className="fa fa-clone"></i>{' '}
            Copy
         </button>
      ) : null;

      const fiddleLink = this.fiddle ? (
         <a
            href={`https://fiddle.cxjs.io/?f=${this.fiddle}`}
            className={this.CSS.element(this.baseClass, "link")}
            target="_blank"
         >
            <i className="fa fa-external-link"></i>
            Cx Fiddle
         </a>
      ) : null;

      return (
         <div key={key} className={data.classNames}>
            <pre className={`language-${this.lang}`}>
               {this.renderChildren(context, instance)}
            </pre>
            {(copyBtn || fiddleLink) &&
               <div className={this.CSS.element(this.baseClass, "actions")}>
                  {copyBtn}
                  {fiddleLink}
               </div>
            }
         </div>
      );
   }

   copyToClipboard() {
      navigator.clipboard.writeText(this.code);
   }

   add(text) {
      if (typeof text != "string") return super.add(...arguments);

      super.add({
         type: HtmlElement,
         innerHtml: lazyHighlight(text, this.lang),
         tag: "code",
         class: `language-${this.lang}`,
      });

      // Store the code string without indent
      this.code = removeCommonIndent(text);
   }
}

CodeSnippet.prototype.plainText = true;
CodeSnippet.prototype.tag = "pre";
CodeSnippet.prototype.lang = "jsx";
CodeSnippet.prototype.baseClass = "codesnippet";
CodeSnippet.prototype.CSS = "dx";
