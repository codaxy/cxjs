import { ValidationGroup, Validator, LabeledContainer, NumberField, Repeater, Content, Tab, Button, TextField, ValidationError } from 'cx/widgets';
import { Controller, LabelsLeftLayout, LabelsTopLayout } from 'cx/ui';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { MethodTable } from '../../components/MethodTable';
import { ImportPath } from '../../components/ImportPath';
import configs from './configs/Validator';
import './Validators.scss';

class PageController extends Controller {
    onInit() {
        this.store.batch(() => {
            this.store.set("$page.username", "admin");
            this.store.set("$page.password", "password");
            this.store.set("$page.repeatPassword", "PASSWORD");
            this.store.set("$page.visited2", true);
            this.store.set("$page.valid2", false);
        });
    }
}

export const Validators = <cx>
    <Md>
        <CodeSplit>
            # Validator
            <ImportPath path="import { Validator } from 'cx/widgets';" />

            The `Validator` widget is used for additional validation on calculated values.

            <div class="widgets"
                style={{
                    display: "block",
                    borderLeftWidth: '3px',
                    borderLeftStyle: 'solid',
                    borderLeftColor: { expr: '{$page.valid} ? "lightgreen" : "red"' },
                    marginBottom: "40px"
                }}
            >
                <div>
                    <p>
                        Please enter X and Y so that X + Y = 20.
                    </p>
                    <ValidationGroup
                        layout={LabelsTopLayout}
                        valid-bind="$page.valid1"
                        errors-bind="$page.errors1"
                    >
                        <NumberField label="X" value-bind="$page.x" required requiredText="Please enter X." style="width: 50px" />
                        <div text-tpl="+" class="items-align" />
                        <NumberField label="Y" value-bind="$page.y" required requiredText="Please enter Y." style="width: 50px" />
                        <div text-tpl="=" class="items-align" />
                        <LabeledContainer label="X + Y">
                            <div text-expr="{$page.x} + {$page.y}" class="items-align" />
                        </LabeledContainer>
                        <Validator
                            value-expr="{$page.x} + {$page.y}"
                            onValidate={(value) => value != 20 && 'X + Y != 20'}
                        />
                    </ValidationGroup>
                    <ul>
                        <Repeater records-bind="$page.errors1">
                            <li text-bind="$record.message" style="color: red;" />
                        </Repeater>
                    </ul>
                </div>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code1.tab" mod="code" tab="index" text="Validator" default />

                <CodeSnippet visible-expr="{$page.code1.tab}=='index'" fiddle="0MyopqEE">{`
                    <ValidationGroup layout={LabelsTopLayout}
                        valid-bind="$page.valid"
                        errors-bind="$page.errors"
                    >
                        <NumberField label="X" value-bind="$page.x" required requiredText="Please enter X." style="width: 50px"/>
                        +
                        <NumberField label="Y" value-bind="$page.y" required requiredText="Please enter Y."  style="width: 50px"/>
                        =
                        <LabeledContainer label="X + Y">
                            <span text-expr="{$page.x} + {$page.y}" />
                        </LabeledContainer>
                        <Validator
                            value-expr="{$page.x} + {$page.y}"
                            onValidate={(value) => value != 20 && 'X + Y != 20'}
                        />
                    </ValidationGroup>
                    <ul>
                        <Repeater records-bind="$page.errors">
                            <li text-bind="$record.message" style="color: red;" />
                        </Repeater>
                    </ul>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## ValidationError
        <ImportPath path="import { ValidationError } from 'cx/widgets';" />

        Besides validation, the `Validator` widget can render error messages with the support of the
        `ValidationError` component. You can apply different styling for each `ValidationError` instance.

        <CodeSplit>
            <div class="widgets" controller={PageController}>
                <ValidationGroup
                    valid-bind="$page.valid2"
                    errors-bind="$page.errors2"
                    visited-bind="$page.visited2"
                >
                    <LabelsLeftLayout>
                        <TextField
                            value-bind="$page.username"
                            required
                            label="Username"
                            asterisk
                        />
                        <TextField
                            inputType="password"
                            value-bind="$page.password"
                            required
                            label="Password"
                            asterisk
                        />
                        <TextField
                            inputType="password"
                            value-bind="$page.repeatPassword"
                            required
                            label="Repeat password"
                            asterisk
                        />
                        <Validator
                            value-expr="{$page.password} != {$page.repeatPassword}"
                            onValidate={(value) => value && "Passwords don't match."}
                        >
                            <div style="margin: 10px 0">
                                <ValidationError
                                    style={{
                                        padding: "10px",
                                        background: "rgba(255, 0, 0, 0.3)",
                                        borderRadius: "5px"
                                    }}
                                />
                            </div>
                        </Validator>
                        <Button submit>Sign Up</Button>
                    </LabelsLeftLayout>
                </ValidationGroup>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code2.tab" mod="code" tab="index" text="ValidationError" default />

                <CodeSnippet visible-expr="{$page.code2.tab}=='index'" fiddle="eCIwKLDx">{`
                    <ValidationGroup
                        valid-bind="valid"
                        errors-bind="errors"
                        visited-bind="visited"
                    >
                        <LabelsLeftLayout>
                            <TextField
                                value-bind="username"
                                required
                                label="Username"
                                asterisk
                            />
                            <TextField
                                inputType="password"
                                value-bind="password"
                                required
                                label="Password"
                                asterisk
                            />
                            <TextField
                                inputType="password"
                                value-bind="repeatPassword"
                                required
                                label="Repeat password"
                                asterisk
                            />
                            <Validator
                                value-expr="{password} != {repeatPassword}"
                                onValidate={(value) => value && "Passwords don't match."}
                            >
                                <div style="margin: 10px 0">
                                    <ValidationError
                                        style={{
                                            padding: "10px",
                                            background: "rgba(255, 0, 0, 0.3)",
                                            borderRadius: "5px"
                                        }}
                                    />
                                </div>
                            </Validator>
                            <Button submit>Sign Up</Button>
                        </LabelsLeftLayout>
                    </ValidationGroup>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### Configuration
        <ConfigTable props={configs} />

        ### Methods

        <MethodTable
            methods={[{
                key: true,
                signature: 'onValidate(value, instance)',
                description: <cx><Md>
                    A callback function used for validation. Function should return an error message string or `false`, if value is
                    valid.
                    Alternatively, a `Promise` should be returned for server-side validation scenarios.
                </Md></cx>
            }, {
                signature: 'onValidationException(error, instance)',
                description: <cx><Md>
                    A callback function that is called if validation fails.
                </Md></cx>
            }]}
        />
    </Md>
</cx>
