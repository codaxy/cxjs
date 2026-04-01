import {Content, Controller, LabelsLeftLayout} from 'cx/ui';
import {HtmlElement, Checkbox, TextField, DateField, TextArea, Button, Repeater, MsgBox, Tab} from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {MethodTable} from '../../components/MethodTable';
import {ImportPath} from '../../components/ImportPath';


export const MsgBoxes = <cx>
    <Md>
        # MsgBox

        <ImportPath path="import {MsgBox} from 'cx/widgets';"/>

        The `MsgBox` class provides utility methods for displaying alerts and confirmation windows.

        <CodeSplit>
            <div class="widgets">
                <Button
                    onClick={() => {
                        MsgBox.alert({message: 'This is an alert!', title: 'Title'})
                    }}
                >
                    Alert
                </Button>

                <Button
                    onClick={() => {
                        MsgBox
                            .yesNo({ message: 'Would you like to see another alert?', yesText: "Yes, please", noText: "No, thanks" })
                            .then((btn) => {
                                if (btn == 'yes')
                                    MsgBox.alert(`Here it is.`)
                            });
                    }}
                >
                    Custom Yes or No
                </Button>
            </div>

            Both `alert` and `yesNo` methods accept either just a message string, or a configuration object, with the following properties:
            * `message` - message string,
            * `title` - window title (string),
            * `header` - window header (Cx component),
            * `items` or `children` - list of child elements (for rich content),
            * `store` - store to be used in the new Window instance,
            * `style` - window style,
            * `yesText` - custom `yes` text, default value: `Yes`,
            * `noText` - custom `no` text, default value: `No`,
            * `okText` - custom `OK` text, default value: `OK`.
            
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="MsgBoxes" default/>
                <CodeSnippet fiddle="g1Z5Q4QH">{`
                    <Button
                        onClick={() => {
                            MsgBox.alert({ message: 'This is an alert!', title: 'Title' })
                        }}
                    >
                        Alert
                    </Button>

                    <Button
                        onClick={() => {
                            MsgBox
                                .yesNo({ message: 'Would you like to see another alert?', yesText: "Yes, please", noText: "No, thanks" })
                                .then((btn) => {
                                    if (btn == 'yes')
                                        MsgBox.alert('Here it is.')
                                });
                        }}
                    >
                        Custom Yes or No
                    </Button>
                `}</CodeSnippet>
            </Content>


        </CodeSplit>

        ## Methods

        <MethodTable methods={[{
            signature: 'MsgBox.alert(options)',
            description: <cx><Md>
                Displays an alert window. The `options` parameter may be a string or a configuration object with
                properties such as `message`, `title` and
                `store` (see full list above). Result is a `Promise` which is resolved once the user clicks OK.
            </Md></cx>
        }, {
            signature: 'MsgBox.yesNo(options)',
            description: <cx><Md>
                Displays a confirmation window with two options (yes and no).
                `options` parameter may be a string or a configuration object with properties such as `message`, `title` and
                `store` (see full list above). Result is a `Promise` which is resolved once the user clicks one of the options.
            </Md></cx>
        }]}/>

        > In case you need to display rich content such as links or images inside the message box,
        pass it through `children` instead of `message`.

    </Md>
</cx>
