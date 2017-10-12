import {HtmlElement, Tab, DragSource, DropZone, MsgBox, Repeater} from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {CodeSplit} from '../../components/CodeSplit';
import {MethodTable} from '../../components/MethodTable';
import {ImportPath} from 'docs/components/ImportPath';

import dragSourceConfig from '../widgets/configs/DragSource';
import dropZoneConfig from '../widgets/configs/DropZone';
import dragDropEventConfig from '../widgets/configs/DragDropEvent';

export function moveElement(array, sourceIndex, targetIndex) {

    if (targetIndex < 0)
        targetIndex += array.length;

    if (targetIndex == sourceIndex)
        return array;

    let el = array[sourceIndex];
    let res = [...array];
    if (sourceIndex < targetIndex) {
        for (let i = sourceIndex; i + 1 < targetIndex; i++)
            res[i] = res[i + 1];
        targetIndex--;
    }
    else {
        for (let i = sourceIndex; i > targetIndex; i--)
            res[i] = res[i - 1];
    }
    res[targetIndex] = el;
    return res;
}


export const DragAndDrop = <cx>
    <Md>
        # Drag & Drop
        <ImportPath path="import {DragSource, DropZone} from 'cx/widgets';"/>

        <CodeSplit>
            Drag & drop functionality is provided through `DragSource` and `DropZone` widgets,
            while `Grid` supports dropping and its rows behave like drag sources.

            Drag & drop can be used in many different ways. Let's go through a few common scenarios.

            ### Fixed Positions

            The simplest case is when drag sources and drop zones are completely independent.

            In the following example, there are two drag sources (S1 and S2) and one drop zone (Z1).
            Sources can be dragged around and dropped on drop zones. Each source should define its
            `data` that drop zones use to test if drop should be allowed and, when the drop
            occurs, to execute appropriate actions.

            <div class="widgets">
                <DragSource
                    style="width: 50px;height:50px;background:white;cursor:move"
                    data={{id: 'S1'}}
                >
                    S1
                </DragSource>
                <DragSource
                    style="width: 50px;height:50px;background:white;cursor:move"
                    data={{id: 'S2'}}
                >
                    S2
                </DragSource>
                <DropZone
                    style="width: 50px;height:50px;background:yellow;opacity:0.3;transition: all 0.2s"
                    overStyle="background:lightgreen;opacity:1"
                    farStyle="opacity:1"
                    onDropTest={({source}) => source.data.id == 'S1'}
                    onDrop={({source}) => {
                        MsgBox.alert(`Dropped ${source.data.id}.`);
                    }}
                    inflate={20}
                >
                    Z1
                </DropZone>
            </div>

            <CodeSnippet putInto="code">{`
                <DragSource
                    style="width: 50px;height:50px;background:white;cursor:move"
                    data={{ id: 'S1' }}
                >
                    S1
                </DragSource>
                <DragSource
                    style="width: 50px;height:50px;background:white;cursor:move"
                    data={{ id: 'S2' }}
                >
                    S2
                </DragSource>
                <DropZone
                    style="width: 50px;height:50px;background:yellow;opacity:0.3;transition: all 0.2s"
                    overStyle="background:lightgreen;opacity:1"
                    farStyle="opacity:1"
                    onDropTest={({ source }) => source.data.id == 'S1'}
                    onDrop={({ source }) => {
                        MsgBox.alert(\`Dropped \${source.data.id}.\`);
                    }}
                    inflate={20}
                >
                    Z1
                </DropZone>
            `}
            </CodeSnippet>
        </CodeSplit>

        During drag & drop operations drop zones should make visual changes to indicate
        to the user that drop is allowed.

        ### Reordering

        <CodeSplit>

            Reordering allows users to define order within a list of items.

            The following example explains reordering of items positioned horizontally (e.g. tabs).
            This is enabled by putting drop zones in gaps between drag sources. When dragging starts,
            the source is hidden and its place is occupied by the nearest drop zone. This is achieved
            using the `matchWidth`, `matchHeight`, and `matchMargin` flags. Each drop zone
            is inflated so it reacts when mouse is in its proximity, not strictly when it's over.

            <div class="widgets">
                <div>
                    <DropZone
                        mod="inline-block"
                        onDropTest={({source}) => source.data.type == 'hbox'}
                        onDrop={(e, {store}) => {
                            store.update('items', moveElement, e.source.data.index, 0);
                        }}
                        matchWidth
                        matchHeight
                        matchMargin
                        inflate={50}
                    >
                    </DropZone>
                    <Repeater
                        keyField="id"
                        records={{
                            bind: 'items', defaultValue: Array.from({length: 7}, (_, i) => ({
                                id: i + 1,
                                text: `Item ${i + 1}`
                            }))
                        }}
                    >
                        <DragSource
                            style="display:inline-block; margin: 5px; background: #ddf; cursor: move"
                            data={{index: {bind: "$index"}, type: 'hbox'}}
                            hideOnDrag
                        >
                            <div text:bind="$record.text" style="padding:5px"/>
                        </DragSource>
                        <DropZone
                            mod="inline-block"
                            onDropTest={({source}) => source.data.type == 'hbox'}
                            onDrop={(e, {store}) => {
                                store.update('items', moveElement, e.source.data.index, store.get('$index') + 1);
                            }}
                            matchWidth
                            matchHeight
                            matchMargin
                            inflate={50}
                        >
                        </DropZone>
                    </Repeater>
                </div>
            </div>

            <CodeSnippet putInto="code">{`
                <DropZone
                    mod="inline-block"
                    onDropTest={({source}) => source.data.type == 'hbox'}
                    onDrop={(e, {store}) => {
                        store.update('items', moveElement, e.source.data.index, 0);
                    }}
                    matchWidth
                    matchHeight
                    matchMargin
                    inflate={50}
                >
                </DropZone>
                <Repeater
                    keyField="id"
                    records={{
                        bind: 'items', defaultValue: Array.from({length: 7}, (_, i) => ({
                            id: i + 1,
                            text: \`Item \${i + 1}\`
                        }))
                    }}
                >
                    <DragSource
                        style="display:inline-block; margin: 5px; background: #ddf; cursor: move"
                        data={{index: {bind: "$index"}, type: 'hbox'}}
                        hideOnDrag
                    >
                        <div text:bind="$record.text" style="padding:5px"/>
                    </DragSource>
                    <DropZone
                        mod="inline-block"
                        onDropTest={({source}) => source.data.type == 'hbox'}
                        onDrop={(e, {store}) => {
                            store.update('items', moveElement, e.source.data.index, store.get('$index') + 1);
                        }}
                        matchWidth
                        matchHeight
                        matchMargin
                        inflate={50}
                    >
                    </DropZone>
                </Repeater>
            `}</CodeSnippet>
        </CodeSplit>

        ### Advanced Examples

        Check out the following examples to learn more about drag & drop capabilites in CxJS.

        * [Trello Clone](https://fiddle.cxjs.io/?f=H9Bb4Kf2)
        * [Dashboards](https://github.com/codaxy/dashboards)
        * [Grid to Grid D&D](https://fiddle.cxjs.io/?f=IF2N9ClH)

        ## Configuration

        <p>
            <Tab value:bind="$page.configTab" tab="drag-source" mod="line" default>DragSource</Tab>
            <Tab value:bind="$page.configTab" tab="drop-zone" mod="line">DropZone</Tab>
            <Tab value:bind="$page.configTab" tab="drag-event" mod="line">DragDropEvent</Tab>
        </p>

        <ConfigTable props={dragSourceConfig} visible:expr="{$page.configTab}=='drag-source'"/>
        <ConfigTable props={dropZoneConfig} visible:expr="{$page.configTab}=='drop-zone'"/>
        <ConfigTable props={dragDropEventConfig} visible:expr="{$page.configTab}=='drag-event'"/>


    </Md>
</cx>;
