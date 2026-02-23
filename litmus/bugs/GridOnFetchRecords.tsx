import { bind, createAccessorModelProxy, createFunctionalComponent, KeySelection } from "cx/ui";
import { Grid, GridColumnConfig } from "cx/widgets";

const tags = ["history", "american", "crime", "tets"].map((tag) => ({
   name: tag,
   id: tag,
}));

interface Model {
   $page: {
      showGrid: boolean;
      tag: string;
   };
}

const m = createAccessorModelProxy<Model>();

const columns = [
   {
      field: "id",
      header: "ID",
   },
   {
      field: "title",
      header: "Title",
   },
   {
      field: "body",
      header: "Body",
   },
] as GridColumnConfig[];

export default createFunctionalComponent(() => (
   <cx>
      {/* <Button text="Show Grid" onClick={(e, { store }) => store.toggle(m.$page.showGrid)} /> */}

      <div>
         <Grid
            columns={columns}
            infinite
            emptyText="No data"
            scrollable
            remoteSort
            selection={{ type: KeySelection, bind: "$page.selection", keyField: "id" }}
            sortDirection={bind("sortDir")}
            sortField={bind("sortField")}
            onFetchRecords={async ({}) => {
               const response = await fetch(`https://dummyjson.com/posts`);
               const data = await response.json();
               let finalData = data.posts;

               return {
                  records: finalData,
                  totalRecordCount: finalData.length,
               };
            }}
         />
      </div>
   </cx>
));
