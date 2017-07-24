import {HtmlElement} from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {ImportPath} from 'docs/components/ImportPath';
import {ConfigTable} from '../../components/ConfigTable';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

export const DateUtil = <cx>
    <Md>
        # Date Utils

        Cx util contains the following date utility funcitons:
        - [dateDiff](#datediff)
        - [lowerBoundCheck](#lowerboundcheck)
        - [maxDate](#maxdate)
        - [minDate](#mindate)
        - [monthStart](#monthstart)
        - [sameDate](#samedate)
        - [upperBoundCheck](#upperboundcheck)
        - [zeroTime](#zerotime)


        ## dateDiff
        <ImportPath path="import {dateDiff} from 'cx/util';"/>
        `dateDiff: (d1: Date, d2: Date) => number;`

        ### Syntax
        <CodeSplit>
            <CodeSnippet>
                {`
                    dateDiff(d1, d2);
                `}
            </CodeSnippet>
        </CodeSplit>

        ### Parameters
        <ConfigTable header="Parameter" sort={false} props={{
            d1: {
                type: 'Date',
                description: <cx><Md>
                    Date object representing the start date.
                </Md></cx>
            },
            d2: {
                type: 'Date',
                description: <cx><Md>
                    Date object representing the end date.
                </Md></cx>
            }
        }} />

        ### Return value
        Returns the difference between two dates in miliseconds.

        ### Example
        <CodeSplit>
            <CodeSnippet>
                {`
                    dateDiff(new Date('2017-07-24'), new Date(2017-07-23));  // 86400000
                `}
            </CodeSnippet>
        </CodeSplit>
        
        ## lowerBoundCheck
        <ImportPath path="import {lowerBoundCheck} from 'cx/util';"/>
        `lowerBoundCheck: (date: Date, minDate: Date, exclusive?: boolean) => boolean;`

        Checks `date` against the lower bound `minDate`. Set `exclusive` to true to disallow the border value.

        ### Syntax
        <CodeSplit>
            <CodeSnippet>
                {`
                    lowerBoundCheck(date, minDate);
                    lowerBoundCheck(date, minDate, true);
                `}
            </CodeSnippet>
        </CodeSplit>

        ### Parameters
        
        <ConfigTable header="Parameter" sort={false} props={{
            date: {
                type: 'Date',
                description: <cx><Md>
                    Date to be checked.
                </Md></cx>
            },
            minDate: {
                type: 'Date',
                description: <cx><Md>
                    Minimum date to check against.
                </Md></cx>
            },
            exclusive: {
                type: 'boolean',
                description: <cx><Md>
                    Optional. Set to `true` to disallow the border value. Defaults to `false`.
                </Md></cx>
            }
        }} />

        ### Return value
        Returns `true` if the lower bound is satisfied, otherwise returns `false`.

        ### Example
        <CodeSplit>
            <CodeSnippet>
                {`
                    lowerBoundCheck(new Date('2017-07-24'), new Date('2017-07-23'));  // true
                    lowerBoundCheck(new Date('2017-07-23'), new Date('2017-07-23'));  // true
                    lowerBoundCheck(new Date('2017-07-23'), new Date('2017-07-23'), true); // false
                    lowerBoundCheck(new Date('2017-07-22'), new Date('2017-07-23')); // false
                `}
            </CodeSnippet>
        </CodeSplit>

        ## maxDate
        <ImportPath path="import {maxDate} from 'cx/util';"/>
        `maxDate: (...args: Date[]) => Date;`

        ### Syntax
        <CodeSplit>
            <CodeSnippet>
                {`maxDate([d1[, d2[, . . . [, dN]]]]);`}
            </CodeSnippet>
        </CodeSplit>
    
        ### Return value
        Returns the Date object with the greates date value.

        ### Example
        <CodeSplit>
            <CodeSnippet>
                {`
                    maxDate(
                        new Date('2017-07-24'), 
                        new Date('2017-07-23'),
                        new Date('2017-07-22')
                    ); // Mon Jul 24 2017 02:00:00 GMT+0200 (Central European Daylight Time)
                `}
            </CodeSnippet>
        </CodeSplit>
    </Md>
</cx>

