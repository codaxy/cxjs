import {
    HtmlElement,
    TextField,
    Checkbox,
    Grid,
    Submenu,
    Menu,
    Icon,
    Repeater,
    FlexRow,
    Slider,
    Tab
} from 'cx/widgets';
import {
    Content,
    Controller,
    bind,
    KeySelection,
    Rescope
} from 'cx/ui';
import { Md } from '../../../components/Md';
import { CodeSplit } from '../../../components/CodeSplit';
import { CodeSnippet } from '../../../components/CodeSnippet';

import { casual } from '../data/casual';

function unique(data, field) {
    let values = {};
    data.forEach(item => {
        values[item[field]] = true;
    });
    return Object.keys(values).map(name => ({ name: name, active: true }));
}

function filter(filter, records) {
    return records.filter(record => {
        let os = filter.OSes.find(os => os.name === record.OS).active;
        let br = filter.browsers.find(br => br.name === record.browser).active;
        let continent = filter.continents.find(c => c.name === record.continent).active;
        let name = filter.name ? record.fullName.toLowerCase().includes(filter.name.toLowerCase()) : true;
        let visits = filter.visits ? (record.visits >= filter.visits.from && record.visits <= filter.visits.to) : true;
        return os && br && continent && name && visits;
    });
}


class PageController extends Controller {
    init() {
        super.init();

        this.store.init("visibility", {
            name: true,
            continent: true,
            browser: true,
            OS: false,
            visits: true
        });

        let records = Array
            .from({ length: 10 })
            .map((v, i) => ({
                id: i + 1,
                fullName: casual.full_name,
                continent: casual.continent,
                browser: casual.browser,
                OS: casual.operating_system,
                visits: casual.integer(1, 100)
            }));

        //init grid data
        this.store.set("records", records);

        this.store.set("filter.continents", unique(records, "continent"));
        this.store.set("filter.browsers", unique(records, "browser"));
        this.store.set("filter.OSes", unique(records, "OS"));
        this.store.set('filter.name', '');
        this.store.set('filter.visits', { from: 0, to: 100 });

        //this.store.set("filtered", filter(this.store.get('filter'), records));

        this.addTrigger('filter', ['filter'], (filters) => {
            this.store.set('filtered', filter(filters, this.store.get('records')));
        }, true);
    }
};

const visibleColumnsMenu = (
    <cx>
        <Submenu arrow>
            Columns
            <Menu putInto="dropdown">
                <Checkbox value={bind("visibility.continent")} mod="menu">
                    Continent
                </Checkbox>
                <Checkbox value={bind("visibility.browser")} mod="menu">
                    Browser
                </Checkbox>
                <Checkbox value={bind("visibility.OS")} mod="menu">
                    Operating System
                </Checkbox>
                <Checkbox value={bind("visibility.visits")} mod="menu">
                    Visits
                </Checkbox>
            </Menu >
        </Submenu >
    </cx >
);

const columnMenu = filter => (
    <cx>
        <Menu horizontal itemPadding="none">
            <Submenu placement="down-left" style="margin: 5px">
                <span style="padding: 3px">
                    <Icon name={"menu"} />
                </span>
                <Menu putInto="dropdown">
                    {filter}
                    <hr />
                    {visibleColumnsMenu}
                </Menu>
            </Submenu>
        </Menu>
    </cx>
);

const stdColumnMenu = (valuesPath) => columnMenu(
    <cx>
        <Repeater records={bind(valuesPath)}>
            <Checkbox
                mod="menu"
                value={bind("$record.active")}
                text={bind("$record.name")}
            />
        </Repeater>
    </cx >
);

