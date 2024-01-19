import { Content, Controller, TreeAdapter } from "cx/ui";
import { Md } from "../../../components/Md";
import { CodeSplit } from "../../../components/CodeSplit";
import { CodeSnippet } from "../../../components/CodeSnippet";
import { Grid, Tab, TreeNode } from "cx/widgets";
import { updateTree } from "cx/data";
import { casual } from "../data/casual";

class PageController extends Controller {
    onInit() {
        this.idSeq = 0;
        this.store.set("$page.data1", Array.from({ length: 6 }).map(() => ({
            id: ++this.idSeq,
            fullName: casual.full_name,
            city: casual.city,
            $leaf: true
        })));

        this.store.set("$page.data2", [
            { id: 1, name: "Folder 1", $expanded: true, $leaf: false },
            { id: 2, name: "Folder 2", $expanded: true, $leaf: false },
            { id: 3, name: "Folder 3", $expanded: true, $leaf: false },
            { id: 4, name: "file_1.txt", $leaf: true },
            { id: 5, name: "file_2.txt", $leaf: true },
            { id: 6, name: "file_3.txt", $leaf: true }
        ]);
        this.id = this.store.get("$page.data2").length + 1; // Next available index
    }

    insertElement(records, insertIndex, record) {
        return [
            ...records.slice(0, insertIndex),
            record,
            ...records.slice(insertIndex)
        ];
    }

    move(e) {
        const source = e.source.records.map((r) => r.data);
        this.store.update("$page.data1", (array) =>
            array.filter((a, i) => source.indexOf(a) == -1)
        );

        e.source.records.forEach((record) => {
            if (record.index < e.target.insertionIndex) {
                --e.target.insertionIndex;
            }
        });

        this.store.update(
            "$page.data1",
            this.insertElement,
            e.target.insertionIndex,
            ...source
        );
    }

    onDropTest() {
        return true; // Can drop both folders and files
    }

    onDragOver(e) {
        const sourceNode = e.source.record.data;
        const targetNode = e.target.record.data;
        if (
            targetNode.$leaf || // Prevent dropping into leaves
            sourceNode.id == targetNode.id // Same source and target nodes
            /*
                Consider additional checks to avoid dropping
                higher-level parent folder into child folder
            */
        ) {
            this.store.delete("$page.infoMsg");
            return false;
        }
        this.store.set("$page.infoMsg", `You are dragging over ${targetNode.name}.`);
    }

    onDragEnd() {
        this.store.delete("$page.infoMsg");
    }

    onRowDrop(e) {
        const sourceNode = e.source.record.data;
        const targetNode = e.target.record.data;
        const data = this.store.get("$page.data2");

        const newTree = updateTree(
            data,
            (n) => {
                const nodeChildren = n.$children ?? [];
                nodeChildren.push({
                    ...sourceNode,
                    id: ++this.id
                });

                return {
                    ...n,
                    $children: nodeChildren
                };
            },
            (n) => n.name == targetNode.name,
            "$children",
            (n) => n.id == sourceNode.id
        );

        this.store.set("$page.data2", newTree);
    }
}

