import {Button, Content, HtmlElement, TextField, Checkbox, Select, LabeledContainer, PureContainer} from 'cx/widgets';
import {
    ContentPlaceholder,
    Controller,
    LabelsLeftLayout,
    LabelsTopLayout,
    FirstVisibleChildLayout,
    UseParentLayout
} from 'cx/ui';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ImportPath} from 'docs/components/ImportPath';


class FetchController extends Controller {
    fetch() {
        this.store.set('$page.fetch.status', 'LOADING');
        setTimeout(() => {
            if (Math.random() > 0.5) {
                this.store.set('$page.fetch.status', 'SUCCESS');
                this.store.set('$page.fetch.result', Math.random() * 100);
            } else {
                this.store.set('$page.fetch.status', 'ERROR');
            }
        }, 1000);
    }
}

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

        A layout is a simple widget tree. `ContentPlaceholder` elements are used to specify content insertion points.

        To assign an outer layout to a widget specify the `outerLayout` attribute.

        Within the widget, use the `Content` widget to define sections other than body.

        The following example shows basic usage of layouts implemented using inline styles and flex.

        <CodeSplit>

            <div class="widgets">
                <div outerLayout={AppLayout}>
                    <Content name="sidebar">
                        Nav 1
                    </Content>
                    Main 1
                </div>
                <div outerLayout={AppLayout}>
                    <Content name="sidebar">
                        Nav 2
                    </Content>
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

        When using outer layouts, the content is rendered inside out. A layout can contain other layouts, which
        enables better code reuse.

    </Md>

</cx>;

