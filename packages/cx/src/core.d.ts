export = Cx;
export as namespace Cx;

import * as React from 'react';

declare namespace Cx {

    interface Binding {
        bind?: string,
        tpl?: string,
        expr?: string
    }

    type Selector<T> = (data: any) => T;

    type Prop<T> = T | Binding | Selector<T>;

    interface Structure {
        [key: string]: Prop<any>
    }

    type StringProp = Prop<string>;
    type StyleProp = Prop<string | React.CSSProperties>;
    type NumberProp = Prop<number>;
    type BooleanProp = Prop<boolean>;
    type ClassProp = Prop<string | Structure>;

    interface WidgetProps {
        layout?: any,
        outerLayout?: any,
        putInto?: string,
        contentFor?: string,
        controller?: any
    }

    interface PureContainerProps extends WidgetProps {
        ws?: boolean
    }

    interface StyledContainerProps extends PureContainerProps {
        class?: ClassProp,
        className?: ClassProp,
        style?: StyleProp,
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



declare module "react" {
    interface HTMLProps<T> extends Cx.PureContainerProps {
        class?: Cx.ClassProp
    }
}