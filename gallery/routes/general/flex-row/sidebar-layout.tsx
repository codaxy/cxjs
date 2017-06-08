import {cx, FlexCol, FlexRow} from 'cx/widgets';

let boxIndex = 0;

const Box = (name, flex = 1) => <cx>
    <div
        style={{
            flex: flex,
            background: `rgba(128, 128, 128, ${++boxIndex % 2 == 0 ? 0.3 : 0.2})`,
            padding: "20px",
            whiteSpace: "nowrap",
            textAlign: "center"
        }}
    >
        {name}
    </div>
</cx>;
    
const borderColor = 'rgba(176, 196, 222, 0.5)';


export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/flex-row/sidebar-layout.tsx" target="_blank"
        putInto="github">GitHub</a>
    <FlexRow style="background: rgba(128, 128, 128, 0.1); height: 100%" padding spacing>
        <FlexCol style="background: rgba(128, 128, 128, 0.1); width: 200px; max-width: 40vw" justify="center" align="center">
            <div>Sidebar</div>
        </FlexCol>

        <FlexCol style="width: 150px; flex: 1 1 0px" spacing>
            <FlexRow style="background: rgba(128, 128, 128, 0.1); padding: 20px" justify="center" align="center">
                Header
            </FlexRow>
            <FlexRow style="flex:1;background: rgba(128, 128, 128, 0.1); overflow-y: scroll" justify="center" align="center">
                Main Content (Scrollable)
            </FlexRow>
        </FlexCol>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);