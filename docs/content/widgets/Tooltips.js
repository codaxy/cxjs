import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {TextField} from 'cx/ui/form/TextField';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Grid} from 'cx/ui/grid/Grid';
import {Controller} from 'cx/ui/Controller';
import {casual} from '../examples/data/casual';

import configs from './configs/Tooltip';

class PageController extends Controller {
   init() {
      super.init();

      this.store.set('$page.records', Array.from({length: 5}).map((v, i)=>({
         id: i+1,
         fullName: casual.full_name,
         phone: casual.phone,
         city: casual.city,
         notified: casual.coin_flip
      })));
   }
}

export const Tooltips = <cx>
   <Md>
      <CodeSplit>

      # Tooltips

      Tooltips provide additional information related to the pointed element.

         <div class="widgets" controller={PageController}>
            <div tooltip="This is a tooltip." style="margin: 50px">
               Basic
            </div>

            <div tooltip={{ placement: 'up', text: "This tooltip is displayed on top, unless you scroll..." }} style="margin: 50px">
               Displayed on top!
            </div>

            <div tooltip={{ placement: 'up', title: 'Hello', text: "It seems that you're really interested in tooltips." }} style="margin: 50px">
               Title
            </div>

            <TextField value:bind="$page.text" required visited placeholder="Validation" tooltip="Tooltips are commonly used to show validation errors on form elements." />

            <TextField value:bind="$page.text" required visited placeholder="More Validation" errorTooltip={{placement: 'up', alwaysVisible: true, title: "Validation Error"}} />

            <div style="padding: 10px" tooltip={{ mouseTrap: true, items: <cx><Md>
               Tooltips can contain any content. For example, we can add [a link to the overlays page](~/widgets/overlays) or **make some text bold** because
               we're using markdown here. Any other component can be used here too, however tooltips work best with text and images.

               Please note that tooltip elements are appended to the `body` element so only the global style rules apply.

               In order to click on a link inside the tooltip, tooltip needs to trap the mouse so it doesn't disappear.

               </Md></cx> }}>
               Rich content
            </div>

            <div style="margin: 50px" tooltip={{ mouseTrap: true, items: <cx>
                  <Grid columns={[
                  { field: 'fullName', header: 'Name', sortable: true },
                  { field: 'phone', header: 'Phone' }
                  ]} records:bind="$page.records"/>
               </cx>}}>
               Component inside
            </div>

            <div tooltip={{ alwaysVisible: { bind: '$page.showTooltip'}, placement: 'down', text: "Tooltips can be set to be always visible." }} style="margin: 50px">
               <Checkbox value:bind="$page.showTooltip">Always visible</Checkbox>
            </div>

            <div tooltip={{ visible: { bind: '$page.tooltipVisible'}, alwaysVisible: { bind: '$page.tooltipVisible'}, placement: 'down', text: "This tooltip is visible only while the checkbox is checked." }} style="margin: 50px">
               <Checkbox value:bind="$page.tooltipVisible">Controlled visibility</Checkbox>
            </div>

         </div>

         <CodeSnippet putInto="code">{`
            <div class="widgets" controller={PageController}>
               <div tooltip="This is a tooltip." style="margin: 50px">
                  Basic
               </div>

               <div tooltip={{ placement: 'up', text: "This tooltip is displayed on top, unless you scroll..." }} style="margin: 50px">
                  Displayed on top!
               </div>

               <div tooltip={{ placement: 'up', title: 'Hello', text: "It seems that you're really interested in tooltips." }} style="margin: 50px">
                  Title
               </div>

               <TextField value:bind="$page.text" required placeholder="Validation" tooltip="Tooltips are commonly used to show validation errors on form elements." />

               <TextField value:bind="$page.text" required placeholder="More Validation" errorTooltip={{placement: 'up', alwaysVisible: true, title: "Validation Error"}} />

               <div style="padding: 10px" tooltip={{ mouseTrap: true, items: <cx><Md>
                  Tooltips can contain any content. For example, we can add [a link to the overlays page](~/widgets/overlays) or **make some text bold** because
                  we're using markdown here. Any other component can be used here too, however tooltips work best with text and images.

                  Please note that tooltip elements are appended to the \`body\` element so only the global style rules apply.

                  In order to click on a link inside the tooltip, tooltip needs to trap the mouse so it doesn't disappear.

                  </Md></cx> }}>
                  Rich content
               </div>

               <div style="margin: 50px" tooltip={{ mouseTrap: true, items: <cx>
                     <Grid columns={[
                     { field: 'fullName', header: 'Name', sortable: true },
                     { field: 'phone', header: 'Phone' }
                     ]} records:bind="$page.records"/>
                  </cx>}}>
                  Component inside
               </div>

               <div tooltip={{ alwaysVisible: { bind: '$page.showTooltip'}, placement: 'down', text: "Tooltips can be set to be always visible." }} style="margin: 50px">
                  <Checkbox value:bind="$page.showTooltip">Always visible</Checkbox>
               </div>

               <div tooltip={{ visible: { bind: '$page.tooltipVisible'}, alwaysVisible: { bind: '$page.tooltipVisible'}, placement: 'down', text: "This tooltip is visible only while the checkbox is checked." }} style="margin: 50px">
                  <Checkbox value:bind="$page.tooltipVisible">Controlled visibility</Checkbox>
               </div>

            </div>
            ...
            class PageController extends Controller {
               init() {
                  super.init();

                  this.store.set('$page.records', Array.from({length: 5}).map((v, i)=>({
                     id: i+1,
                     fullName: casual.full_name,
                     phone: casual.phone,
                     city: casual.city,
                     notified: casual.coin_flip
                  })));
               }
            }
         `}</CodeSnippet>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={configs} />
   </Md>
</cx>