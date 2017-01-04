import { HtmlElement } from 'cx/widgets';
import { Widget, VDOM } from 'cx/ui';
import {removeCommonIndent} from './removeCommonIndent';

import {highlight} from "illuminate-js";

function lazyHighlight(text, lang) {
    var cache;
    return () => {
        if (typeof cache == 'undefined') {
            var withoutIndent = removeCommonIndent(text);
            cache = highlight(withoutIndent, lang);
        }
        return cache;
    }
}

export class CodeSnippet extends HtmlElement {

    render(context, instance, key) {
        let {data} = instance;
        return <pre key={key} className={`${data.classNames} language-${this.lang}`}>
         {this.renderChildren(context, instance)}
      </pre>
    }

    add(text) {
        if (typeof text != 'string')
            return super.add(...arguments);

        super.add({
            type: HtmlElement,
            innerHtml: lazyHighlight(text, this.lang),
            tag: 'code',
            class: `language-${this.lang}`
        });
    }
}

CodeSnippet.prototype.plainText = true;
CodeSnippet.prototype.tag = 'pre';
CodeSnippet.prototype.lang = 'jsx';
CodeSnippet.prototype.baseClass = 'codesnippet';
CodeSnippet.prototype.CSS = 'dx';
