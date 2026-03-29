/** @jsxImportSource react */
import { HtmlElement, HtmlElementConfig } from 'cx/widgets';
import { closest } from 'cx/util';
import { VDOM } from 'cx/ui';
import { StructuredProp } from 'cx/ui';

export interface ScrollResetConfig extends HtmlElementConfig {
    trigger?: StructuredProp;
}

export class ScrollReset extends HtmlElement<ScrollResetConfig> {

    declareData() {
        super.declareData(...arguments, {
            trigger: {
                structured: true
            }
        })
    }

    render(context, instance, key) {
        return (
            <ScrollResetComponent
                key={key}
                instance={instance}
                shouldUpdate={instance.shouldUpdate}
                data={instance.data}
            >
                {this.renderChildren(context, instance)}
            </ScrollResetComponent>
        )
    }
}

class ScrollResetComponent extends VDOM.Component<any> {
    el: HTMLElement | null = null;
    trigger: any;

    shouldComponentUpdate(props: any) {
        return props.shouldUpdate;
    }

    render() {
        var {data} = this.props;
        return <div ref={el => {
            this.el = el
        }} className={data.classNames} style={data.style}>
            {this.props.children}
        </div>
    }

    componentDidMount() {
        this.trigger = this.props.data.trigger;
    }

    componentDidUpdate() {
        var trigger = this.props.data.trigger;
        if (this.trigger != trigger) {
            this.trigger = trigger;
            var parent = closest(this.el, (x: HTMLElement) => x.scrollTop != 0);
            if (parent)
                parent.scrollTop = 0;
        }
    }
}
