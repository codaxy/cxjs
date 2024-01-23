import { HtmlElement, Toast } from "cx/widgets";
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
            onClick={this.copyToClipboard.bind(this)}
            title="Copy code to clipboard"
         >
            <div className="flex flex-row" style={{ alignItems: "center", gap: "0.4rem" }}>
               <i className="fa fa-clone"></i>{' '}
               Copy
            </div>
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
      navigator.clipboard.writeText(this.code).then(() => {
         Toast.create({
            message: "Copied to clipboard.",
            placement: "bottom-right",
            timeout: 2000,
            style: {
               fontSize: "1rem",
               padding: "8px 14px"
            }
         }).open();
      }).catch(() => {
         Toast.create({
            message: "Can't copy to clipboard!",
            placement: "bottom-right",
            timeout: 2000,
            mod: "error",
            style: {
               fontSize: "1rem",
               padding: "8px 14px"
            }
         }).open();
      });
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
