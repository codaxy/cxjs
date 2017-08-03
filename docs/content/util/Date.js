import {HtmlElement} from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {ImportPath} from 'docs/components/ImportPath';
import {ConfigTable} from '../../components/ConfigTable';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

export const DatePage = <cx>
    <Md>
        # Date Utils
        <ImportPath path="import * from 'cx/util';" />

        Cx util contains the following date utility functions:
        - [dateDiff](#datediff)
        - [lowerBoundCheck](#lowerboundcheck)
        - [maxDate](#maxdate)
        - [minDate](#mindate)
        - [monthStart](#monthstart)
        - [sameDate](#samedate)
        - [upperBoundCheck](#upperboundcheck)
        - [zeroTime](#zerotime)

        Use curly braces to import only certain util functions.
        
        ## dateDiff
        `dateDiff: (d1: Date, d2: Date) => number;`
        <CodeSplit>
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

            Returns the difference between two dates in miliseconds.
        
            <CodeSnippet putInto='code'>
                {`
                    dateDiff(new Date('2017-07-24'), new Date('2017-07-23'));  // 86400000
                `}
            </CodeSnippet>
        </CodeSplit>
        
        
        ## lowerBoundCheck
        `lowerBoundCheck: (date: Date, minDate: Date, exclusive?: boolean) => boolean;`
        <CodeSplit>
            Checks `date` against the lower bound `minDate`. Set `exclusive` to true to disallow the border value.

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

            Returns `true` if the lower bound is satisfied, otherwise returns `false`.

            <CodeSnippet putInto='code'>
                {`
                    lowerBoundCheck(new Date('2017-07-24'), new Date('2017-07-23'));  // true
                    lowerBoundCheck(new Date('2017-07-23'), new Date('2017-07-23'));  // true
                    lowerBoundCheck(new Date('2017-07-23'), new Date('2017-07-23'), true); // false
                    lowerBoundCheck(new Date('2017-07-22'), new Date('2017-07-23')); // false
                `}
            </CodeSnippet>
        </CodeSplit>

        
        <CodeSplit>
            ## maxDate
            `maxDate: (...args: Date[]) => Date;`
        
            Returns the Date object that would come last on a timeline.
            
            <CodeSnippet putInto='code'>
                {`
                    maxDate(
                        new Date('2017-07-24'), 
                        new Date('2017-07-23'),
                        new Date('2017-07-22')
                    ); // Mon Jul 24 2017 02:00:00 GMT+0200 (Central European Daylight Time)
                `}
            </CodeSnippet>
        </CodeSplit>


        <CodeSplit>
            ## minDate
            `minDate: (...args: Date[]) => Date;`
    
            Returns the Date object that would come first on a timeline.
            
            <CodeSnippet putInto='code'>
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
        `monthStart: (d: Date) => Date;`
        
        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                d: {
                    type: 'Date',
                    description: <cx><Md>
                        Date object for any day of the month.
                    </Md></cx>
                }
            }} />

            Returns a new Date object representing the first day of the month.

            <CodeSnippet putInto='code'>
                {`
                    monthStart(new Date('2017-07-24')); 
                    // Mon Jul 01 2017 02:00:00 GMT+0200 (Central European Daylight Time)
                `}
            </CodeSnippet>
        </CodeSplit>

        
        ## sameDate
        `sameDate: (d1: Date, d2: Date) => boolean;`
        <CodeSplit>
            Checks if two Date objects represent the same date.

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
        
            Returns `true` if both Date objects represent the same date.
            <CodeSnippet putInto='code'>
                {`
                    sameDate(new Date('2017-07-24 02:00'), new Date('2017-07-24 19:00')); // true
                    sameDate(new Date('2017-07-23'), new Date('2017-07-24')); // false
                `}
            </CodeSnippet>
        </CodeSplit>


        ## upperBoundCheck
        `upperBoundCheck: (date: Date, maxDate: Date, exclusive?: boolean) => boolean;`

        <CodeSplit>
            Checks `date` against the upper bound `maxDate`. Set `exclusive` to true to disallow the border value.

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
        
            Returns `true` if the upper bound is satisfied, otherwise returns `false`.

            <CodeSnippet putInto='code'>
                {`
                    upperBoundCheck(new Date('2017-07-23'), new Date('2017-07-24'));  // true
                    upperBoundCheck(new Date('2017-07-23'), new Date('2017-07-23'));  // true
                    upperBoundCheck(new Date('2017-07-23'), new Date('2017-07-23'), true); // false
                    upperBoundCheck(new Date('2017-07-23'), new Date('2017-07-22')); // false
                `}
            </CodeSnippet>
        </CodeSplit>


        ## zeroTime
        `zeroTime: (date: Date) => Date;`
        <CodeSplit>
            Creates a copy of the Date object with time set to `00:00:00`.
            
            <ConfigTable header="Parameter" sort={false} props={{
                date: {
                    type: 'Date',
                    description: <cx><Md>
                        Date object.
                    </Md></cx>
                }
            }} />
        
            Returns a new Date object with time set to `00:00:00`. All other properties, including the time zone, remain the same.

            <CodeSnippet putInto='code'>
                {`
                    zeroTime(new Date('2017-07-23 19:43'));  
                    // Sun Jul 23 2017 00:00:00 GMT+0200 (Central European Daylight Time)
                `}
            </CodeSnippet>
        </CodeSplit>
    </Md>
</cx>

