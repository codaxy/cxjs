import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Controller} from 'cx/ui/Controller';
import {TextField} from 'cx/ui/form/TextField';
import {ValidationGroup} from 'cx/ui/form/ValidationGroup';
import {ValidationError} from 'cx/ui/form/ValidationError';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {FirstVisibleChildLayout} from 'cx/ui/layout/FirstVisibleChildLayout';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Grid} from 'cx/ui/grid/Grid';
import {KeySelection} from 'cx/ui/selection/KeySelection';
import {PureContainer} from 'cx/ui/PureContainer';

//phone regex: http://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number

class PageController extends Controller {
    init() {
        super.init();
    }

    validate(v) {
        if (v != 'Los Angeles')
            return 'Please type Los Angeles.';
        return false;
    }

    validateUsername(v) {
        return new Promise(fulfill=> {
            setTimeout(()=> {
                fulfill(v == 'cx' ? "This name is taken." : false);
            }, 500)
        });
    }
}

export const ValidationOptions = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Form Validation Options

            The following example shows different options for validating form fields.

            <div class="widgets">
                <ValidationGroup>
                    <div layout={LabelsLeftLayout} style="width:600px">
                        {/* Use asterisk to indicate required fields */}
                        <TextField
                            label="First Name (Aterisk)"
                            value:bind="$page.firstName"
                            required asterisk
                        />

                        {/* Use visited to mark invalid fields before the user visits them */}
                        <TextField
                            label="First Name (Visited)"
                            value:bind="$page.firstName"
                            required asterisk visited
                        />

                        {/* Use ValidationError to display validation info on the side */}
                        <TextField
                            label="Last Name (Help)"
                            value:bind="$page.lastName"
                            help={ValidationError}
                            required visited
                            minLength={5}
                        />

                        {/* Which can also be displayed as a block */}
                        <TextField
                            label="Last Name (Block Help)"
                            value:bind="$page.lastName"
                            help={{ type: ValidationError, mod: 'block' }}
                            required visited
                            minLength={5}
                        />

                        {/* Validate using a regular expression */}
                        <TextField
                            label="Phone (RegExp)"
                            value:bind="$page.phone"
                            validationRegExp={/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/}
                            placeholder="###-###-####"
                        />

                        {/* Validate using a callback function */}
                        <TextField
                            label="City (Callback)"
                            value:bind="$page.form.city"
                            onValidate="validate"
                        />

                        {/* Validate using a callback function which returns a promise*/}
                        <TextField
                            label="Username (Server)"
                            value:bind="$page.form.username"
                            required visited
                            onValidate="validateUsername"
                            help={<PureContainer layout={FirstVisibleChildLayout}>
                                <ValidationError />
                                <span>OK</span>
                            </PureContainer>}
                        />
                    </div>
                </ValidationGroup>
            </div>


            <CodeSnippet putInto="code">{`
            <div class="widgets">
                <ValidationGroup>
                    <div layout={LabelsLeftLayout} style="width:600px">
                        {/* Use asterisk to indicate required fields */}
                        <TextField
                            label="First Name (Aterisk)"
                            value:bind="$page.firstName"
                            required asterisk
                        />

                        {/* Use visited to mark invalid fields before the user visits them */}
                        <TextField
                            label="First Name (Visited)"
                            value:bind="$page.firstName"
                            required asterisk visited
                        />

                        {/* Use ValidationError to display validation info on the side */}
                        <TextField
                            label="Last Name (Help)"
                            value:bind="$page.lastName"
                            help={ValidationError}
                            required visited
                            minLength={5}
                        />

                        {/* Which can also be displayed as a block */}
                        <TextField
                            label="Last Name (Block Help)"
                            value:bind="$page.lastName"
                            help={{ type: ValidationError, mod: 'block' }}
                            required visited
                            minLength={5}
                        />

                        {/* Validate using a regular expression */}
                        <TextField
                            label="Phone (RegExp)"
                            value:bind="$page.phone"
                            validationRegExp={/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/}
                            placeholder="###-###-####"
                        />

                        {/* Validate using a callback function */}
                        <TextField
                            label="City (Callback)"
                            value:bind="$page.form.city"
                            onValidate="validate"
                        />

                        {/* Validate using a callback function which returns a promise*/}
                        <TextField
                            label="Username (Server)"
                            value:bind="$page.form.username"
                            required visited
                            onValidate="validateUsername"
                            help={<PureContainer layout={FirstVisibleChildLayout}>
                                <ValidationError />
                                <span>OK</span>
                            </PureContainer>}
                        />
                    </div>
                </ValidationGroup>
            </div>
            `}</CodeSnippet>
        </CodeSplit>
    </Md>
</cx>;