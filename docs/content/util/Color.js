import {HtmlElement, Content, Checkbox, Repeater, FlexBox, TextField, NumberField, Button, MsgBox} from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller, LabelsTopLayout, LabelsLeftLayout} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';
import {computable, updateArray} from 'cx/data';
import * as util from 'cx/util';
import {ConfigTable} from '../../components/ConfigTable';

export const Color = <cx>
    <Md>
        # Color Utils

        Cx util contains the following color utility funcitons:
        - [parseColor](#parsecolor)
        - [parseHexColor](#parsehexcolor)
        - [parseRgbColor](#parsergbcolor)
        - [parseHslColor](#parsehslcolor)
        - [hslToRgb](#hsltorgb)
        - [rgbToHex](#rgbtohex)
        - [rgbToHsl](#rgbtohsl)


        ## parseColor
        <ImportPath path="import {parseColor} from 'cx/util';"/>
        `parseColor: (color: string) => RGBColor | HSLColor;`

        ### Parameters
        
        <ConfigTable header="Parameter" props={{
            color: {
                key: true,
                type: 'string',
                description: <cx><Md>
                    String representing a valid `rgba`, `hsla` or `hex` color value.
                </Md></cx>
            }
        }} />

        ### Return value
        For `hex` and `rgba` string input, it returns  `RGBColor` object with the following properties: `r`, `g`, `b`, `a`, representing the corresponding `rgba` number values.  
        For `hsla` stiring input, it returns `HSLColor` object with the following properties: `h`, `s`, `l`, `a`, representing the corresponding `hsla` number values.

        
        ## parseHexColor
        <ImportPath path="import {parseHexColor} from 'cx/util';"/>
        `parseHexColor: (color: string) => RGBColor;`

        ### Parameters
        
        <ConfigTable header="Parameter" props={{
            color: {
                key: true,
                type: 'string',
                description: <cx><Md>
                    String representing a valid `hex` color value.
                </Md></cx>
            }
        }} />

        ### Return value
        `RGBColor` object with the following properties: `r`, `g`, `b`, `a`, representing the corresponding `rgba` number values.  

        
        ## parseRgbColor
        <ImportPath path="import {parseRgbColor} from 'cx/util';"/>
        `parseRgbColor: (color: string) => RGBColor;`

        ### Parameters
        
        <ConfigTable header="Parameter" props={{
            color: {
                key: true,
                type: 'string',
                description: <cx><Md>
                    String representing a valid `rgba` color value.
                </Md></cx>
            }
        }} />

        ### Return value
        `RGBColor` object with the following properties: `r`, `g`, `b`, `a`, representing the corresponding `rgba` number values.  


        ## parseHslColor
        <ImportPath path="import {parseHslColor} from 'cx/util';"/>
        `parseHslColor: (color: string) => HSLColor;`

        ### Parameters
        <ConfigTable header="Parameter" props={{
            color: {
                key: true,
                type: 'string',
                description: <cx><Md>
                    String representing a valid `hsla` color value.
                </Md></cx>
            }
        }} />

        ### Return value
        `HSLColor` object with the following properties: `h`, `s`, `l`, `a`, representing the corresponding `hsla` number values.  
        
        
        ## hslToRgb
        <ImportPath path="import {hslToRgb} from 'cx/util';"/>
        `hslToRgb: (h: number, s:number, l:number) => [number, number, number];`

        ### Parameters
        <ConfigTable header="Parameter" sort={false} props={{
            h: {
                key: true,
                type: 'number',
                description: <cx><Md>
                    Number representing a valid *hue* value in `hsla` color format.
                </Md></cx>
            },
            s: {
                key: true,
                type: 'number',
                description: <cx><Md>
                    Number representing a valid *saturation* value in `hsla` color format.
                </Md></cx>
            },
            l: {
                key: true,
                type: 'number',
                description: <cx><Md>
                    Number representing a valid *lightness* value in `hsla` color format.
                </Md></cx>
            }
        }} />

        ### Return value
        Array containing three numbers representing `r`, `g` and `b` values of the `rgba` color format.
        

        ## rgbToHex
        <ImportPath path="import {rgbToHex} from 'cx/util';"/>
        `rgbToHex: (r: number, g: number, b: number) => string;`

        ### Parameters
        <ConfigTable header="Parameter" sort={false} props={{
            r: {
                key: true,
                type: 'number',
                description: <cx><Md>
                    Number representing a valid *red* value in `rgba` color format.
                </Md></cx>
            },
            g: {
                key: true,
                type: 'number',
                description: <cx><Md>
                    Number representing a valid *green* value in `rgba` color format.
                </Md></cx>
            },
            b: {
                key: true,
                type: 'number',
                description: <cx><Md>
                    Number representing a valid *blue* value in `rgba` color format.
                </Md></cx>
            }
        }} />

        ### Return value
        String representing a valid `hex` color value.

        ## rgbToHsl
        <ImportPath path="import {rgbToHsl} from 'cx/util';"/>
        `rgbToHsl: (r:number, g:number, b:number) => [number, number, number];`

        ### Parameters
        <ConfigTable header="Parameter" sort={false} props={{
            r: {
                key: true,
                type: 'number',
                description: <cx><Md>
                    Number representing a valid *red* value in `rgba` color format.
                </Md></cx>
            },
            g: {
                key: true,
                type: 'number',
                description: <cx><Md>
                    Number representing a valid *green* value in `rgba` color format.
                </Md></cx>
            },
            b: {
                key: true,
                type: 'number',
                description: <cx><Md>
                    Number representing a valid *blue* value in `rgba` color format.
                </Md></cx>
            }
        }} />

        ### Return value
        Array containing three numbers representing `h`, `s` and `l` values of the `hsla` color format.

    </Md>
</cx>

