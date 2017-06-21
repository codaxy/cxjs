import {HtmlElement, TextField, Checkbox, Grid, enableTooltips} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import {casual} from '../examples/data/casual';

import configs from './configs/Tooltip';

class PageController extends Controller {
    init() {
        super.init();

        this.store.set('$page.records', Array.from({length: 5}).map((v, i) => ({
            id: i + 1,
            fullName: casual.full_name,
            phone: casual.phone,
            city: casual.city,
            notified: casual.coin_flip
        })));
    }
}

enableTooltips();

export const Tooltips = <cx>
    <Md>
        <CodeSplit>

            # Tooltips

            <ImportPath path="import {enableTooltips} from 'cx/widgets';"/>

            Tooltips provide additional information regarding the element under the mouse pointer. In Cx, tooltips are
            used as a default way to display validation errors on form fields.

            > To enable tooltips execute the `enableTooltips` method at startup of your application.
            Tooltips are not automatically enabled to preserve small bundle sizes for applications where they are not needed.

            <div class="widgets" controller={PageController}>
                <div tooltip="This is a tooltip." style="margin: 50px">
                    Basic
                </div>

                <div tooltip={{placement: 'up', text: "This tooltip is displayed on top, unless you scroll..."}}
                    style="margin: 50px">
                    Displayed on top!
                </div>

                <div tooltip={{
                    placement: 'up',
                    title: 'Hello',
                    text: "It seems that you're really interested in tooltips."
                }} style="margin: 50px">
                    Title
                </div>

                <TextField
                    value:bind="$page.text" required visited placeholder="Validation" style="margin: 50px"
                    tooltip="Tooltips are commonly used to show validation errors on form elements."
                />

                <TextField
                    value:bind="$page.text" required visited placeholder="More Validation" style="margin: 50px"
                    errorTooltip={{placement: 'up', alwaysVisible: true, title: "Validation Error"}}
                />

                <div style="padding: 10px" tooltip={{
                    mouseTrap: true, items: <cx><Md>
                        Tooltips can contain any content. For example, we can add [a link to the overlays
                        page](~/widgets/overlays) or **make some text bold** because
                        we're using markdown here. Any other component can be used here too, however, tooltips work best
                        with text and images.

                        Please note that tooltip elements are appended to the `body` element, hence only the global
                        style rules apply.

                        In order to support a link click inside a tooltip, the tooltip needs to trap the click event so
                        it doesn't disappear.

                    </Md></cx>
                }}>
                    Rich content
                </div>

                <div style="margin: 50px" tooltip={{
                    mouseTrap: true, items: <cx>
                        <Grid columns={[
                            {field: 'fullName', header: 'Name', sortable: true},
                            {field: 'phone', header: 'Phone'}
                        ]} records:bind="$page.records"/>
                    </cx>
                }}>
                    Component inside
                </div>

                <div tooltip={{
                    alwaysVisible: {bind: '$page.showTooltip'},
                    placement: 'down',
                    text: "Tooltips can be set to be always visible."
                }} style="margin: 50px">
                    <Checkbox value:bind="$page.showTooltip">Always visible</Checkbox>
                </div>

                <div tooltip={{
                    visible: {bind: '$page.tooltipVisible'},
                    alwaysVisible: {bind: '$page.tooltipVisible'},
                    placement: 'down',
                    text: "This tooltip is visible only while the checkbox is checked."
                }} style="margin: 50px">
                    <Checkbox value:bind="$page.tooltipVisible">Controlled visibility</Checkbox>
                </div>

                <div tooltip={{text: "I'm right behind you.", trackMouse: true, offset: 20}}>
                    Mouse tracking
                </div>

            </div>

            Touch devices do not offer precise mouse pointer location,
            so tooltips are shown/hidden when the user taps the element containing the tooltip. Sometimes, this is not
            the desired behavior and you can make tooltips to ignore touch events, by setting `touchBehavior`
            to `ignore`.

            > To make all tooltips ignore touch events by default, set `Tooltip.prototype.touchBehavior = 'ignore';`.

            <CodeSnippet putInto="code" fiddle="CGlqeBmC">{`
            import {enableTooltips} from "cx/widgets";
            enableTooltips();

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

               <TextField
                    value:bind="$page.text" required visited placeholder="Validation" style="margin: 50px"
                    tooltip="Tooltips are commonly used to show validation errors on form elements."
                />

               <TextField
                   value:bind="$page.text" required visited placeholder="More Validation" style="margin: 50px"
                   errorTooltip={{placement: 'up', alwaysVisible: true, title: "Validation Error"}}
               />

               <div style="padding: 10px" tooltip={{ mouseTrap: true, items: <cx><Md>
                  Tooltips can contain any content. For example, we can add [a link to the overlays page](~/widgets/overlays) or **make some text bold** because
                  we're using markdown here. Any other component can be used here too, however, tooltips work best with text and images.

                  Please note that tooltip elements are appended to the \`body\` element, hence only the global style rules apply.

                  In order to support a link click inside a tooltip, the tooltip needs to trap the click event so it doesn't disappear.

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
               <div tooltip={{text: "I'm right behind you.", trackMouse: true, offset: 20}}>
                    Mouse tracking
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

        <ConfigTable props={configs}/>
    </Md>
</cx>
