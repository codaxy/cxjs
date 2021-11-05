import {Button, Content, HtmlElement, TextField, Checkbox, Select, LabeledContainer, PureContainer, Radio, TextArea} from 'cx/widgets';
import {
    ContentPlaceholder,
    Controller,
    LabelsLeftLayout,
    LabelsTopLayoutCell,
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


export const InnerLayouts = <cx>

    <Md>
        # Inner Layouts

        Inner layouts define how widget's children are laid out. If no layout is specified,
        children are rendered in the same order as how they are defined in the widget tree.

        Inner layouts are set using the `layout` attribute.

        ## Default Layout (No Layout)

        In this layout, no special arrangement on the children is made. Elements are laid out in the same
        order as they are specified.

        <CodeSplit>

            Some widgets consist of multiple parts, such as form fields. If there is no layout,
            the parts will be laid down in the same order how they are defined in the `render` method.
            For a form field, the label will be displayed first and the input will follow.

            <div class="widgets">
                <div trimWhitespace={false}>
                    First some text.
                    <TextField value:bind="$page.text" label="Label 1"/>
                    <Checkbox value:bind="$page.check" label="Label 2">Checkbox</Checkbox>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="BSktMPwa">{`
               <div trimWhitespace={false}>
                  First some text.
                  <TextField value:bind="$page.text" label="Label 1" />
                  <Checkbox value:bind="$page.check" label="Label 2">Checkbox</Checkbox>
               </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        This layout does not work very well for form elements.

        ## LabelsLeftLayout

        <ImportPath path="import {LabelsLeftLayout} from 'cx/ui';" />

        `LabelsLeftLayout` is used to get horizontal form layouts. In this layout
        all children content is rendered inside a table where labels go into the first column, while
        inputs and other content go into the second column.

        <CodeSplit>

            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    First some text.
                    <TextField value:bind="$page.text" label="Label 1"/>
                    <Checkbox value:bind="$page.check" label="Label 2">Checkbox</Checkbox>
                    <LabeledContainer label="Label 3" trimWhitespace={false}>
                        <TextField value:bind="$page.text"/>
                        <TextField value:bind="$page.text"/>
                    </LabeledContainer>
                </div>
            </div>

            The [`LabeledContainer`](~/widgets/labeled-containers) control can be used when multiple
            widgets need to be placed on the right side.

            <Content name="code">
                <CodeSnippet fiddle="48FYzkPT">{`
               <div layout={LabelsLeftLayout}>
                  First some text.
                  <TextField value:bind="$page.text" label="Label 1" />
                  <Checkbox value:bind="$page.check" label="Label 2">Checkbox</Checkbox>
                  <LabeledContainer label="Label 3" trimWhitespace={false}>
                     <TextField value:bind="$page.text" />
                     <TextField value:bind="$page.text" />
                  </LabeledContainer>
               </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        <CodeSplit>

            ## LabelsTopLayout

            <ImportPath path="import {LabelsTopLayout, LabelsTopLayoutCell} from 'cx/ui';" />

            `LabelsTopLayout` is used for dense forms with very long labels or when labels are put on top in order to save some space.

            This layout is also implemented using an HTML `table` element with two rows.
            The first row contains all of the labels while the second row contains inputs along with other content.
            When labels are too long they need to be broken down into multiple lines.
            To preserve the visual layout, labels are bottom aligned.

            <div class="widgets">
                <div>
                    <div layout={LabelsTopLayout}>
                        <Select value:bind="$page.title" label="Title" style={{width: "70px"}}>
                            <option value="Mr">Mr.</option>
                            <option value="Mrs">Mrs.</option>
                        </Select>
                        <TextField value:bind="$page.firstName" label="Name" placeholder="First Name"
                            style={{width: '150px'}}/>
                        <TextField value:bind="$page.lastName" placeholder="Last Name" style={{width: '150px'}}/>
                    </div>
                    <div layout={LabelsTopLayout}>
                        <TextField value:bind="$page.street" label="Address" placeholder="Street"
                            style={{width: '150px'}}/>
                        <TextField value:bind="$page.city" placeholder="City" style={{width: '150px'}}/>
                        <TextField value:bind="$page.zip" placeholder="Zip" style={{width: '70px'}}/>
                    </div>
                </div>
            </div>

            Set the `width` style on form fields to align inputs properly.

            Again, you may use the LabeledContainer control to group multiple widgets under a single label.

            <Content name="code">
                <CodeSnippet fiddle="as225Fml">{`
                <div>
                    <div layout={LabelsTopLayout}>
                        <Select value:bind="$page.title" label="Title" style={{width: "70px"}}>
                            <option value="Mr">Mr.</option>
                            <option value="Mrs">Mrs.</option>
                        </Select>
                        <TextField value:bind="$page.firstName" label="Name" placeholder="First Name" style={{width: '150px'}} />
                        <TextField value:bind="$page.lastName" placeholder="Last Name" style={{width: '150px'}}/>
                    </div>
                    <div layout={LabelsTopLayout}>
                        <TextField value:bind="$page.street" label="Address" placeholder="Street" style={{width: '150px'}} />
                        <TextField value:bind="$page.city" placeholder="City" style={{width: '150px'}}/>
                        <TextField value:bind="$page.zip" placeholder="Zip" style={{width: '70px'}}/>
                    </div>
                </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### Vertical Mode

        `LabelsTopLayout` can also be used in `vertical` mode where each field takes one row.

        <CodeSplit>

            <div class="widgets">
                <div layout={{type: LabelsTopLayout, vertical: true}}>
                    <Select value:bind="$page.title" label="Title" style={{width: "70px"}}>
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                    </Select>
                    <TextField value:bind="$page.firstName" label="Name" placeholder="First Name"
                        style={{width: '150px'}}/>
                    <TextField value:bind="$page.lastName" placeholder="Last Name" style={{width: '150px'}}/>
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="A8jOOZEn">{`
                <div layout={{ type: LabelsTopLayout, vertical: true }}>
                    <Select value:bind="$page.title" label="Title" style={{width: "70px"}}>
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                    </Select>
                    <TextField value:bind="$page.firstName" label="Name" placeholder="First Name"
                        style={{width: '150px'}}/>
                    <TextField value:bind="$page.lastName" placeholder="Last Name" style={{width: '150px'}}/>
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        ### Multiple Columns

        `LabelsTopLayout` can render fields in multiple `columns`.

        <CodeSplit>

            <div class="widgets">
                <div layout={{type: LabelsTopLayout, columns: 3}}>
                    <TextField label="Field1" value:bind="$page.field1" />
                    <TextField label="Field2" value:bind="$page.field2" />
                    <TextField label="Field3" value:bind="$page.field3" />
                    <TextField label="Field4" value:bind="$page.field4" />
                    <TextField label="Field5" value:bind="$page.field5" />
                    <TextField label="Field6" value:bind="$page.field6" />
                    <TextField label="Field7" value:bind="$page.field7" />
                    <TextField label="Field8" value:bind="$page.field8" />
                    <TextField label="Field9" value:bind="$page.field9" />
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="KDv9Bvao">{`
                <div layout={{type: LabelsTopLayout, columns: 3}}>
                    <TextField label="Field1" value:bind="$page.field1" />
                    <TextField label="Field2" value:bind="$page.field2" />
                    <TextField label="Field3" value:bind="$page.field3" />
                    <TextField label="Field4" value:bind="$page.field4" />
                    <TextField label="Field5" value:bind="$page.field5" />
                    <TextField label="Field6" value:bind="$page.field6" />
                    <TextField label="Field7" value:bind="$page.field7" />
                    <TextField label="Field8" value:bind="$page.field8" />
                    <TextField label="Field9" value:bind="$page.field9" />
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        Use `LabelsTopLayoutCell` to achieve complex layouts in which some fields span across multiple columns or rows.

        <CodeSplit>

            <div class="widgets">
                <LabelsTopLayout columns={2} mod="fixed" style="width: 300px">
                    <TextField label="Field1" value-bind="$page.field1" style="width: 100%"/>
                    <LabelsTopLayoutCell rowSpan={2} style="padding-left: 16px">
                        <LabeledContainer label="Field2">
                            <Radio value-bind="$page.field2" option={1}>Option 1</Radio>
                            <Radio value-bind="$page.field2" option={2}>Option 2</Radio>
                            <Radio value-bind="$page.field2" option={3}>Option 3</Radio>
                        </LabeledContainer>
                    </LabelsTopLayoutCell>
                    <TextField label="Field3" value-bind="$page.field3" style="width: 100%"/>
                    <LabelsTopLayoutCell colSpan={2}>
                        <TextArea label="Field4" value-bind="$page.field8" style="width: 100%" rows={5}/>
                    </LabelsTopLayoutCell>
                    <TextField label="Field5" value-bind="$page.field5" style="width: 100%"/>
                    <TextField label="Field6" value-bind="$page.field6" style="width: 100%"/>
                </LabelsTopLayout>
            </div>

        <CodeSnippet putInto="code" fiddle="q6e8DVQV">{`
            <div class="widgets">
                <LabelsTopLayout columns={2} mod="fixed" style="width: 300px">
                    <TextField label="Field1" value-bind="$page.field1" style="width: 100%"/>
                    <LabelsTopLayoutCell rowSpan={2} style="padding-left: 16px">
                        <LabeledContainer label="Field2">
                            <Radio value-bind="$page.field2" option={1}>Option 1</Radio>
                            <Radio value-bind="$page.field2" option={2}>Option 2</Radio>
                            <Radio value-bind="$page.field2" option={3}>Option 3</Radio>
                        </LabeledContainer>
                    </LabelsTopLayoutCell>
                    <TextField label="Field3" value-bind="$page.field3" style="width: 100%"/>
                    <LabelsTopLayoutCell colSpan={2}>
                        <TextArea label="Field4" value-bind="$page.field8" style="width: 100%" rows={5}/>
                    </LabelsTopLayoutCell>
                    <TextField label="Field5" value-bind="$page.field5" style="width: 100%"/>
                    <TextField label="Field6" value-bind="$page.field6" style="width: 100%"/>
                </LabelsTopLayout>
            </div>
        `}</CodeSnippet>
        </CodeSplit>


        <CodeSplit>

            ## FirstVisibleChildLayout

            <ImportPath path="import {FirstVisibleChildLayout} from 'cx/ui';" />

            The `FirstVisibleChildLayout` is used when you want to display a single child at a time.
            Think of this layout as a complex `if ... else ...` statement.

            The following example shows how to use this layout for an asynchronous loading operation.

            <div class="widgets">
                <div controller={FetchController}>
                    <div layout={FirstVisibleChildLayout}>
                        <div visible:expr='{$page.fetch.status} == "LOADING"' style={{color: 'gray'}}>Loading...</div>
                        <div visible:expr='{$page.fetch.status} == "ERROR"' style={{color: 'red'}}>Error occurred while
                            loading data.
                        </div>
                        <div visible:expr='{$page.fetch.status} == "SUCCESS"' style={{color: 'green'}}
                            text-tpl="Success! Result: {$page.fetch.result:n;2}."></div>
                        <div style={{color: 'gray'}}>Data not loaded yet.</div>
                    </div>
                    <Button onClick="fetch" disabled:expr='{$page.fetch.status} == "LOADING"'>
                        Fetch
                    </Button>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="swXFJlhe">{`
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
               ...
               <div controller={FetchController}>
                  <div controller={FetchController}>
                     <div layout={FirstVisibleChildLayout}>
                        <div visible:expr='{$page.fetch.status} == "LOADING"' style={{color: 'gray'}}>Loading...</div>
                        <div visible:expr='{$page.fetch.status} == "ERROR"' style={{color: 'red'}}>Error occurred while loading data.</div>
                        <div visible:expr='{$page.fetch.status} == "SUCCESS"' style={{color: 'green'}} text-tpl="Success! Result: {$page.fetch.result:n;2}."></div>
                        <div style={{color: 'gray'}}>Data not loaded yet.</div>
                     </div>
                     <Button onClick="fetch" disabled:expr='{$page.fetch.status} == "LOADING"'>Fetch</Button>
                  </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Initially, `page.fetch.status` is undefined, so the first three `div` elements will not be visible and the
        default message will appear.

        After you click Fetch, the default message disappears and the loading message will display until the result is
        fetched.
        The default message will disappear even if it does not have `visible:expr` set.
        That happens because the layout stops processing content after the first child is rendered,
        in this case it being the loading message `div`.

        ## UseParentLayout

        <ImportPath path="import {UseParentLayout} from 'cx/ui';" />

        `UseParentLayout` is not considered a real layout. It is an instruction that the widget should use parent's layout instead of
        its own. `UseParentLayout` can be used only on widgets which render only its
        children and do not add any markup (pure containers). `UseParentLayout` is commonly used with `LabelsTopLayout` or `LabelsLeftLayout`
        as parent layouts.

        <CodeSplit>
            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <TextField value:bind="$page.text" label="Label 1"/>
                    <Checkbox value:bind="$page.showSection1">Show More</Checkbox>
                    <PureContainer layout={UseParentLayout} visible:bind="$page.showSection1">
                        <TextField value:bind="$page.text" label="Label 1"/>
                        <TextField value:bind="$page.text" label="Label 2"/>
                        <Checkbox value:bind="$page.showSection2">Show More</Checkbox>
                        <PureContainer layout={UseParentLayout} visible:bind="$page.showSection2">
                            <TextField value:bind="$page.text" label="Label 3"/>
                            <TextField value:bind="$page.text" label="Label 4"/>
                        </PureContainer>
                    </PureContainer>
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="l31l5PN9">{`
                <div layout={LabelsLeftLayout}>
                    <Checkbox value:bind="$page.showSection1">Section 1</Checkbox>
                    <PureContainer layout={UseParentLayout} visible:bind="$page.showSection1">
                        <TextField value:bind="$page.text" label="Label 1"/>
                        <TextField value:bind="$page.text" label="Label 2"/>
                        <Checkbox value:bind="$page.showSection2">Section 2</Checkbox>
                        <PureContainer layout={UseParentLayout} visible:bind="$page.showSection2">
                            <TextField value:bind="$page.text" label="Label 3"/>
                            <TextField value:bind="$page.text" label="Label 4"/>
                        </PureContainer>
                    </PureContainer>
                </div>`}
            </CodeSnippet>
        </CodeSplit>

        Notice how the widget tree being deeply nested still renders as a simple list of elements that share the
        same layout.

        ## Outer Layouts

        For defining global application layouts, check out the [Outer Layouts](~/concepts/outer-layouts) page.

    </Md>

</cx>;

