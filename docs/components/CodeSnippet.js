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
        let {data} = instance,
            fiddleLink;


        if (this.fiddle) {
            fiddleLink = (
                <a
                    href={`http://cxjs.io/fiddle/?f=${this.fiddle}`}
                    className={this.CSS.element(this.baseClass, 'link')}
                    target="_blank"
                >
                    Cx Fiddle
                </a>
            )
        }

        return (
            <div key={key} className={data.classNames}>
                <pre className={`language-${this.lang}`}>
                    {this.renderChildren(context, instance)}
                </pre>
                {fiddleLink}
            </div>);
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
