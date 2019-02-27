import { ContentPlaceholder, Widget, VDOM, getContent } from 'cx/ui';
import {Md} from './Md';

export class CodeSplit extends Md {
    initHelpers() {
        super.initHelpers({
            right: Widget.create(ContentPlaceholder, {name: 'code', scoped: true})
        })
    }

    exploreCleanup(context, instance) {
        instance.helpers.right.unregisterContentPlaceholder();
    }

    render(context, instance, key) {

        let {data, widget, helpers} = instance;
        let {CSS, baseClass} = widget;
        let right = getContent(helpers.right.vdom);

        return <div key={key} className={CSS.block(widget.baseClass)}>
            <div className={CSS.element(baseClass, "left")} style={data.style}>
                <div>
                    {this.renderChildren(context, instance)}
                </div>
            </div>
            {
                right &&
                <div className={CSS.element(baseClass, "right")}>
                    {right}
                </div>
            }
        </div>
    }
}

CodeSplit.prototype.CSS = 'dx';
CodeSplit.prototype.baseClass = 'codesplit';
CodeSplit.prototype.styled = true;
