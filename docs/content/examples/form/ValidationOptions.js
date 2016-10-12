import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Controller} from 'cx/ui/Controller';
import {TextField} from 'cx/ui/form/TextField';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Grid} from 'cx/ui/grid/Grid';
import {KeySelection} from 'cx/ui/selection/KeySelection';

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
                fulfill(v == 'codaxy' ? "This name is taken." : false);
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
                <div layout={LabelsLeftLayout}>
                    <TextField
                        label="Name (Required)"
                        value:bind="$page.fullName"
                        required asterisk
                    />

                    <TextField
                        label="Phone (RegExp)"
                        value:bind="$page.phone"
                        validationRegExp={/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/}
                        placeholder="###-###-####"
                    />

                    <TextField
                        label="City (Callback)"
                        value:bind="$page.form.city"
                        onValidate="validate"
                    />

                    <TextField
                        label="Username (Server)"
                        value:bind="$page.form.username"
                        onValidate="validateUsername"
                    />

                </div>
            </div>



            <CodeSnippet putInto="code">{``}</CodeSnippet>
        </CodeSplit>
    </Md>
</cx>;