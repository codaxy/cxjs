import {
    HtmlElement,
    TextField,
    ValidationGroup,
    ValidationError,
    Checkbox,
    Grid,
    PureContainer,
    Button,
    Icon,
    Tab
} from 'cx/widgets';
import {Content, Controller, LabelsLeftLayout, LabelsTopLayout, FirstVisibleChildLayout, KeySelection} from 'cx/ui';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';
import {ImportPath} from '../../../components/ImportPath';


//phone regex: http://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number

class PageController extends Controller {
    validate(v) {
        if (v != 'Los Angeles')
            return 'Please type Los Angeles.';
        return false;
    }

    validateUsername(v) {
        return new Promise(fulfill => {
            setTimeout(() => {
                fulfill(v == 'cx' ? "This name is taken." : false);
            }, 500)
        });
    }
}

export const ValidationOptions = <cx>
    <Md controller={PageController}>
        # Form Validation Options

        <ImportPath path="import { ValidationGroup, ValidationError } from 'cx/widgets';" />

        Form fields indicate invalid input to the user by providing visual feedback such
        as changing border colors, displaying tooltips or error messages.

        By default, inputs will change colors and provide an error tooltip.

        <CodeSplit>

            If you click on the field below and then click somewhere else, you'll see the change. 
            Furthermore, if you hover over the input with the mouse (or touch it) afterwards, 
            the tooltip will appear as well.

            <div class="widgets" layout={LabelsLeftLayout}>
                <TextField
                    label="Name"
                    value-bind="$page.default"
                    placeholder="Required"
                    required
                />
            </div>
            <Content name="code">
            <Tab value-bind="$page.code1.tab" mod="code" tab="index" text="Index" default/>
                
            <CodeSnippet visible-expr="{$page.code1.tab}=='index'" fiddle="89CFD32T">{`
                    <TextField
                        label="Name"
                        value-bind="$page.default"
                        placeholder="Required"
                        required
                    />
                `}</CodeSnippet>
            </Content>

        </CodeSplit>

        Required fields can be highlighted by setting the `asterisk` flag. Alternatively,
        fields can be marked as `visited` which will force them to show validation errors immediately.

        <CodeSplit>

            <div class="widgets" layout={LabelsLeftLayout}>
                <TextField
                    label="Asterisk"
                    value-bind="$page.asterisk"
                    placeholder="Required"
                    required
                    asterisk
                />

                <TextField
                    label="Visited"
                    value-bind="$page.visited"
                    placeholder="Required"
                    required
                    visited
                />
            </div>
            <Content name="code">
                <Tab value-bind="$page.code2.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet visible-expr="{$page.code2.tab}=='index'"fiddle="NrkChvlx">{`
                    <TextField label="Asterisk" value-bind="$page.asterisk" placeholder="Required" required asterisk />
                    <TextField label="Visited" value-bind="$page.visited" placeholder="Required" required visited />
                `}</CodeSnippet>
            </Content>
            
        </CodeSplit>

        <CodeSplit>

            Form fields provide the `help` property which can be used to display additional information
            next to the field.

            <div class="widgets" layout={LabelsLeftLayout}>
                <TextField
                    label="Help"
                    value-bind="$page.help"
                    help={<span style="font-size:smaller">Help text</span>}
                />
            </div>

            <Content name="code">
                <Tab value-bind="$page.code3.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet visible-expr="{$page.code3.tab}=='index'" fiddle="wS5tlMkT">{`
                    <TextField
                        label="Help"
                        value-bind="$page.help"
                        help={<span style="font-size:smaller">Help text</span>}
                    />
                `}</CodeSnippet>
            </Content>

        </CodeSplit>

        <CodeSplit>

            `help` can be used to put any content next to the field. This can be a button or a validation error.
            Please note that the second field in the example below will show both the tooltip and the error message.

            <div class="widgets">
                <ValidationGroup layout={LabelsLeftLayout}>

                    <TextField
                        label="Help"
                        value-bind="$page.help2"
                        help={<Button icon="calculator" mod="hollow"/>}
                    />

                    <TextField
                        label="Help"
                        value-bind="$page.help2"
                        required visited
                        help={ValidationError}
                    />
                </ValidationGroup>
            </div>

                <Content name="code">
                    <Tab value-bind="$page.code3.tab" mod="code" tab="index" text="Index" default/>
                    <CodeSnippet visible-expr="{$page.code3.tab}=='index'" fiddle="tKub0tQP">{`
                        <ValidationGroup layout={LabelsLeftLayout}>
                            <TextField label="Help" value-bind="$page.help2" help={<Button icon="calculator" mod="hollow"/>}
                            />
                            <TextField label="Help" value-bind="$page.help2" required visited help={ValidationError}
                            />
                        </ValidationGroup>
                    `}</CodeSnippet>
                </Content>

        </CodeSplit>

        Sometimes, tooltips are not the best way to indicate errors. Instead of a tooltip,
        you may decide to show only the error message. In that case, make sure that all
        fields are wrapped inside a `ValidationGroup` element.

        <CodeSplit>

            <div class="widgets">
                <ValidationGroup layout={LabelsLeftLayout}>
                    <TextField
                        label="Help"
                        value-bind="$page.help3"
                        required
                        minLength={5}
                        visited
                        validationMode="help"
                    />
                    <TextField
                        label="Help Block"
                        value-bind="$page.help4"
                        required
                        minLength={5}
                        visited
                        validationMode="help-block"
                    />
                </ValidationGroup>
            </div> 

            <Content name="code">
                <Tab value-bind="$page.code4.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet visible-expr="{$page.code4.tab}=='index'" fiddle="hY5BXIPR">{`
                    <ValidationGroup layout={LabelsLeftLayout}>
                        <TextField label="Help" value-bind="$page.help3" required visited
                            minLength={5} validationMode="help" />

                        <TextField label="Help Block" value-bind="$page.help4" required visited
                            minLength={5} validationMode="help-block" />
                    </ValidationGroup>
                `}</CodeSnippet>
            </Content>


        </CodeSplit>

        ### Validation Methods

        <CodeSplit>
            Form fields accept validation callback functions through `onValidate`.


            <div class="widgets">
                <ValidationGroup layout={LabelsTopLayout}>
                    <TextField
                        label="Favorite framework?"
                        value-bind="$page.framework"
                        validationMode="help-block"
                        reactOn="enter blur"
                        onValidate={(v) => {
                            if (v != 'Cx')
                                return 'Oops, wrong answer!'
                        }}
                    />
                </ValidationGroup>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet fiddle="HsSymblF">{`
                    <TextField
                        label="Favorite framework?" value-bind="$page.framework"
                        validationMode="help-block" reactOn="enter blur"
                        onValidate={(v) => {
                            if (v != 'Cx')
                                return 'Oops, wrong answer!'
                        }}
                    />
                `}</CodeSnippet>
            </Content>


        </CodeSplit>

        `onValidate` can be used for server validation by returning a promise.

        <CodeSplit>

            <div class="widgets">
                <ValidationGroup layout={LabelsTopLayout}>
                    <TextField
                        label="Username"
                        value-bind="$page.form.username"
                        required visited
                        onValidate={
                            v => new Promise(fulfill => {
                                setTimeout(() => {
                                    fulfill(v == 'cx' ? "This name is taken." : false);
                                }, 500)
                            })
                        }
                        help={
                            <div layout={FirstVisibleChildLayout}>
                                <ValidationError />
                                <Icon name="check" style="color:green"/>
                            </div>
                        }
                    />
                </ValidationGroup>
            </div>


            <Content name="code">
                <Tab value-bind="$page.code5.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet visible-expr="{$page.code5.tab}=='index'" fiddle="qMFIX9Cc">{`
                    <ValidationGroup layout={LabelsTopLayout}>
                        <TextField
                            label="Username"
                            value-bind="$page.form.username"
                            required visited
                            onValidate={
                                v => new Promise(fulfill => {
                                    setTimeout(() => {
                                        fulfill(v == 'cx' ? "This name is taken." : false);
                                    }, 500)
                                })
                            }
                            help={
                                <div layout={FirstVisibleChildLayout}>
                                    <ValidationError />
                                    <Icon name="check" style="color:green"/>
                                </div>
                            }
                        />
                    </ValidationGroup>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>
    </Md>
</cx>;
