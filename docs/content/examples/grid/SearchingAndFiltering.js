import { Content, Controller, TreeAdapter } from "cx/ui";
import { Md } from "../../../components/Md";
import { CodeSplit } from "../../../components/CodeSplit";
import { CodeSnippet } from "../../../components/CodeSnippet";
import { Grid, Tab, TextField, TreeNode } from "cx/widgets";
import { casual } from "../data/casual";
import { getSearchQueryPredicate } from "cx/util";

class PageController extends Controller {
    onInit() {
        this.store.set(
            "$page.employees",
            Array.from({ length: 10 }).map((r, i) => ({
                id: i + 1,
                fullName: casual.full_name,
                phone: casual.phone,
                city: casual.city
            }))
        );

        this.store.set("$page.data", this.generateData());

        // Allow filtering by name, phone, and city
        this.addTrigger(
            "filter",
            ["$page.treeSearch"],
            (search) => {
                if (!search) {
                    this.store.set("$page.filteredData", this.store.get("$page.data"));
                    return;
                }
                const tree = this.store.get("$page.data");
                const filtered = filterTree(tree, search.toLowerCase());
                this.store.set("$page.filteredData", filtered);
            },
            true
        );
    }

    generateData() {
        return [
            {
                id: 1,
                fullName: "Nayeli Bergnaum",
                phone: "345-753-1942",
                city: "Tristonhaven",
                $leaf: false,
                $expanded: true,
                $children: [
                    {
                        id: 2,
                        fullName: "Dorothea Bosco",
                        phone: "886-291-2187",
                        city: "Jacintoville",
                        $leaf: false,
                        $expanded: true,
                        $children: [
                            {
                                id: 3,
                                fullName: "Sam Rempel",
                                phone: "298-482-1184",
                                city: "Port Lenna",
                                $leaf: true
                            }
                        ]
                    },
                    {
                        id: 4,
                        fullName: "Luke Jacobson",
                        phone: "492-200-5819",
                        city: "Sydneyland",
                        $leaf: false,
                        $expanded: true
                    }
                ]
            },
            {
                id: 5,
                fullName: "Kamil Oberlauf",
                phone: "459-320-1290",
                city: "Bonnstadt",
                $leaf: true
            },
            {
                id: 6,
                fullName: "Pavan Chernis",
                phone: "958-327-5723",
                city: "Sabovlet",
                $leaf: false,
                $expanded: true,
                $children: [
                    {
                        id: 7,
                        fullName: "Samantha-Lucy Robertson",
                        phone: "432-698-7712",
                        city: "Jacksonville",
                        $leaf: true
                    }
                ]
            },
            {
                id: 8,
                fullName: "Simona Pavetic",
                phone: "593-221-2079",
                city: "Kaufborgen",
                $leaf: true
            }
        ];
    }
}

function isMatch(node, search) {
    return (
        node.fullName.toLowerCase().includes(search) ||
        node.phone.toLowerCase().includes(search) ||
        node.city.toLowerCase().includes(search)
    );
}

function filterTree(tree, search) {
    if (!tree) return [];
    var level = [];

    for (const node of tree) {
        if (node.$leaf) {
            if (isMatch(node, search)) {
                level.push(node);
            }
        } else {
            // Node is not a leaf, so we need to filter its subtree
            const children = filterTree(node.$children, search);
            if (children.length > 0 || isMatch(node, search)) {
                level.push({
                    ...node,
                    $children: children
                });
            }
        }
    }

    return level;
}

