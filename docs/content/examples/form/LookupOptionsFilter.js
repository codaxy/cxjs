import { Controller, LabelsTopLayout } from "cx/ui";
import { Checkbox, Content, Grid, LookupField, Tab } from "cx/widgets";
import { CodeSnippet } from "../../../components/CodeSnippet";
import { CodeSplit } from "../../../components/CodeSplit";
import { Md } from "../../../components/Md";
import { casual } from "../data/casual";

class PageController extends Controller {
   onInit() {
      if (!this.countries) {
         this.countries = [
            { name: "Austria", code: "AT", capital: "Vienna", continent: "Europe", active: true },
            { name: "Cyprus", code: "CY", capital: "Nicosia", continent: "Europe", active: true },
            { name: "Bosnia and Herzegovina", code: "BA", capital: "Sarajevo", continent: "Europe", active: false },
            { name: "Nicaragua", code: "NI", capital: "Managua", continent: "North America", active: true },
            { name: "Morocco", code: "MA", capital: "Rabat", continent: "Africa", active: true },
         ];

         this.store.set("$page.countries", this.countries);
      }

      this.store.init("$page.client", { name: casual.full_name, domicile: "AT", nationality: "BA" });
   }
}

export const LookupOptionsFilter = (
   <cx>
      <Md controller={PageController}>
         # Lookup Options Filter
         <CodeSplit>
            The following examples show how to use `LookupField` options filtering.

            When using options based lookup, sometimes there is a requirement to support filtering of the already loaded options.
            Since `LookupField` uses `List` widget to render drop-down contents, we can specify `filterParams` and `onCreateFilter`
            configuration through `listOptions` property to achieve this. However, when using `listOptions`,
            `minOptionsForSearchField` and `empty text` are not behaving correctly since `LookupField` doesn't consider `List` filtering.

            To avoid this behavior, `filterParams` and `onCreateVisibleOptionsFilter` callback were introduced.

            Following example showcases usage of the `onCreateVisibleOptionsFilter` callback to achieve
            *advanced* filtering scenario. **Domicile** and **Nationality** lookup fields display only `active`
            countries, unless country is already selected, in which case it is kept in the list.

            *Try changing countries `active` status to observe the affects onto lookup fields:*
            <div>
               <h2 style="margin-top: 20px">Form</h2>
               <div layout={{ type: LabelsTopLayout, vertical: true }}>
                  <LookupField
                     label="Domicile"
                     value-bind="$page.client.domicile"
                     options-bind="$page.countries"
                     optionIdField="code"
                     optionTextField="name"
                     filterParams-bind="$page.countries"
                     onCreateVisibleOptionsFilter={(countries, { store }) => {
                        let code = store.get("$page.client.domicile");
                        return (option) => option.code == code || option.active;
                     }}
                     minOptionsForSearchField={2}
                  />
                  <LookupField
                     label="Nationality"
                     value-bind="$page.client.nationality"
                     options-bind="$page.countries"
                     optionIdField="code"
                     optionTextField="name"
                     filterParams-bind="$page.countries"
                     onCreateVisibleOptionsFilter={(countries, { store }) => {
                        let code = store.get("$page.client.nationality");
                        return (option) => option.code == code || option.active;
                     }}
                     minOptionsForSearchField={2}
                  />
               </div>

               <hr style={{ margin: "30px 0" }} />

               <h4>Countries</h4>
               <Grid
                  records-bind="$page.countries"
                  columns={[
                     { field: "name", header: "Country", defaultWidth: 200 },
                     { field: "code", header: "Code", defaultWidth: 100 },
                     { field: "capital", header: "Capital", defaultWidth: 120 },
                     { field: "continent", header: "Contient", defaultWidth: 120 },
                     {
                        field: "active",
                        header: "Active",
                        items: (
                           <cx>
                              <Checkbox value-bind="$record.active" />
                           </cx>
                        ),
                        align: "center",
                        defaultWidth: 80,
                     },
                  ]}
                  scrollable
               />
            </div>
            <Content name="code">
               <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" />
               <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />

               <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="2ISVGCiL">{`
                    class PageController extends Controller {
                        onInit() {
                            if (!this.countries) {
                               this.countries = [
                                  { name: "Austria", code: "AT", capital: "Vienna", continent: "Europe", active: true },
                                  { name: "Cyprus", code: "CY", capital: "Nicosia", continent: "Europe", active: true },
                                  { name: "Bosnia and Herzegovina", code: "BA", capital: "Sarajevo", continent: "Europe", active: false },
                                  { name: "Nicaragua", code: "NI", capital: "Managua", continent: "North America", active: true },
                                  { name: "Morocco", code: "MA", capital: "Rabat", continent: "Africa", active: true },
                               ];

                               this.store.set("$page.countries", this.countries);
                            }

                            this.store.init("$page.client", { name: casual.full_name, domicile: "AT", nationality: "BA" });
                         }
                    }
                `}</CodeSnippet>
               <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="2ISVGCiL">{`
                    <div>
                        <h2 style="margin-top: 20px">Form</h2>
                        <div layout={{ type: LabelsTopLayout, vertical: true }}>
                        <LookupField
                            label="Domicile"
                            value-bind="$page.client.domicile"
                            options-bind="$page.countries"
                            optionIdField="code"
                            optionTextField="name"
                            filterParams-bind="$page.countries"
                            onCreateVisibleOptionsFilter={(countries, { store }) => {
                                let code = store.get("$page.client.domicile");
                                return (option) => option.code == code || option.active;
                            }}
                            minOptionsForSearchField={2}
                        />
                        <LookupField
                            label="Nationality"
                            value-bind="$page.client.nationality"
                            options-bind="$page.countries"
                            optionIdField="code"
                            optionTextField="name"
                            filterParams-bind="$page.countries"
                            onCreateVisibleOptionsFilter={(countries, { store }) => {
                                let code = store.get("$page.client.nationality");
                                return (option) => option.code == code || option.active;
                            }}
                            minOptionsForSearchField={2}
                        />
                        </div>

                        <hr style={{ margin: "30px 0" }} />

                        <h4>Countries</h4>
                        <Grid
                        records-bind="$page.countries"
                        columns={[
                            { field: "name", header: "Country", defaultWidth: 200 },
                            { field: "code", header: "Code", defaultWidth: 100 },
                            { field: "capital", header: "Capital", defaultWidth: 120 },
                            { field: "continent", header: "Contient", defaultWidth: 120 },
                            {
                                field: "active",
                                header: "Active",
                                items: (
                                    <cx>
                                    <Checkbox value-bind="$record.active" />
                                    </cx>
                                ),
                                align: "center",
                                defaultWidth: 80,
                            },
                        ]}
                        scrollable
                        />
                    </div>
                `}</CodeSnippet>
            </Content>
         </CodeSplit>
      </Md>
   </cx>
);
