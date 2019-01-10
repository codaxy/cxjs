import {Button, HtmlElement, TextField, Checkbox, Select, LabeledContainer, PureContainer, Menu} from 'cx/widgets';
import {ContentPlaceholder, Content} from 'cx/ui';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ImportPath} from 'docs/components/ImportPath';

var AppLayout = <cx>
    <div style={{height: '200px', width: '300px', display: 'flex', flexDirection: 'column', border: '1px solid black'}}>
        <header style={{background: "lightblue", padding: '5px'}}>App Header</header>
        <div style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
            <aside style={{width: '70px', background: 'white', padding: '5px'}}>
                <ContentPlaceholder name="sidebar"/>
            </aside>
            <main style={{flex: 1, padding: '5px'}}>
                <ContentPlaceholder /* name="body" */ />
            </main>
        </div>
    </div>
</cx>;


export const OuterLayouts = <cx>

    <Md>
        # Outer Layouts

        Outer layouts are used to wrap the content being rendered into a frame, e.g. to add a header and a footer.
        This is very convenient for defining global application layouts and should not be confused with [Inner Layouts](~/concepts/inner-layouts).

        An outer layout is a simple widget tree which uses the `ContentPlaceholder` widget to specify content insertion points.
        The layout can be assigned to any widget using the `outerLayout` attribute (please see the example below).

        ## ContentPlaceholder
        <ImportPath path="import {ContentPlaceholder} from 'cx/ui';" />

        `ContentPlaceholder` elements are used to specify content insertion points inside outer layouts.
        If multiple placeholders are needed, you should assign each content placeholder a different `name`.
        Name `body` is reserved for the place where the actual widget will be rendered.

        ## Content
        <ImportPath path="import {Content} from 'cx/ui';" />

        <CodeSplit>
            The `Content` widget is used to define contents that will be plugged into placeholders. Use `for` or `name`
            to specify in which placeholder contents will go.

            The following example shows the basic usage of outer layouts implemented using inline styles and flex based
            CSS layouts.

            <div class="widgets">
                <div outerLayout={AppLayout}>
                    <Content for="sidebar">
                        Nav 1
                    </Content>
                    Main 1
                </div>
                <div outerLayout={AppLayout}>
                    <div putInto="sidebar">
                        Nav 2
                    </div>
                    Main 2
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="BzPHusws">{`
               var AppLayout = <cx>
                  <div style={{height: '200px', width: '300px', display: 'flex', flexDirection: 'column', border: '1px solid black'}}>
                     <header style={{background: "lightblue", padding: '5px'}}>App Header</header>
                     <div style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
                        <aside style={{width: '70px', background: 'white', padding: '5px'}}>
                           <ContentPlaceholder name="sidebar" />
                        </aside>
                        <main style={{flex: 1, padding: '5px'}}>
                           <ContentPlaceholder /* name="body" *//>
                        </main>
                     </div>
                  </div>
               </cx>;
               ...
               <div outerLayout={AppLayout}>
                  <Content for="sidebar">
                     Nav 1
                  </Content>
                  Main 1
               </div>
               ...
               <div outerLayout={AppLayout}>
                  <Content for="sidebar">
                     Nav 2
                  </Content>
                  Main 2
               </div>

            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Instead of using the `Content` widget, alternatively, you can define `putInto` or `contentFor` attribute for any Cx widget or HTML element to specify the name of the content placeholder that should render it.

        <CodeSplit>
            <CodeSnippet>{`
                <div outerLayout={AppLayout}>
                    <div putInto="sidebar">
                       Nav 3
                    </div>
                    Main 3
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        When using outer layouts, the content is rendered inside out. A layout can contain other layouts, which
        enables better code reuse.
    </Md>

</cx>;

