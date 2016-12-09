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

function createToast(e, {store}, placement) {
    let toast = Toast.create({
        message: 'This is a random toast.',
        style: `background: ${randomColor()}; border-radius: 5px`,
        placement: placement,
        timeout: 2000
    });
    toast.open(store);
}

export const Toasts = <cx>
    <Md>
        # Toast

        <ImportPath path="import {MsgBox} from 'cx/ui/overlay/Toast';"></ImportPath>

        <CodeSplit>

            The `Toast` widgets is used to inform users about new events and offer quick actions. Toasts are similar
            to Overlays, with the difference that toast position is controlled by the framework.


            <div class="widgets">
                <Button onClick={ (e, ins) => createToast(e, ins, 'left')}>Left Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, 'right')}>Right Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, 'top')}>Top Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, 'bottom')}>Bottom Toast</Button>

                <Button onClick={ (e, {store}) => store.toggle('$page.toast.visible')}>Toggle Toast</Button>
                <Button onClick={ (e, {store}) => store.toggle('$page.complex.visible')}>Complex Toast</Button>

                <Toast visible={{bind:"$page.toast.visible", defaultValue: false}}>
                    This toast is visible only on this page.
                    <Button icon="close" dismiss mod="hollow"/>
                </Toast>

                <Toast visible={{bind:"$page.complex.visible", defaultValue: false}}>
                    <div preserveWhitespace>
                        <TextField value:bind="$page.name" label="Quick Reply:" />
                        <Button icon="envelope-o" dismiss disabled:expr="{$page.name} == null">Send</Button>
                        <Button icon="close" dismiss />
                    </div>
                </Toast>
            </div>

            <CodeSnippet putInto="code">{`

                function randomColor() {
                    let r = (Math.random() * 100 + 155).toFixed(0);
                    let g = (Math.random() * 100 + 155).toFixed(0);
                    let b = (Math.random() * 100 + 155).toFixed(0);
                    return \`rgb(\${r},\${g},\${b})\`;
                }

                function createToast(e, {store}, placement) {
                    let toast = Toast.create({
                        message: 'This is a random toast.',
                        style: \`background: \${randomColor()}; border-radius: 5px\`,
                        placement: placement,
                        timeout: 2000
                    });
                    toast.open(store);
                }

                ...

                <Button onClick={ (e, ins) => createToast(e, ins, 'left')}>Left Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, 'right')}>Right Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, 'top')}>Top Toast</Button>
                <Button onClick={ (e, ins) => createToast(e, ins, 'bottom')}>Bottom Toast</Button>

                <Button onClick={ (e, {store}) => store.toggle('$page.toast.visible')}>Toggle Toast</Button>
                <Button onClick={ (e, {store}) => store.toggle('$page.complex.visible')}>Complex Toast</Button>

                <Toast visible:bind="$page.toast.visible" preserveWhitespace>
                    This toast is visible only on this page.
                    <Button icon="close" dismiss mod="hollow"/>
                </Toast>

                <Toast visible:bind="$page.complex.visible" preserveWhitespace>
                    <div preserveWhitespace>
                        <TextField value:bind="$page.name" label="Quick Reply:" />
                        <Button icon="envelope-o" dismiss disabled:expr="{$page.name} == null">Send</Button>
                        <Button icon="close" dismiss />
                    </div>
                </Toast>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>