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

        Outer layouts define wrapper around the content being rendered. This is very convenient
        when multiple pages need to share a common layout or for defining global application layouts.

        To assign an outer layout to a widget specify the `outerLayout` attribute.

        ### ContentPlaceholder
        <ImportPath path="import {ContentPlaceholder} from 'cx/ui';" />
        
        A layout is a simple widget tree. `ContentPlaceholder` elements are used to specify content insertion points.

        ### Content
        <ImportPath path="import {Content} from 'cx/ui';" />

        <CodeSplit>
            Within the widget, use the `Content` widget to define sections other than body.  

            The following example shows basic usage of layouts implemented using inline styles and flex.

            <div class="widgets">
                <div outerLayout={AppLayout}>
                    <Content name="sidebar">
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
                  <Content name="sidebar">
                     Nav 1
                  </Content>
                  Main 1
               </div>
               ...
               <div outerLayout={AppLayout}>
                  <Content name="sidebar">
                     Nav 2
                  </Content>
                  Main 2
               </div>

            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Alternatively, you can define `putInto` or `contentFor` for any of the Cx widgets or HTML elements to specify the name of the content placeholder that should render it.

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

        ## Inner Layouts

        For defining child elements' layout (e.g. form elements alignment and label placement), check out the [Inner Layouts](~/concepts/inner-layouts) page.

    </Md>

</cx>;

