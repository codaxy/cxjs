import { Content, Controller } from "cx/ui";
import { Md } from "../../../components/Md";
import { CodeSplit } from "../../../components/CodeSplit";
import { CodeSnippet } from "../../../components/CodeSnippet";
import { Grid, Tab, TextField } from "cx/widgets";
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
    }
}

export const Filtering = <cx>
    <div controller={PageController}>
        <Md>
            # Grid Filtering

            When it comes to `Grid`, it is common to require a functionality for filtering records.
            One way to accomplish that is by specifying `filterParams` and `onCreateFilter`.

            <CodeSplit>
                <div>
                    <div style="margin: 20px 0 10px 0">
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
                        style={{ height: "300px" }}
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
                            style={{ height: "300px" }}
                        />
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>
        </Md>
    </div>
</cx >