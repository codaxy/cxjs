import {HtmlElement, Content} from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {ImportPath} from 'docs/components/ImportPath';
import {ConfigTable} from '../../components/ConfigTable';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

export const ColorPage = <cx>
    <Md>
        # Color Util
        <ImportPath path="import * from 'cx/util';"/>

        Cx util contains the following color utility functions:
        - [parseColor](#parsecolor)
        - [parseHexColor](#parsehexcolor)
        - [parseRgbColor](#parsergbcolor)
        - [parseHslColor](#parsehslcolor)
        - [hslToRgb](#hsltorgb)
        - [rgbToHex](#rgbtohex)
        - [rgbToHsl](#rgbtohsl)

        Use curly braces to import only certain util functions.

        ## parseColor
        `parseColor: (color: string) => RGBColor | HSLColor;`
        
        <CodeSplit>
            <ConfigTable header="Parameter" props={{
                color: {
                    type: 'string',
                    description: <cx><Md>
                        String representing a valid `rgba`, `hsla` or `hex` color value.
                    </Md></cx>
                }
            }} />

            For `hex` and `rgba` string input, it returns  `RGBColor` object with the following properties: `r`, `g`, `b`, `a`, representing the corresponding `rgba` number values, and `type` property equal to `'rgba'`.  
            For `hsla` stiring input, it returns `HSLColor` object with the following properties: `h`, `s`, `l`, `a`, representing the corresponding `hsla` number values, and `type` property equal to `'hsla'`.

            <CodeSnippet putInto='code'>
                {`
                    parseColor('#e52c2c'); // { type: 'rgba', r: 229, g: 44, b: 44, a: 1 }
                    parseColor('rgba(229,44,44,1)'); // { type: 'rgba', r: 229, g: 44, b: 44, a: 1 }
                    parseColor('hsla(0,78%,53%,1)'); // { type: 'hsla', h: 0, s: 78, l: 53, a: 1 }
                `}
            </CodeSnippet>
        </CodeSplit>
        
        
        ## parseHexColor
        `parseHexColor: (color: string) => RGBColor;`
        <CodeSplit>
            <ConfigTable header="Parameter" props={{
                color: {
                    type: 'string',
                    description: <cx><Md>
                        String representing a valid `hex` color value.
                    </Md></cx>
                }
            }} />

            Returns `RGBColor` object as defined above.  

            <CodeSnippet putInto='code'>
                {`
                    parseHexColor('#e52c2c'); // { type: 'rgba', r: 229, g: 44, b: 44, a: 1 }
                `}
            </CodeSnippet>
        </CodeSplit>
        
        ## parseRgbColor
        `parseRgbColor: (color: string) => RGBColor;`
        <CodeSplit>
            <ConfigTable header="Parameter" props={{
                color: {
                    type: 'string',
                    description: <cx><Md>
                        String representing a valid `rgba` color value.
                    </Md></cx>
                }
            }} />

            Returns `RGBColor` object as defined above.

            <CodeSnippet putInto='code'>
                {`
                    parseRgbColor('rgba(229,44,44,1)'); // { type: 'rgba', r: 229, g: 44, b: 44, a: 1 }
                `}
            </CodeSnippet>
        </CodeSplit>


        ## parseHslColor
        `parseHslColor: (color: string) => HSLColor;`
        <CodeSplit>
            <ConfigTable header="Parameter" props={{
                color: {
                    type: 'string',
                    description: <cx><Md>
                        String representing a valid `hsla` color value.
                    </Md></cx>
                }
            }} />

            Returns `HSLColor` object as defined above.

            <CodeSnippet putInto='code'>
                {`
                    parseHslColor('hsla(0,78%,53%,1)'); // { type: 'hsla', h: 0, s: 78, l: 53, a: 1 }
                `}
            </CodeSnippet>
        </CodeSplit>
        
        
        ## hslToRgb
        `hslToRgb: (h: number, s: number, l: number) => [number, number, number];`

        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                h: {
                    type: 'number',
                    description: <cx><Md>
                        Number representing a valid *hue* value in `hsla` color format.
                    </Md></cx>
                },
                s: {
                    type: 'number',
                    description: <cx><Md>
                        Number representing a valid *saturation* value in `hsla` color format.
                    </Md></cx>
                },
                l: {
                    type: 'number',
                    description: <cx><Md>
                        Number representing a valid *lightness* value in `hsla` color format.
                    </Md></cx>
                }
            }} />

            Returns an array containing three numbers representing `r`, `g` and `b` values of the `rgba` color format.

            <CodeSnippet putInto='code'>
                {`
                    hslToRgb(0, 0, 100);  // [255, 255, 255]
                `}
            </CodeSnippet>
        </CodeSplit>


        ## rgbToHex
        `rgbToHex: (r: number, g: number, b: number) => string;`

        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                r: {
                    type: 'number',
                    description: <cx><Md>
                        Number representing a valid *red* value in `rgba` color format.
                    </Md></cx>
                },
                g: {
                    type: 'number',
                    description: <cx><Md>
                        Number representing a valid *green* value in `rgba` color format.
                    </Md></cx>
                },
                b: {
                    type: 'number',
                    description: <cx><Md>
                        Number representing a valid *blue* value in `rgba` color format.
                    </Md></cx>
                }
            }} />

            Returns a string representing a valid `hex` color value.

            <CodeSnippet putInto='code'>
                {`
                    rgbToHex(255, 255, 255);  // '#ffffff'
                `}
            </CodeSnippet>
        </CodeSplit>


        ## rgbToHsl
        `rgbToHsl: (r: number, g: number, b: number) => [number, number, number];`

        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                r: {
                    type: 'number',
                    description: <cx><Md>
                        Number representing a valid *red* value in `rgba` color format.
                    </Md></cx>
                },
                g: {
                    type: 'number',
                    description: <cx><Md>
                        Number representing a valid *green* value in `rgba` color format.
                    </Md></cx>
                },
                b: {
                    type: 'number',
                    description: <cx><Md>
                        Number representing a valid *blue* value in `rgba` color format.
                    </Md></cx>
                }
            }} />

            Returns an array containing three numbers representing `h`, `s` and `l` values of the `hsla` color format.

            <CodeSnippet putInto='code'>
                {`
                    rgbToHsl(255, 255, 255);  // [0, 0, 100]
                `}
            </CodeSnippet>
        </CodeSplit>

    </Md>
</cx>

