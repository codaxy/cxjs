import { Content, Controller, TreeAdapter } from "cx/ui";
import { Md } from "../../../components/Md";
import { CodeSplit } from "../../../components/CodeSplit";
import { CodeSnippet } from "../../../components/CodeSnippet";
import { Grid, Tab, TextField, TreeNode } from "cx/widgets";
import { casual } from "../data/casual";
import { getSearchQueryPredicate } from "cx/util";
import { findTreeNode } from "cx/data";

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
                                fullName: "Mark Bishop",
                                phone: "476-182-0113",
                                city: "Puerto Nuevo",
                                $leaf: false,
                                $expanded: true,
                                $children: [
                                    {
                                        id: 4,
                                        fullName: "Sam Rempel",
                                        phone: "298-482-1184",
                                        city: "Port Lenna",
                                        $leaf: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 5,
                        fullName: "Luke Jacobson",
                        phone: "492-200-5819",
                        city: "Sydneyland",
                        $leaf: false,
                        $expanded: true
                    }
                ]
            },
            {
                id: 6,
                fullName: "Kamil Oberlauf",
                phone: "459-320-1290",
                city: "Bonnstadt",
                $leaf: true
            },
            {
                id: 7,
                fullName: "Pavan Chernis",
                phone: "958-327-5723",
                city: "Sabovlet",
                $leaf: false,
                $expanded: true,
                $children: [
                    {
                        id: 8,
                        fullName: "Samantha-Lucy Robertson",
                        phone: "432-698-7712",
                        city: "Jacksonville",
                        $leaf: true
                    }
                ]
            },
            {
                id: 9,
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
            `Tree Grid` also supports searching, but we need to separate two cases: leaf
            nodes and non-leaf nodes. Leaf nodes are checked immediately to see if they
            match the search query, whereas for non-leaf nodes, the match could be found
            in one of the nodes further down the tree.

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
                        records-bind="$page.data"
                        style={{ width: "100%", height: "300px" }}
                        scrollable
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
                        filterParams-bind="$page.treeSearch"
                        onCreateFilter={(search) => {
                            if (!search) return () => true;
                            search = search.toLowerCase();

                            return (node) => {
                                if (isMatch(node, search)) return true;
                                if (node.$leaf) return false;
                                const result = findTreeNode(
                                    node.$children,
                                    (subNode) => isMatch(subNode, search),
                                    "$children"
                                );
                                return result ? true : false;
                            }
                        }}
                    />
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code2.tab" tab="controller" mod="code" text="Controller" />
                    <Tab value-bind="$page.code2.tab" tab="grid" mod="code" text="Grid" default />

                    <CodeSnippet visible-expr="{$page.code2.tab}=='controller'" fiddle="rCf5Khho">{`
                        class PageController extends Controller {
                            onInit() {
                                this.store.set("$page.data", this.generateData());
                            }

                            generateData() {
                                return [
                                    // ...
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
                    `}</CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code2.tab}=='grid'" fiddle="rCf5Khho">{`
                        <TextField
                            value-bind="$page.treeSearch"
                            icon="search"
                            placeholder="Search..."
                        />
                        <Grid
                            records-bind="$page.data"
                            style={{ width: "100%", height: "300px" }}
                            scrollable
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
                            filterParams-bind="$page.treeSearch"
                            onCreateFilter={(search) => {
                                if (!search) return () => true;
                                search = search.toLowerCase();

                                return (node) => {
                                    if (isMatch(node, search)) return true; // Found a match
                                    if (node.$leaf) return false;
                                    // Look for a match in the subtree
                                    const result = findTreeNode(
                                        node.$children,
                                        (subNode) => isMatch(subNode, search),
                                        "$children"
                                    );
                                    return result ? true : false;
                                }
                            }}
                        />
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>

            **Disclaimer**: This solution works by using `onCreateFilter` which calls our
            search function **for each node** in the tree. That could cause performance
            issues when working with very large trees.
        </Md>
    </div>
</cx >