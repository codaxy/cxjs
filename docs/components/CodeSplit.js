import { PureContainer, ContentPlaceholder, Widget, VDOM, getContent, contentSandbox } from 'cx/ui';
import {Md} from './Md';

export class CodeSplit extends Md {
    initComponents() {
        super.initComponents({
            right: Widget.create(ContentPlaceholder, {name: 'code'})
        })
    }

    declareData() {
        super.declareData(...arguments, {
            style: {
                structured: true
            }
        })
    }

    explore(context, instance) {
        contentSandbox(context, "code", () => {
            super.explore(context, instance);
        });
    }

    render(context, instance, key) {

        let {data, widget, components} = instance;
        let {CSS, baseClass} = widget;
        let right = getContent(components.right.render(context));

        return <div key={key} className={CSS.block(widget.baseClass)}>
            <div className={CSS.element(baseClass, "left")} style={data.style}>
                <div>
                    {this.renderChildren(context, instance)}
                </div>
            </div>
            {
                right &&
                <div className={CSS.element(baseClass, "right")}>
                    <div className={CSS.element(baseClass, "scrollable")}>
                        {right}
                    </div>
                </div>
            }
        </div>
    }
}

CodeSplit.prototype.CSS = 'dx';
CodeSplit.prototype.baseClass = 'codesplit';

