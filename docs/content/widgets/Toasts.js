import { Content, Controller, LabelsLeftLayout } from 'cx/ui';
import { HtmlElement, Checkbox, TextField, DateField, TextArea, Button, Repeater, FlexRow, Toast } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';



import configs from './configs/Toast';

function randomColor() {
    let r = (Math.random() * 100 + 155).toFixed(0);
    let g = (Math.random() * 100 + 155).toFixed(0);
    let b = (Math.random() * 100 + 155).toFixed(0);
    return `rgb(${r},${g},${b})`;
}

function createToast(e, {store}, {placement, mod}) {
    let toast = Toast.create({
        message: 'This is a toast.',
        placement: placement,
        mod: mod,
        timeout: 2000
    });
    toast.open(store);
}

export const Toasts = <cx>
    <Md>
        # Toast

       <ImportPath path="import {Toast} from 'cx/widgets';" />

        <CodeSplit>

            The `Toast` widget is used to inform the users about new events and offer quick actions. Toasts are similar
            to Overlays, with the difference that toast position is controlled by the framework.


            <div class="widgets">
                <Button onClick={ (e, ins) => createToast(e, ins, {placement: 'left'})}>Left Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {placement: 'right'})}>Right Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {placement: 'top'})}>Top Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {placement: 'bottom'})}>Bottom Toast</Button>

                <Button onClick={ (e, {store}) => store.toggle('$page.toast.visible')}>Toggle Toast</Button>
                <Button onClick={ (e, {store}) => store.toggle('$page.complex.visible')}>Complex Toast</Button>

                <Button onClick={ (e, ins) => createToast(e, ins, {mod: 'primary'})}>Primary Mod</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {mod: 'warning'})}>Warning Mod</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {mod: 'error'})}>Error Mod</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {mod: 'success'})}>Success Mod</Button>

                <Toast visible={{bind:"$page.toast.visible", defaultValue: false}}>
                    This toast is visible only on this page.
                    <Button icon="close" dismiss mod="hollow" tooltip="Close"/>
                </Toast>

                <Toast visible={{bind:"$page.complex.visible", defaultValue: false}}>
                    <div preserveWhitespace>
                        <TextField value:bind="$page.name" label="Quick Reply:" />
                        <Button icon="envelope-o" dismiss disabled-expr="{$page.name} == null">Send</Button>
                        <Button icon="close" dismiss />
                    </div>
                </Toast>
            </div>

            <CodeSnippet putInto="code" fiddle="L5H66mn8">{`

                function createToast(e, {store}, {placement, mod}) {
                    let toast = Toast.create({
                        message: 'This is a toast.',
                        placement: placement,
                        mod: mod,
                        timeout: 2000
                    });
                    toast.open(store);
                }

                ...

                <Button onClick={ (e, ins) => createToast(e, ins, {placement: 'left'})}>Left Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {placement: 'right'})}>Right Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {placement: 'top'})}>Top Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {placement: 'bottom'})}>Bottom Toast</Button>

                <Button onClick={ (e, {store}) => store.toggle('$page.toast.visible')}>Toggle Toast</Button>
                <Button onClick={ (e, {store}) => store.toggle('$page.complex.visible')}>Complex Toast</Button>

                <Button onClick={ (e, ins) => createToast(e, ins, {mod: 'primary'})}>Primary Mod</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {mod: 'warning'})}>Warning Mod</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {mod: 'error'})}>Error Mod</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, {mod: 'success'})}>Success Mod</Button>

                <Toast visible:bind="$page.toast.visible" preserveWhitespace>
                    This toast is visible only on this page.
                    <Button icon="close" dismiss mod="hollow" tooltip="Close"/>
                </Toast>

                <Toast visible:bind="$page.complex.visible" preserveWhitespace>
                    <div preserveWhitespace>
                        <TextField value:bind="$page.name" label="Quick Reply:" />
                        <Button icon="envelope-o" dismiss disabled-expr="{$page.name} == null">Send</Button>
                        <Button icon="close" dismiss />
                    </div>
                </Toast>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
