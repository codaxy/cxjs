import { bind, tpl } from "cx/ui";
import { Grid } from "cx/widgets";

// let grouper = new Grouper({ name: { bind: "name" } });

// grouper.processAll();

// console.log(grouper.getResults());

export default (
   <cx>
      <div>
         <Grid
            records={[
               { name: "Marko", count: 1 },
               { name: "Ogi", count: 2 },
               { name: "Alex", count: 3 },
               { name: "Alex", count: 5 },
            ]}
            columns={[
               { field: "name", header: "Name" },
               { field: "count", header: "Count" },
            ]}
            grouping={[{ key: { name: bind("$record.name") }, showCaption: true, caption: tpl("{$group.name}") }]}
            preserveGroupOrder
            sortField="count"
            sortDirection="DESC"
         />
      </div>
   </cx>
);
