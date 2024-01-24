import { Content, Controller, TreeAdapter } from 'cx/ui';
import { Md } from '../../../components/Md';
import { Grid, Tab, TextField, TreeNode } from 'cx/widgets';
import { CodeSplit } from "../../../components/CodeSplit";
import { CodeSnippet } from '../../../components/CodeSnippet';

class PageController extends Controller {
    onInit() {
        const data = this.generateData();
        this.store.set("$page.data", data);
        this.store.init("$page.filter", {
            name: null,
            phone: null,
            city: null
        });

        this.addTrigger(
            "filter",
            ["$page.filter"],
            (filter) => {
                if (!(filter.name || filter.phone || filter.city)) {
                    this.store.set("$page.filteredData", this.store.get("$page.data"));
                    return;
                }

                var filtered = flattenTree(this.store.get("$page.data"));

                if (filter.name) {
                    var checks = filter.name.split(" ").map((w) => new RegExp(w, "gi"));
                    filtered = filtered.filter((x) =>
                        checks.every((ex) => x.fullName.match(ex))
                    );
                }

                if (filter.phone) {
                    filtered = filtered.filter(
                        (x) => x.phone.indexOf(filter.phone) != -1
                    );
                }

                if (filter.city) {
                    filtered = filtered.filter((x) => x.city.indexOf(filter.city) != -1);
                }

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

function flattenTree(treeData) {
    // Using DFS to flatten the tree
    if (!treeData) return [];
    var list = [];

    for (const child of treeData) {
        if (child.$leaf) {
            list.push({
                ...child,
                $level: 0
            });
        } else {
            list.push({
                ...child,
                $level: 0,
                $children: undefined
            });
            list = list.concat(flattenTree(child.$children));
        }
    }

    return list;
}

export const SearchingTreeGrid = <cx>
    <div controller={PageController}>
        <Md>
            # Searching Tree Grid
            `Tree Grid` supports searching. Let's have a look at the example:

            <CodeSplit>
                <div class="widgets">
                    <Grid
                        records-bind="$page.filteredData"
                        style={{ width: "100%" }}
                        mod="tree"
                        dataAdapter={{
                            type: TreeAdapter
                        }}
                        emptyText="No data for specified filter criteria."
                        columns={[
                            {
                                field: "fullName",
                                header1: "Name",
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
                                ),
                                header2: {
                                    allowSorting: false,
                                    items: (
                                        <TextField
                                            value-bind="$page.filter.name"
                                            reactOn="enter blur"
                                            style="width:100%"
                                        />
                                    )
                                }
                            },
                            {
                                header1: "Phone",
                                header2: {
                                    items: (
                                        <TextField
                                            value-bind="$page.filter.phone"
                                            reactOn="enter blur"
                                            style="width:100%"
                                        />
                                    )
                                },
                                field: "phone"
                            },
                            {
                                header1: "City",
                                header2: {
                                    allowSorting: false,
                                    items: (
                                        <TextField
                                            value-bind="$page.filter.city"
                                            reactOn="enter blur"
                                            style="width:100%"
                                        />
                                    )
                                },
                                field: "city"
                            }
                        ]}
                    />
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code.tab" tab="code" mod="code" text="Searching Tree Grid" default />

                    <CodeSnippet visible-expr="{$page.code.tab}=='code'" fiddle="rCf5Khho">{`
                        // Allow filtering by name, phone, and city
                        this.store.init("$page.filter", {
                            name: null,
                            phone: null,
                            city: null
                        });

                        this.addTrigger(
                            "filter",
                            ["$page.filter"],
                            (filter) => {
                                if (!(filter.name || filter.phone || filter.city)) {
                                    this.store.set("$page.filteredData", this.store.get("$page.data"));
                                    return;
                                }

                                // First, flatten the tree, then filter it
                                var filtered = flattenTree(this.store.get("$page.data"));

                                if (filter.name) {
                                    var checks = filter.name.split(" ").map((w) => new RegExp(w, "gi"));
                                    filtered = filtered.filter((x) =>
                                        checks.every((ex) => x.fullName.match(ex))
                                    );
                                }

                                if (filter.phone) {
                                    filtered = filtered.filter(
                                        (x) => x.phone.indexOf(filter.phone) != -1
                                    );
                                }

                                if (filter.city) {
                                    filtered = filtered.filter((x) => x.city.indexOf(filter.city) != -1);
                                }

                                this.store.set("$page.filteredData", filtered);
                            },
                            true
                        );

                        function flattenTree(treeData) {
                            if (!treeData) return [];
                            var list = [];

                            for (const child of treeData) {
                                if (child.$leaf) {
                                    list.push({
                                        ...child,
                                        $level: 0
                                    });
                                } else {
                                    list.push({
                                        ...child,
                                        $level: 0,
                                        $children: undefined
                                    });
                                    list = list.concat(flattenTree(child.$children));
                                }
                            }

                            return list;
                        }
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>

            To achieve the desired outcome, we utilised a `Grid` with a tree structure.
            We enabled filtering based on certain parameters and traversed the entire tree.
            While traversing, we flattened our tree to make filtering easier. Finally, we
            applied filters and updated data presented in the `Tree Grid`.
        </Md>
    </div>
</cx>