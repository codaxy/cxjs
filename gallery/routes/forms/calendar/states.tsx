import {cx, Section, FlexRow, Calendar} from 'cx/widgets';

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/calendar/states.tsx" target="_blank" putInto="github">GitHub</a>
    <FlexRow>
        <Section mod="well">
            <FlexRow spacing="large" wrap justify="center">
                <div>
                    <h6>Standard</h6>
                    <Calendar value={{bind: "date"}}/>
                </div>
                <div>
                    <h6>Min/Max Value</h6>
                    <Calendar value={{bind: "date"}}
                        minValue="2016-05-10"
                        maxValue="2016-05-20"
                        maxExclusive
                        refDate="2016-05-08"
                    />
                </div>
                <div>
                    <h6>Disabled</h6>
                    <Calendar value={{bind: "date"}} disabled/>
                </div>
            </FlexRow>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);