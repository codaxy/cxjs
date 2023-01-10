import { Content, Controller, LabelsLeftLayout } from 'cx/ui';
import { HtmlElement, Checkbox, TextField, DateField, TextArea, Button, Repeater, Window, MsgBox, Tab } from 'cx/widgets';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from '../../components/ImportPath';



import configs from './configs/Window';



export const Windows = <cx>
    <Md>
        # Windows

        <ImportPath path="import {Window} from 'cx/widgets';" />

        Windows are overlays with headers, footers and special appearance.

        <CodeSplit>
            <div class="widgets">
                <Button onClick={(e, { store }) => { store.set('$page.contact.visible', true) }}>Open</Button>
                <Window
                    title="Contact"
                    visible={{ bind: "$page.contact.visible", defaultValue: false }}
                    center
                    style={{ width: '500px' }}
                    modal
                    draggable
                    closeOnEscape
                >
                    <div style={{ padding: "20px" }} layout={{ type: LabelsLeftLayout, mod: 'stretch' }}>
                        <TextField label="Name" value-bind="$page.contact.name" style={{ width: '100%' }} tooltip="A Tooltip" />
                        <TextField label="Email" value-bind="$page.contact.email" style={{ width: '100%' }} />
                        <TextArea label="Message" value-bind="$page.contact.message" rows={10} style={{ width: '100%' }} />
                        <DateField label="Date" value-bind="$page.contact.date" />
                    </div>
                    <div putInto="footer" style={{ float: "right" }} ws>
                        <Button mod="primary">Submit</Button>
                        <Button
                            // this will cause the Window to close
                            dismiss
                        >
                            Cancel
                        </Button>
                    </div>
                </Window>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Windows" default/>
                <CodeSnippet fiddle="5GzabX9A">{`
                <Button onClick={(e, {store}) => { store.set('$page.contact.visible', true)}}>Open</Button>
                <Window
                    title="Contact"
                    visible={{ bind: "$page.contact.visible", defaultValue: false }}
                    center
                    style={{ width: '500px' }}
                    modal
                    draggable
                    closeOnEscape
                >
                    <div style={{ padding: "20px" }} layout={{ type: LabelsLeftLayout, mod: 'stretch' }}>
                        <TextField label="Name" value-bind="$page.contact.name" style={{ width: '100%' }} tooltip="A Tooltip" />
                        <TextField label="Email" value-bind="$page.contact.email" style={{ width: '100%' }} />
                        <TextArea label="Message" value-bind="$page.contact.message" rows={10} style={{ width: '100%' }} />
                        <DateField label="Date" value-bind="$page.contact.date" />
                    </div>
                    <div putInto="footer" style={{ float: "right" }} ws>
                        <Button mod="primary">Submit</Button>
                        <Button
                            // this will cause the Window to close
                            dismiss
                        >
                            Cancel
                        </Button>
                    </div>
                </Window>
            `}</CodeSnippet>
            </Content>

        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs} />


    </Md>
</cx>