export const SearchingAndFiltering = <cx>
    <div controller={PageController}>
        <Md>
            # Searching and Filtering

            <CodeSplit>
                When it comes to `Grid`, it is common to require a functionality for filtering records.
                One way to accomplish that is by specifying `filterParams` and `onCreateFilter`.

                <div class="widgets">
                    <div style="margin-bottom: 10px; width: 100%">
                        <TextField
                            value-bind="$page.search"
                            icon="search"
                            placeholder="Search..."
                        />
                    </div>

                    <Grid
                        records-bind="$page.employees"
                        columns={[
                            { header: "Name", field: "fullName" },
                            { header: "Phone", field: "phone" },
                            { header: "City", field: "city" }
                        ]}
                        emptyText="No records match the specified filter"
                        filterParams-bind="$page.search"
                        onCreateFilter={(search) => {
                            if (!search) return () => true;
                            let predicate = getSearchQueryPredicate(search);
                            return (record) =>
                                predicate(record.fullName) ||
                                predicate(record.phone) ||
                                predicate(record.city);
                        }}
                        scrollable
                        style={{ width: "100%", height: "315px" }}
                    />
                </div>

                <Content name="code">
                    <div>
                        <Tab value-bind="$page.code1.tab" tab="controller" mod="code" text="Controller" />
                        <Tab value-bind="$page.code1.tab" tab="grid" mod="code" text="Grid" default />
                    </div>

                    <CodeSnippet visible-expr="{$page.code1.tab}=='controller'" fiddle="xLA9BNuv">{`
                        class PageController extends Controller {
                            onInit() {
                                this.store.set(
                                    "$page.employees",
                                    Array.from({ length: 10 }).map((r, i) => ({
                                        id: i + 1,
                                        fullName: casual.full_name,
                                        phone: casual.phone,
                                        city: casual.city
                                    }))
                                );
                            }
                        }
                    `}</CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code1.tab}=='grid'" fiddle="xLA9BNuv">{`
                        <TextField
                            value-bind="$page.search"
                            icon="search"
                            placeholder="Search..."
                        />
                        <Grid
                            records-bind="$page.employees"
                            columns={[
                                { header: "Name", field: "fullName" },
                                { header: "Phone", field: "phone" },
                                { header: "City", field: "city" }
                            ]}
                            emptyText="No records match the specified filter"
                            filterParams-bind="$page.search"
                            onCreateFilter={(search) => {
                                if (!search) return () => true;
                                let predicate = getSearchQueryPredicate(search);
                                return (record) =>
                                    predicate(record.fullName) ||
                                    predicate(record.phone) ||
                                    predicate(record.city);
                            }}
                            scrollable
                            style={{ height: "315px" }}
                        />
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>

            ## Searching Tree Grid
            `Tree Grid` also supports searching. While traversing the tree, we need
            to separate two cases: leaf nodes and non-leaf nodes. Leaf nodes can be
            checked immediately and added to the result if they match the filter.
            For non-leaf nodes, we must check their children too.

            <CodeSplit>
                <div class="widgets">
                    <div style="margin-bottom: 10px; width: 100%">
                        <TextField
                            value-bind="$page.treeSearch"
                            icon="search"
                            placeholder="Search..."
                        />
                    </div>

                    <Grid
                        records-bind="$page.filteredData"
                        style={{ width: "100%", height: "300px" }}
                        mod="tree"
                        dataAdapter={{
                            type: TreeAdapter
                        }}
                        emptyText="No data for the specified filter."
                        columns={[
                            {
                                field: "fullName",
                                header: "Name",
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
                            {
                                header: "Phone",
                                field: "phone"
                            },
                            {
                                header: "City",
                                field: "city"
                            }
                        ]}
                    />
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code2.tab" tab="controller" mod="code" text="Controller" default />
                    <Tab value-bind="$page.code2.tab" tab="grid" mod="code" text="Grid" />

                    <CodeSnippet visible-expr="{$page.code2.tab}=='controller'" fiddle="rCf5Khho">{`
                        this.store.set("$page.data", this.generateData());

                        // Allow filtering by name, phone, and city
                        this.addTrigger(
                            "filter",
                            ["$page.treeSearch"],
                            (search) => {
                                if (!search) {
                                    this.store.set("$page.filteredData", this.store.get("$page.data"));
                                    return;
                                }
                                const tree = this.store.get("$page.data");
                                const filtered = filterTree(tree, search.toLowerCase());
                                this.store.set("$page.filteredData", filtered);
                            },
                            true
                        );

                        function isMatch(node, search) {
                            return (
                                node.fullName.toLowerCase().includes(search) ||
                                node.phone.toLowerCase().includes(search) ||
                                node.city.toLowerCase().includes(search)
                            );
                        }

                        function filterTree(tree, search) {
                            if (!tree) return [];
                            var level = [];

                            for (const node of tree) {
                                if (node.$leaf) {
                                    if (isMatch(node, search)) {
                                        level.push(node);
                                    }
                                } else {
                                    // Node is not a leaf, so we need to filter its subtree
                                    const children = filterTree(node.$children, search);
                                    if (children.length > 0 || isMatch(node, search)) {
                                        level.push({
                                            ...node,
                                            $children: children
                                        });
                                    }
                                }
                            }

                            return level;
                        }
                    `}</CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code2.tab}=='grid'" fiddle="rCf5Khho">{`
                        <TextField
                            value-bind="$page.treeSearch"
                            icon="search"
                            placeholder="Search..."
                        />
                        <Grid
                            records-bind="$page.filteredData"
                            style={{ width: "100%", height: "300px" }}
                            mod="tree"
                            dataAdapter={{
                                type: TreeAdapter
                            }}
                            emptyText="No data for the specified filter."
                            columns={[
                                {
                                    field: "fullName",
                                    header: "Name",
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
                                {
                                    header: "Phone",
                                    field: "phone"
                                },
                                {
                                    header: "City",
                                    field: "city"
                                }
                            ]}
                        />
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>
        </Md>
    </div>
</cx >