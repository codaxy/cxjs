import {
    HtmlElement,
    TextField,
    ValidationGroup,
    ValidationError,
    Checkbox,
    Grid,
    PureContainer,
    Button,
    Icon
} from 'cx/widgets';
import {Content, Controller, LabelsLeftLayout, LabelsTopLayout, FirstVisibleChildLayout, KeySelection} from 'cx/ui';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';


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

        Form fields indicate invalid state to the user by providing visual feedback such
        as changing border colors, displaying tooltips or error messages.

        By default, inputs will change colors and provide an error tooltip.

        <CodeSplit>

            If you click
            on the field below and then click somewhere else you'll see the change. If you hover
            the mouse over input (or touch it) you'll see the tooltip too.

            <div class="widgets" layout={LabelsLeftLayout}>
                <TextField
                    label="Name"
                    value:bind="$page.default"
                    placeholder="Required"
                    required
                />
            </div>

            <CodeSnippet putInto="code" fiddle="89CFD32T">{`
                    <TextField
                        label="Name"
                        value:bind="$page.default"
                        placeholder="Required"
                        required
                    />
                `}</CodeSnippet>

        </CodeSplit>

        Required fields can be highlighted by setting the `asterisk` flag. Alternatively,
        fields can be marked as `visited` which will force them to show validation errors immediately.

        <CodeSplit>

            <div class="widgets" layout={LabelsLeftLayout}>
                <TextField
                    label="Asterisk"
                    value:bind="$page.asterisk"
                    placeholder="Required"
                    required
                    asterisk
                />

                <TextField
                    label="Visited"
                    value:bind="$page.visited"
                    placeholder="Required"
                    required
                    visited
                />
            </div>

            <CodeSnippet putInto="code" fiddle="NrkChvlx">{`
                <TextField label="Asterisk" value:bind="$page.asterisk" placeholder="Required" required asterisk />

                <TextField label="Visited" value:bind="$page.visited" placeholder="Required" required visited />
            `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>

            Form fields provide the `help` property which can be used to display additional information
            next to the field.

            <div class="widgets" layout={LabelsLeftLayout}>
                <TextField
                    label="Help"
                    value:bind="$page.help"
                    help={<span style="font-size:smaller">Help text</span>}
                />
            </div>

            <CodeSnippet putInto="code" fiddle="wS5tlMkT">{`
                <TextField
                    label="Help"
                    value:bind="$page.help"
                    help={<span style="font-size:smaller">Help text</span>}
                />
            `}</CodeSnippet>

        </CodeSplit>

        <CodeSplit>

            `help` can be used to put any content next to the field. This can be a button or a validation error.
            Please not that the second field in the example below will show both tooltip and error message.

            <div class="widgets">
                <ValidationGroup layout={LabelsLeftLayout}>

                    <TextField
                        label="Help"
                        value:bind="$page.help2"
                        help={<Button icon="calculator" mod="hollow"/>}
                    />

                    <TextField
                        label="Help"
                        value:bind="$page.help2"
                        required visited
                        help={ValidationError}
                    />
                </ValidationGroup>
            </div>

                <CodeSnippet putInto="code" fiddle="tKub0tQP">{`
                    <ValidationGroup layout={LabelsLeftLayout}>
                        <TextField
                            label="Help"
                            value:bind="$page.help2"
                            help={<Button icon="calculator" mod="hollow"/>}
                        />
                        <TextField
                            label="Help"
                            value:bind="$page.help2"
                            required visited
                            help={ValidationError}
                        />
                    </ValidationGroup>
                `}</CodeSnippet>

        </CodeSplit>

        Sometimes, tooltips are not the best way to indicate errors. Instead of a tooltip,
        you may decide to only show the error message. In that case make sure that all
        fields are wrapped inside a `ValidationGroup` element.

        <CodeSplit>

            <div class="widgets">
                <ValidationGroup layout={LabelsLeftLayout}>
                    <TextField
                        label="Help"
                        value:bind="$page.help3"
                        required
                        minLength={5}
                        visited
                        validationMode="help"
                    />
                    <TextField
                        label="Help Block"
                        value:bind="$page.help4"
                        required
                        minLength={5}
                        visited
                        validationMode="help-block"
                    />
                </ValidationGroup>
            </div>

            <CodeSnippet putInto="code" fiddle="hY5BXIPR">{`
                <ValidationGroup layout={LabelsLeftLayout}>
                    <TextField label="Help" value:bind="$page.help3" required visited
                        minLength={5} validationMode="help" />

                    <TextField label="Help Block" value:bind="$page.help4" required visited
                        minLength={5} validationMode="help-block" />
                </ValidationGroup>
            `}</CodeSnippet>

        </CodeSplit>

        ### Validation Methods

        <CodeSplit>
            Form fields accept validation callback functions through `onValidate`.


            <div class="widgets">
                <ValidationGroup layout={LabelsTopLayout}>
                    <TextField
                        label="Favorite framework?"
                        value:bind="$page.framework"
                        validationMode="help-block"
                        reactOn="enter blur"
                        onValidate={(v) => {
                            if (v != 'Cx')
                                return 'Oops, wrong answer!'
                        }}
                    />
                </ValidationGroup>
            </div>

            <CodeSnippet putInto="code" fiddle="HsSymblF">{`
                <TextField
                    label="Favorite framework?" value:bind="$page.framework"
                    validationMode="help-block" reactOn="enter blur"
                    onValidate={(v) => {
                        if (v != 'Cx')
                            return 'Oops, wrong answer!'
                    }}
                />
            `}</CodeSnippet>

        </CodeSplit>

        `onValidate` can be used for server validation by returning a promise.

        <CodeSplit>

            <div class="widgets">
                <ValidationGroup layout={LabelsTopLayout}>
                    <TextField
                        label="Username"
                        value:bind="$page.form.username"
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

            <CodeSnippet putInto="code" fiddle="qMFIX9Cc">{`
                <ValidationGroup layout={LabelsTopLayout}>
                    <TextField
                        label="Username"
                        value:bind="$page.form.username"
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
        </CodeSplit>
    </Md>
</cx>;
