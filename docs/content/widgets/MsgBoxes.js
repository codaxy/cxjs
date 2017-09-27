import {Content, Controller, LabelsLeftLayout} from 'cx/ui';
import {HtmlElement, Checkbox, TextField, DateField, TextArea, Button, Repeater, MsgBox} from 'cx/widgets';
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
                            .yesNo('Would you like to see another alert?')
                            .then((btn) => {
                                if (btn == 'yes')
                                    MsgBox.alert(`Here it is.`)
                            });
                    }}
                >
                    Yes or No
                </Button>
            </div>


            <CodeSnippet fiddle="g1Z5Q4QH" putInto="code">{`
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
                            .yesNo('Would you like to see another alert?')
                            .then((btn) => {
                                if (btn == 'yes')
                                    MsgBox.alert(\`Here it is.\`)
                            });
                    }}
                >
                    Yes or No
                </Button>
            `}</CodeSnippet>


        </CodeSplit>

        ## Methods

        <MethodTable methods={[{
            signature: 'MsgBox.alert(options)',
            description: <cx><Md>
                Displays an alert window. The `options` parameter may be a string or a configuration object with
                `message`, `title` and
                `store` properties. Result is a `Promise` which is resolved once the user clicks OK.
            </Md></cx>
        }, {
            signature: 'MsgBox.yesNo(options)',
            description: <cx><Md>
                Displays a confirmation window with two options (yes and no).
                `options` parameter may be a string or a configuration object with `message`, `title` and
                `store` properties. Result is a `Promise` which is resolved once the user clicks one of the options.
            </Md></cx>
        }]}/>

        > In case you needs to display rich content such as links or images inside the message box,
        pass it through `children` instead of `message`.

    </Md>
</cx>
