export = Cx;
export as namespace Cx;

declare namespace Cx {

    interface WidgetProps {
        layout?: any,
        outerLayout?: any,
        putInto?: string,
        contentFor?: string,
        controller?: any
    }

    interface Binding {
        bind?: string,
        tpl?: string,
        expr?: string
    }

    interface PureContainerProps extends WidgetProps {
        ws?: boolean
    }

    type Selector<T> = (data: any) => T;

    interface StyledContainerProps extends PureContainerProps {
        class?: string | Binding | Selector<string>,
        className?: string | Binding | Selector<string>,
        style?: any,
    }

    class Widget<P extends WidgetProps> {
        props: P;
        state: any;
        context: any;
        refs: any;

        constructor(props: P);

        render();

        setState(state: any);

        forceUpdate();
    }

    interface HtmlElementProps extends StyledContainerProps {
        id?: string | number | Binding | Selector<string | number>,
        text?: string | number | Binding | Selector<string | number>
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            cx: any
        }
    }
}

import * as React from 'react';

declare module "react" {
    interface HTMLProps<T> extends Cx.PureContainerProps {
        class?: string
    }
}