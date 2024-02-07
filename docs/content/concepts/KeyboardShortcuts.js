import { Md } from '../../components/Md';
import { ImportPath } from '../../components/ImportPath';
import { Controller, LabelsLeftLayout, registerKeyboardShortcut } from 'cx/ui';
import { Checkbox, Content, Tab } from "cx/widgets";
import { KeyCode } from "cx/util";
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';

class PageController extends Controller {
    onInit() {
        this.unregisterSimple = registerKeyboardShortcut(KeyCode.enter, (_e) => {
            this.store.toggle("simple");
        });
        this.unregisterComplex = registerKeyboardShortcut(
            { keyCode: KeyCode.a, shiftKey: true },
            (_e) => {
                this.store.toggle("complex");
            }
        );
    }

    onDestroy() {
        this.unregisterSimple();
        this.unregisterComplex();
    }
}

export const KeyboardShortcuts = (
    <cx>
        <div controller={PageController}>
            <Md>
                # Keyboard Shortcuts
                <ImportPath path="import { registerKeyboardShortcut } from 'cx/ui';" />

                CxJS contains built-in functionality that listens for keyboard shortcuts.

                <CodeSplit>
                    <div class="widgets">
                        <div
                            text-tpl="Press the following key combinations to check boxes:"
                            style="margin-bottom: 20px"
                        />
                        <LabelsLeftLayout>
                            <Checkbox label="Enter" value-bind="simple" readOnly />
                            <Checkbox label="Shift + A" value-bind="complex" readOnly />
                        </LabelsLeftLayout>
                    </div>

                    <Content name="code">
                        <Tab value-bind="$page.code1.tab" mod="code" tab="controller" text="Controller" default />
                        <Tab value-bind="$page.code1.tab" mod="code" tab="widget" text="Widget" />

                        <CodeSnippet visible-expr="{$page.code1.tab}=='controller'" fiddle="j9B1NvuL">{`
                            class PageController extends Controller {
                                onInit() {
                                    this.unregisterSimple = registerKeyboardShortcut(KeyCode.enter, (e) => {
                                        this.store.toggle("simple");
                                    });
                                    this.unregisterComplex = registerKeyboardShortcut(
                                        { keyCode: KeyCode.a, shiftKey: true },
                                        (e) => {
                                            this.store.toggle("complex");
                                        }
                                    );
                                }

                                onDestroy() {
                                    this.unregisterSimple();
                                    this.unregisterComplex();
                                }
                            }
                        `}</CodeSnippet>
                        <CodeSnippet visible-expr="{$page.code1.tab}=='widget'" fiddle="j9B1NvuL">{`
                            <div
                                text-tpl="Press the following key combinations to check boxes:"
                                style="margin-bottom: 20px"
                            />
                            <LabelsLeftLayout>
                                <Checkbox label="Enter" value-bind="simple" readOnly />
                                <Checkbox label="Shift + A" value-bind="complex" readOnly />
                            </LabelsLeftLayout>
                        `}</CodeSnippet>
                    </Content>
                </CodeSplit>

                `registerKeyboardShortcut` method accepts two arguments: **key** (one specific key or a combination
                of keys, e.g. `Shift + A`), and a **callback** that is called when matching keyboard shortcut is pressed.

                > One thing worth mentioning is that you should unregister keyboard listeners when they're no longer
                needed. Good places to do that include controller's `onDestroy` method and component's
                `componentWillUnmount` method.
            </Md>
        </div>
    </cx>
);
