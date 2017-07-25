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
        
        ### Definition
        `dateDiff: (d1: Date, d2: Date) => number;`

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
                    dateDiff(new Date('2017-07-24'), new Date('2017-07-23'));  // 86400000
                `}
            </CodeSnippet>
        </CodeSplit>
        
        ## lowerBoundCheck
        <ImportPath path="import {lowerBoundCheck} from 'cx/util';"/>

        Checks `date` against the lower bound `minDate`. Set `exclusive` to true to disallow the border value.

        ### Definition
        `lowerBoundCheck: (date: Date, minDate: Date, exclusive?: boolean) => boolean;`

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

        ### Definition
        `maxDate: (...args: Date[]) => Date;`
    
        ### Return value
        Returns the Date object that would come last on a timeline.

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


        ## minDate
        <ImportPath path="import {minDate} from 'cx/util';"/>

        ### Definition
        `minDate: (...args: Date[]) => Date;`
    
        ### Return value
        Returns the Date object that would come first on a timeline.

        ### Example
        <CodeSplit>
            <CodeSnippet>
                {`
                    minDate(
                        new Date('2017-07-24'), 
                        new Date('2017-07-23'),
                        new Date('2017-07-22')
                    ); // Mon Jul 22 2017 02:00:00 GMT+0200 (Central European Daylight Time)
                `}
            </CodeSnippet>
        </CodeSplit>


        ## monthStart
        <ImportPath path="import {monthStart} from 'cx/util';"/>

        ### Definition
        `monthStart: (d: Date) => Date;`

        ### Parameters
        
        <ConfigTable header="Parameter" sort={false} props={{
            d: {
                type: 'Date',
                description: <cx><Md>
                    Date object for any day of the month.
                </Md></cx>
            }
        }} />
    
        ### Return value
        Returns a new Date object representing the first day of the month.

        ### Example
        <CodeSplit>
            <CodeSnippet>
                {`
                    monthStart(new Date('2017-07-24')); 
                    // Mon Jul 01 2017 02:00:00 GMT+0200 (Central European Daylight Time)
                `}
            </CodeSnippet>
        </CodeSplit>

        
        ## sameDate
        <ImportPath path="import {sameDate} from 'cx/util';"/>

        Checks if two Date objects represent the same date.

        ### Definition
        `sameDate: (d1: Date, d2: Date) => boolean;`

        ### Parameters
        
        <ConfigTable header="Parameter" sort={false} props={{
            d1: {
                type: 'Date',
                description: <cx><Md>
                    First Date object.
                </Md></cx>
            },
            d2: {
                type: 'Date',
                description: <cx><Md>
                    Second Date object.
                </Md></cx>
            }
        }} />
    
        ### Return value
        Returns `true` if both Date objects represent the same date.

        ### Example
        <CodeSplit>
            <CodeSnippet>
                {`
                    sameDate(new Date('2017-07-24 02:00'), new Date('2017-07-24 19:00')); // true
                    sameDate(new Date('2017-07-23'), new Date('2017-07-24')); // false
                `}
            </CodeSnippet>
        </CodeSplit>


        ## upperBoundCheck
        <ImportPath path="import {upperBoundCheck} from 'cx/util';"/>

        Checks `date` against the upper bound `maxDate`. Set `exclusive` to true to disallow the border value.

        ### Definition
        `upperBoundCheck: (date: Date, maxDate: Date, exclusive?: boolean) => boolean;`

        ### Parameters
        
        <ConfigTable header="Parameter" sort={false} props={{
            date: {
                type: 'Date',
                description: <cx><Md>
                    Date to be checked.
                </Md></cx>
            },
            maxDate: {
                type: 'Date',
                description: <cx><Md>
                    Maximum date to check against.
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
        Returns `true` if the upper bound is satisfied, otherwise returns `false`.

        ### Example
        <CodeSplit>
            <CodeSnippet>
                {`
                    upperBoundCheck(new Date('2017-07-23'), new Date('2017-07-24'));  // true
                    upperBoundCheck(new Date('2017-07-23'), new Date('2017-07-23'));  // true
                    upperBoundCheck(new Date('2017-07-23'), new Date('2017-07-23'), true); // false
                    upperBoundCheck(new Date('2017-07-23'), new Date('2017-07-22')); // false
                `}
            </CodeSnippet>
        </CodeSplit>


        ## zeroTime
        <ImportPath path="import {zeroTime} from 'cx/util';"/>

        Creates a copy of the Date object with time set to `00:00:00`.

        ### Definition
        `zeroTime: (date: Date) => Date;`

        ### Parameters
        
        <ConfigTable header="Parameter" sort={false} props={{
            date: {
                type: 'Date',
                description: <cx><Md>
                    Date object.
                </Md></cx>
            }
        }} />
    
        ### Return value
        Returns a new Date object with time set to `00:00:00`. All other properties, including the time zone, remain the same.

        ### Example
        <CodeSplit>
            <CodeSnippet>
                {`
                    zeroTime(new Date('2017-07-23 19:43'));  
                    // Sun Jul 23 2017 00:00:00 GMT+0200 (Central European Daylight Time)
                `}
            </CodeSnippet>
        </CodeSplit>
    </Md>
</cx>

