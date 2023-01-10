import {HtmlElement, ValidationGroup, Validator, LabeledContainer, NumberField, Repeater, Content, Tab} from 'cx/widgets';
import {LabelsTopLayout} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {MethodTable} from '../../components/MethodTable';
import {ImportPath} from '../../components/ImportPath';

import configs from './configs/Validator';

export const Validators = <cx>
    <Md>
        # Validator

        <CodeSplit>
            <ImportPath path="import {Validator} from 'cx/widgets';"/>

            The `Validator` widget is used for additional validation on calculated values.

            <div class="widgets"
                style={{
                    display: "block",
                    borderLeftWidth: '3px',
                    borderLeftStyle: 'solid',
                    borderLeftColor: {expr: '{$page.valid} ? "lightgreen" : "red"'}
                }}
            >
                <div>
                    <p>
                        Please enter X and Y so that X + Y = 20.
                    </p>
                    <ValidationGroup
                        layout={LabelsTopLayout}
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
                            <li text-bind="$record.message" style="color: red;"/>
                        </Repeater>
                    </ul>
                </div>
            </div>
            
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Validator" default/>
                <CodeSnippet fiddle="0MyopqEE">{`
                    <div class="widgets"
                        style={{
                            display: "block",
                            borderLeftWidth: '3px',
                            borderLeftStyle: 'solid',
                            borderLeftColor: {expr: '{$page.valid} ? "lightgreen" : "red"'}
                        }}
                    >
                        <div>
                            <p>
                                Please enter X and Y so that X + Y = 20.
                            </p>
                            <ValidationGroup
                                layout={LabelsTopLayout}
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
                                    <li text-bind="$record.message" style="color: red;"/>
                                </Repeater>
                            </ul>
                        </div>
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

        ## Methods

        <MethodTable
            methods={[{
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

