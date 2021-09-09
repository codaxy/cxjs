import { HtmlElement, MsgBox, Button, enableMsgBoxAlerts, FlyweightTooltipTracker } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';
import configs from './configs/Button';
import { closest } from 'cx/util';
import { walkTokens } from 'marked';

enableMsgBoxAlerts();

export const FlyweightTooltipTrackerPage = <cx>
    <Md>
        # FlyweightTooltipTracker

        <CodeSplit>

            <ImportPath path="import {FlyweightTooltipTracker} from 'cx/widgets';" />

            `FlyweightTooltipTracker` is commonly used to display tooltips by extracting information available from the DOM.
            Use it to displaying full text on elements with text overflow, to display link URLs, etc.

            <div class="widgets">
                <div class="ellipsis" style="overflow: hidden; text-overflow: ellipsis; width: 30px; white-space: nowrap">
                    This is a long text that doesn't fit its designated space.
                </div>
                <FlyweightTooltipTracker
                    onGetTooltip={(el) => {
                        if (el.tagName[0] == 'H')
                            return {
                                title: el.tagName,
                                text: el.innerText,
                                trackMouse: true,
                                offset: 20
                            }

                        if (el.tagName == "A" && el.href != "#" && el.parentElement.tagName[0] != "H")
                            return {
                                text: el.href,
                                placement: 'up'
                            }

                        if (el.classList.contains("ellipsis") && el.scrollWidth > el.clientWidth)
                            return {
                                title: 'Ellipsis',
                                text: el.innerText
                            }
                    }}
                />
            </div>

            Links:
            - [Flyweight pattern](https://en.wikipedia.org/wiki/Flyweight_pattern)

            <div putInto="code">
                <CodeSnippet fiddle="hHCQlfL2">{`
                <div class="ellipsis" style="overflow: hidden; text-overflow: ellipsis; width: 30px; white-space: nowrap">
                    This is a long text that doesn't fit its designated space.
                </div>
                <FlyweightTooltipTracker
                    onGetTooltip={(el) => {
                        if (el.tagName[0] == 'H')
                            return {
                                title: el.tagName,
                                text: el.innerText,
                                trackMouse: true,
                                offset: 20
                            }

                        if (el.tagName == "A" && el.href != "#" && el.parentElement.tagName[0] != "H")
                            return {
                                text: el.href,
                                placement: 'up'
                            }

                        if (el.classList.contains("ellipsis") && el.scrollWidth > el.clientWidth)
                            return {
                                title: 'Ellipsis',
                                text: el.innerText
                            }
                    }}
                />
                `}</CodeSnippet>
            </div>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
