import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {ContentPlaceholder} from 'cx/ui/layout/ContentPlaceholder';

import {Controller} from 'cx/ui/Controller';
import {TextField} from 'cx/ui/form/TextField';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Select} from 'cx/ui/form/Select';
import {LabeledContainer} from 'cx/ui/form/LabeledContainer';

import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {LabelsTopLayout} from 'cx/ui/layout/LabelsTopLayout';
import {FirstVisibleChildLayout} from 'cx/ui/layout/FirstVisibleChildLayout';

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
            <ContentPlaceholder name="sidebar" />
         </aside>
         <main style={{flex: 1, padding: '5px'}}>
            <ContentPlaceholder /* name="body" *//>
         </main>
      </div>
   </div>
</cx>;


export const Layouts = <cx>

   <Md>
      # Layouts

      Word *layout* is commonly used for different things. `Cx` has concepts of inner and outer layouts.

      ## Inner Layouts

      Inner layouts define how widget's children are laid out. If no layout is specified,
      children are put in the same way as defined in the widget tree.

      Inner layouts are set using the `layout` attribute.

      ### Default Layout (No Layout)

      In this layout no special arrangement on the children is made. Elements are laid out in the same
      order as they are specified.

      <CodeSplit>

         For complex widgets which report multiple top-level elements, elements
         are laid down sequentially in the same order as defined in the `render` method. For form elements,
         this means that the label will be displayed first and the input will follow.

         <div class="widgets">
            <div trimWhitespace={false}>
               First some text.
               <TextField value:bind="$page.text" label="Label 1" />
               <Checkbox value:bind="$page.check" label="Label 2">Checkbox</Checkbox>
            </div>
         </div>

         <Content name="code">
            <CodeSnippet>{`
               <div trimWhitespace={false}>
                  First some text.
                  <TextField value:bind="$page.text" label="Label 1" />
                  <Checkbox value:bind="$page.check" label="Label 2">Checkbox</Checkbox>
               </div>
            `}</CodeSnippet>
         </Content>
      </CodeSplit>

      Obviously, this layout does not work very well for form elements.

      ### LabelsLeftLayout

      You would want to use `LabelsLeftLayout` to get a horizontal form layout. In this layout
      all children content is rendered inside a table, where labels go into the first column, and
      inputs and other content go into the second column.

      <CodeSplit>

         <div class="widgets">
            <div layout={LabelsLeftLayout}>
               First some text.
               <TextField value:bind="$page.text" label="Label 1" />
               <Checkbox value:bind="$page.check" label="Label 2">Checkbox</Checkbox>
               <LabeledContainer label="Label 3" trimWhitespace={false}>
                  <TextField value:bind="$page.text" />
                  <TextField value:bind="$page.text" />
               </LabeledContainer>
            </div>
         </div>

         The `LabeledContainer` control can be used when multiple widgets need to be placed on the right side.

         <Content name="code">
            <CodeSnippet>{`
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

         ### LabelsTopLayout

         `LabelsTopLayout` is used for dense forms with very long labels or when putting labels on top might
         save some space.

         This layout is also implemented using an HTML `table` element with two rows.
         The first row contains all labels and the second rows contains inputs and other content.
         Notice that labels are bottom aligned, even if some labels break to two rows (*hint*: set the width on the label too).

         <div class="widgets">
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
         </div>

         Set the `width` style on form fields to align inputs properly.

         Again, you may use the `LabeledContainer` control to group multiple widgets under a single label.

         <Content name="code">
            <CodeSnippet>{`
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



      <CodeSplit>

         ### FirstVisibleChildLayout

         The `FirstVisibleChildLayout` is used for scenarios when only one child needs to be displayed.
         Think of this layout as a complex `if ... else ...` statement.

         The following example shows how to use this layout with asynchronous loading operations.

         <div class="widgets">
            <div controller={FetchController}>
               <div layout={FirstVisibleChildLayout}>
                  <div visible:expr='{$page.fetch.status} == "LOADING"' style={{color: 'gray'}}>Loading...</div>
                  <div visible:expr='{$page.fetch.status} == "ERROR"' style={{color: 'red'}}>Error occurred while loading data.</div>
                  <div visible:expr='{$page.fetch.status} == "SUCCESS"' style={{color: 'green'}} text:tpl="Success! Result: {$page.fetch.result:n}."></div>
                  <div style={{color: 'gray'}}>Data not loaded yet.</div>
               </div>
               <button type="button" onClick="fetch" disabled:expr='{$page.fetch.status} == "LOADING"'>Fetch</button>
            </div>
         </div>

         <Content name="code">
            <CodeSnippet>{`
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
                        <div visible:expr='{$page.fetch.status} == "SUCCESS"' style={{color: 'green'}} text:tpl="Success! Result: {$page.fetch.result:n}."></div>
                        <div style={{color: 'gray'}}>Data not loaded yet.</div>
                     </div>
                     <button type="button" onClick="fetch" disabled:expr='{$page.fetch.status} == "LOADING"'>Fetch</button>
                  </div>
            `}</CodeSnippet>
         </Content>
      </CodeSplit>

      Initially, `page.fetch.status` is undefined, so the first three `div` elements will not be visible and the default
      message will appear.

      After you click Fetch, the default message disappears and loading message is displayed until the result is fetched.
      The default message disappears even if it doesn't have `visible:expr` set because the layout stops rendering after
      the first visible child is rendered which, in this case, is the loading message `div`.
      The same applies after the result is fetched.

      ## Outer Layouts

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
            <CodeSnippet>{`
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

      When using outer layouts, the content is rendered inside out. A layout can use other layout and this
      helps with code reuse.

   </Md>

</cx>;

