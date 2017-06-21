import { HtmlElement, MsgBox, Button, enableMsgBoxAlerts } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';
import configs from './configs/Button';

enableMsgBoxAlerts();

export const Buttons = <cx>
    <Md>
        # Buttons

        <CodeSplit>

            <ImportPath path="import {Button} from 'cx/widgets';" />

            Buttons are commonly used UI elements.

            <div class="widgets">
                <Button onClick={() => { MsgBox.alert('Regular')}}>Regular</Button>
                <Button pressed>Pressed</Button>
                <Button disabled onClick={() => { MsgBox.alert('Disabled') }}>Disabled</Button>
                <Button mod="primary" onClick={() => { MsgBox.alert('Primary') }}>Primary</Button>
                <Button mod="danger" confirm="You clicked the danger button. Are you sure that you want to proceed?"
                    onClick={() => {
                        MsgBox.alert('Danger')
                    }}>
                    Danger
                </Button>
                <Button mod="hollow" icon="pencil">Icon + Text</Button>
                <Button mod="hollow" icon="refresh" />
            </div>
            <div putInto="code">
                <CodeSnippet fiddle="ciFZc3eZ">{`
                    <Button onClick={() => { MsgBox.alert('Regular')}}>Regular</Button>
                    <Button pressed>Pressed</Button>
                    <Button disabled onClick={() => { MsgBox.alert('Disabled') }}>Disabled</Button>
                    <Button mod="primary" onClick={() => { MsgBox.alert('Primary') }}>Primary</Button>
                    <Button mod="danger" confirm="You clicked the danger button. Are you sure that you want to proceed?"
                        onClick={() => {
                            MsgBox.alert('Danger')
                        }}>
                        Danger
                    </Button>
                    <Button mod="hollow" icon="pencil">Icon + Text</Button>
                    <Button mod="hollow" icon="refresh" />
                `}</CodeSnippet>

                <br/>

                <CodeSnippet>{`
                    //Use Cx based message boxes to display confirmation dialog
                    import {enableMsgBoxAlerts} from 'cx/widgets';
                    enableMsgBoxAlerts();
                `}</CodeSnippet>
            </div>
        </CodeSplit>

        > To enable Cx based message box alerts, call `enableMsgBoxAlerts()` at startup of your application.


        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