export const RowDragAndDrop = <cx>
    <div controller={PageController}>
        <Md>
            # Row Drag & Drop

            <CodeSplit>
                Drag and drop functionality is supported for rows in the `Grid`.
                This includes options like rearranging rows within the same `Grid`,
                transferring rows to another `Grid`, and placing nodes into subtrees
                of other nodes in a `Tree Grid`. Let's see an example for each option!

                ### Rearranging rows
                Try rearranging rows in this `Grid`:

                <div class="widgets">
                    <Grid
                        records-bind="$page.data1"
                        style={{ width: "100%" }}
                        columns={[
                            {
                                header: "Name",
                                field: "fullName",
                                items: (
                                    <cx>
                                        <TreeNode
                                            expanded-bind="$record.$expanded"
                                            leaf-bind="$record.$leaf"
                                            level-bind="$record.$level"
                                            loading-bind="$record.$loading"
                                            text-bind="$record.fullName"
                                        />
                                    </cx>
                                )
                            },
                            { header: "City", field: "city" }
                        ]}
                        row={{
                            style: { cursor: "move" }
                        }}
                        dragSource={{ data: { type: "record", source: "$page.data1" } }}
                        onDropTest={(e) => e.source.data.type == "record"}
                        onDrop={(e, instance) => instance.controller.move(e)}
                    />
                </div>

                <Content name="code">
                    <div>
                        <Tab value-bind="$page.code1.tab" tab="controller" mod="code" text="Controller" />
                        <Tab value-bind="$page.code1.tab" tab="grid" mod="code" text="Grid" default />
                    </div>

                    <CodeSnippet visible-expr="{$page.code1.tab}=='controller'" fiddle="8G59CxaS">{`
                        class PageController extends Controller {
                            onInit() {
                                this.idSeq = 0;
                                this.store.set("data", Array.from({ length: 6 }).map(() => ({
                                    id: ++this.idSeq,
                                    fullName: casual.full_name,
                                    city: casual.city,
                                    $leaf: true
                                })));
                            }

                            insertElement(records, insertIndex, record) {
                                return [
                                    ...records.slice(0, insertIndex),
                                    record,
                                    ...records.slice(insertIndex)
                                ];
                            }

                            move(e) {
                                const source = e.source.records.map((r) => r.data);
                                this.store.update("data", (array) =>
                                    array.filter((a, i) => source.indexOf(a) == -1)
                                );

                                e.source.records.forEach((record) => {
                                    if (record.index < e.target.insertionIndex) {
                                        --e.target.insertionIndex;
                                    }
                                });

                                this.store.update(
                                    "data",
                                    this.insertElement,
                                    e.target.insertionIndex,
                                    ...source
                                );
                            }
                        }
                    `}
                    </CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code1.tab}=='grid'" fiddle="8G59CxaS">{`
                        <Grid
                            records-bind="data"
                            style={{ width: "100%" }}
                            columns={[
                                {
                                    header: "Name",
                                    field: "fullName",
                                    items: (
                                        <cx>
                                            <TreeNode
                                                expanded-bind="$record.$expanded"
                                                leaf-bind="$record.$leaf"
                                                level-bind="$record.$level"
                                                loading-bind="$record.$loading"
                                                text-bind="$record.fullName"
                                            />
                                        </cx>
                                    )
                                },
                                { header: "City", field: "city" }
                            ]}
                            row={{
                                style: { cursor: "move" }
                            }}
                            dragSource={{ data: { type: "record", source: "data" } }}
                            onDropTest={(e) => e.source.data.type == "record"}
                            onDrop={(e, instance) => instance.controller.move(e)}
                        />
                    `}
                    </CodeSnippet>
                </Content>
            </CodeSplit>

            In this scenario, the process unfolds as follows: initially, records
            are created and saved in the `store`. The `Grid` then presents these records.
            To facilitate the reordering of rows, certain parameters need to be defined.
            These include `dragSource`, which specifies the type and source of the data
            being dragged, `onDropTest`, indicating the acceptable type of data that
            can be dropped (will be explained in the next example), and `onDrop`, a function
            responsible for managing the rearrangement process. The `onDrop` function is
            designed to identify the dragged item, determine the drop location (index),
            and access the records in the store to execute the necessary rearrangement.

            ### Transferring rows between two Grids
            This example is similar to the previous one. Take a look at it [here](https://fiddle.cxjs.io/?f=IF2N9ClH).

            ### Drag and drop in tree hierarchy

            <CodeSplit>
                When working with `Tree Grid`, a frequent scenario involves dealing with directory structures.

                Try dragging files or folders into folders:

                <div>
                    <Grid
                        records-bind="$page.data2"
                        style={{
                            width: "100%"
                        }}
                        scrollable={true}
                        dataAdapter={{
                            type: TreeAdapter
                        }}
                        keyField="name"
                        columns={[
                            {
                                header: "Name",
                                field: "name",
                                items: (
                                    <cx>
                                        <TreeNode
                                            expanded-bind="$record.$expanded"
                                            leaf-bind="$record.$leaf"
                                            level-bind="$record.$level"
                                            loading-bind="$record.$loading"
                                            text-bind="$record.name"
                                            icon-bind="$record.icon"
                                        />
                                    </cx>
                                )
                            }
                        ]}
                        dragSource={{
                            mode: "copy",
                            data: { type: "record" }
                        }}
                        onRowDropTest={(_e, instance) => instance.controller.onDropTest()}
                        onRowDragOver={(e, instance) => instance.controller.onDragOver(e)}
                        onDragEnd={(_e, instance) => instance.controller.onDragEnd()}
                        onRowDrop={(e, instance) => instance.controller.onRowDrop(e)}
                    />
                    <i text-tpl="{$page.infoMsg}"></i>
                </div>

                <Content name="code">
                    <div>
                        <Tab value-bind="$page.code2.tab" tab="controller" mod="code" text="Controller" />
                        <Tab value-bind="$page.code2.tab" tab="grid" mod="code" text="Grid" default />
                    </div>

                    <CodeSnippet visible-expr="{$page.code2.tab}=='controller'" fiddle="4MaG6oY5">{`
                        class PageController extends Controller {
                            onInit() {
                                this.store.set("data", [
                                    { id: 1, name: "Folder 1", $expanded: true, $leaf: false },
                                    { id: 2, name: "Folder 2", $expanded: true, $leaf: false },
                                    { id: 3, name: "Folder 3", $expanded: true, $leaf: false },
                                    { id: 4, name: "file_1.txt", $leaf: true },
                                    { id: 5, name: "file_2.txt", $leaf: true },
                                    { id: 6, name: "file_3.txt", $leaf: true }
                                ]);
                                this.id = this.store.get("data").length + 1; // Next available index
                            }

                            onDropTest() {
                                return true; // Can drop both folders and files
                            }

                            onDragOver(e) {
                                const sourceNode = e.source.record.data;
                                const targetNode = e.target.record.data;
                                if (
                                    targetNode.$leaf || // Prevent dropping into leaves
                                    sourceNode.id == targetNode.id // Same source and target nodes
                                    /*
                                        Consider additional checks to avoid dropping
                                        higher-level parent folder into child folder
                                    */
                                ) {
                                    this.store.delete("infoMsg");
                                    return false;
                                }
                                this.store.set("infoMsg", \`You are dragging over \${targetNode.name}.\`);
                            }

                            onDragEnd() {
                                this.store.delete("infoMsg");
                            }

                            onRowDrop(e) {
                                const sourceNode = e.source.record.data;
                                const targetNode = e.target.record.data;
                                const data = this.store.get("data");

                                const newTree = updateTree(
                                    data,
                                    (n) => {
                                        const nodeChildren = n.$children ?? [];
                                        nodeChildren.push({
                                            ...sourceNode,
                                            id: ++this.id
                                        });

                                        return {
                                            ...n,
                                            $children: nodeChildren
                                        };
                                    },
                                    (n) => n.name == targetNode.name,
                                    "$children",
                                    (n) => n.id == sourceNode.id
                                );

                                this.store.set("data", newTree);
                            }
                        }
                    `}</CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code2.tab}=='grid'" fiddle="4MaG6oY5">{`
                        <div controller={PageController}>
                            <Grid
                                records-bind="data"
                                style={{
                                    width: "100%"
                                }}
                                scrollable={true}
                                dataAdapter={{
                                    type: TreeAdapter
                                }}
                                keyField="name"
                                columns={[
                                    {
                                        header: "Name",
                                        field: "name",
                                        items: (
                                            <cx>
                                                <TreeNode
                                                    expanded-bind="$record.$expanded"
                                                    leaf-bind="$record.$leaf"
                                                    level-bind="$record.$level"
                                                    loading-bind="$record.$loading"
                                                    text-bind="$record.name"
                                                    icon-bind="$record.icon"
                                                />
                                            </cx>
                                        )
                                    }
                                ]}
                                dragSource={{
                                    mode: "copy",
                                    data: { type: "record" }
                                }}
                                onRowDropTest={(_e, instance) => instance.controller.onDropTest()}
                                onRowDragOver={(e, instance) => instance.controller.onDragOver(e)}
                                onDragEnd={(_e, instance) => instance.controller.onDragEnd()}
                                onRowDrop={(e, instance) => instance.controller.onRowDrop(e)}
                            />
                            <p text-tpl="{infoMsg}"></p>
                        </div>
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>

            In this case, we're not only dealing with drag and drop functionality, but
            with the whole tree structure. After generating the data and saving it in
            the `store`, the `Grid` will display all items. To enable drag and drop in
            such hierarchy, we need to define `dragSource` (same as before), `onRowDropTest`
            (specifies which record types can be dragged and dropped), `onRowDragOver`
            (this callback checks whether dropping the dragged item is allowed, and controls
            the displayed message below the `Tree Grid`), `onDragEnd` (removes the message),
            and `onRowDrop` (this callback has access to the `store`, source and target
            nodes, so that's where the tree update happens).
        </Md>
    </div>
</cx>