export const HeaderMenu = <cx>
    <Md>
        <CodeSplit>
            # Grid with a Header Menu

            With the use of Column Header's `tool` property, it's easy to define custom Header Menus.

            <Rescope bind="$page" controller={PageController}>
                <Grid
                    scrollable
                    emptyText="No records found matching the given criteria."
                    records={bind("filtered")}
                    columns={[
                        {
                            header: {
                                text: "Name",
                                tool: columnMenu(
                                    <cx>
                                        <TextField
                                            mod="menu"
                                            placeholder="Filter"
                                            value={bind("filter.name")}
                                        />
                                    </cx>
                                )
                            },
                            field: "fullName",
                            visible: bind("visibility.name"),
                            sortable: true
                        },
                        {
                            header: {
                                text: "Continent",
                                tool: stdColumnMenu("filter.continents")
                            },
                            field: "continent",
                            sortable: true,
                            visible: bind("visibility.continent")
                        },
                        {
                            header: {
                                text: "Browser",
                                tool: stdColumnMenu("filter.browsers")
                            },
                            field: "browser",
                            sortable: true,
                            visible: bind("visibility.browser")
                        },
                        {
                            header: {
                                text: "OS",
                                tool: stdColumnMenu("filter.OSes")
                            },
                            field: "OS",
                            sortable: true,
                            visible: bind("visibility.OS")
                        },
                        {
                            header: {
                                text: "Visits",
                                tool: columnMenu(
                                    <cx>
                                        <FlexRow mod="menu">
                                            <TextField
                                                value={bind("filter.visits.from")}
                                                style="width: 40px"
                                            />
                                            <Slider
                                                from={bind("filter.visits.from")}
                                                to={bind("filter.visits.to")}
                                                step={1}
                                            />
                                            <TextField
                                                value={bind("filter.visits.to")}
                                                style="width: 40px"
                                            />
                                        </FlexRow>
                                    </cx>
                                )
                            },
                            field: "visits",
                            sortable: true,
                            align: "right",
                            visible: bind("visibility.visits")
                        }
                    ]}
                    selection={{ type: KeySelection, bind: "selection" }}
                />
            </Rescope>

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller"/>
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="Gibc7IUr" >{`
               // utility functions
               function unique(data, field) {
                  let values = {};
                  data.forEach(item => {
                     values[item[field]] = true;
                  });
                  return Object.keys(values).map(name => ({ name: name, active: true }));
               }

               function filter(filter, records) {
                  return records.filter(record => {
                     let os = filter.OSes.find(os => os.name === record.OS).active;
                     let br = filter.browsers.find(br => br.name === record.browser).active;
                     let continent = filter.continents.find(c => c.name === record.continent).active;
                     let name = filter.name ? record.fullName.toLowerCase().includes(filter.name.toLowerCase()) : true;
                     let visits = filter.visits ? (record.visits >= filter.visits.from && record.visits <= filter.visits.to) : true;
                     return os && br && continent && name && visits;
                  });
               }

               // controller
               class PageController extends Controller {
                  init() {
                     super.init();

                     this.store.init("visibility", {
                        name: true,
                        continent: true,
                        browser: true,
                        OS: false,
                        visits: true
                     });

                     let records = Array
                        .from({ length: 10 })
                        .map((v, i) => ({
                           id: i + 1,
                           fullName: casual.full_name,
                           continent: casual.continent,
                           browser: casual.browser,
                           OS: casual.operating_system,
                           visits: casual.integer(1, 100)
                        }));

                     //init grid data
                     this.store.set("records", records);

                     this.store.set("filter.continents", unique(records, "continent"));
                     this.store.set("filter.browsers", unique(records, "browser"));
                     this.store.set("filter.OSes", unique(records, "OS"));
                     this.store.set('filter.name', '');
                     this.store.set('filter.visits', { from: 0, to: 100 });

                     this.store.set("filtered", filter(this.store.get('filter'), records));

                     this.addTrigger('filter', ['filter'], (filters) => {
                        this.store.set('filtered', filter(filters, this.store.get('records')));
                     }, true);
                  }
               };
            `}
                </CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="Gibc7IUr" >{`
                <Grid
                    scrollable
                    emptyText="No records found matching the given criteria."
                    records={bind("filtered")}
                    columns={[
                        {
                            header: {
                            text: "Name",
                            tool: columnMenu(
                                <cx>
                                    <TextField
                                    mod="menu"
                                    placeholder="Filter"
                                    value={bind("filter.name")}
                                    />
                                </cx>
                            )
                            },
                            field: "fullName",
                            visible: bind("visibility.name"),
                            sortable: true
                        },
                        {
                            header: {
                            text: "Continent",
                            tool: stdColumnMenu("filter.continents")
                            },
                            field: "continent",
                            sortable: true,
                            visible: bind("visibility.continent")
                        },
                        {
                            header: {
                            text: "Browser",
                            tool: stdColumnMenu("filter.browsers")
                            },
                            field: "browser",
                            sortable: true,
                            visible: bind("visibility.browser")
                        },
                        {
                            header: {
                            text: "OS",
                            tool: stdColumnMenu("filter.OSes")
                            },
                            field: "OS",
                            sortable: true,
                            visible: bind("visibility.OS")
                        },
                        {
                            header: {
                            text: "Visits",
                            tool: columnMenu(
                                <cx>
                                    <FlexRow mod="menu">
                                        <TextField
                                        value={bind("filter.visits.from")}
                                        style="width: 40px"
                                        />
                                        <Slider
                                        from={bind("filter.visits.from")}
                                        to={bind("filter.visits.to")}
                                        step={1}
                                        />
                                        <TextField
                                        value={bind("filter.visits.to")}
                                        style="width: 40px"
                                        />
                                    </FlexRow>
                                </cx>
                            )
                            },
                            field: "visits",
                            sortable: true,
                            align: "right",
                            visible: bind("visibility.visits")
                        }
                    ]}
                    selection={{ type: KeySelection, bind: "selection" }}
                />

                // header menu components
               const visibleColumnsMenu = (
                  <cx>
                     <Submenu arrow>
                        Columns
                        <Menu putInto="dropdown">
                           <Checkbox value={bind("visibility.continent")} mod="menu">
                              Continent
                           </Checkbox>
                           <Checkbox value={bind("visibility.browser")} mod="menu">
                              Browser
                           </Checkbox>
                           <Checkbox value={bind("visibility.OS")} mod="menu">
                              Operating System
                           </Checkbox>
                           <Checkbox value={bind("visibility.visits")} mod="menu">
                              Visits
                           </Checkbox>
                        </Menu >
                     </Submenu >
                  </cx >
               );

               const columnMenu = filter => (
                  <cx>
                     <Menu horizontal itemPadding="small">
                        <Submenu placement="down-left">
                           <span style={{ "padding": "4px" }}>
                              <Icon name={"menu"} />
                           </span>
                           <Menu putInto="dropdown">
                              {filter}
                              <hr />
                              {visibleColumnsMenu}
                           </Menu>
                        </Submenu>
                     </Menu>
                  </cx>
               );

               const stdColumnMenu = (valuesPath) => columnMenu(
                  <cx>
                     <Repeater records={bind(valuesPath)}>
                        <Checkbox
                           mod="menu"
                           value={bind("$record.active")}
                           text={bind("$record.name")}
                        />
                     </Repeater>
                  </cx >
               );
                `}
                    </CodeSnippet>
            </Content>
        </CodeSplit>
    </Md>
</cx>
