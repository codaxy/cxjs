import {
  bind,
  createAccessorModelProxy,
  createFunctionalComponent,
  KeySelection,
} from "cx/ui";
import {
  Button,
  Grid,
  GridColumnConfig,
  LookupField,
  PureContainer,
} from "cx/widgets";

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
    <Button
      text="Show Grid"
      onClick={(e, { store }) => store.toggle(m.$page.showGrid)}
    />

    <PureContainer visible={m.$page.showGrid}>
      <PureContainer>
        <PureContainer>
          <LookupField
            label="Tags"
            options={tags}
            value={m.$page.tag}
            optionTextField="name"
          />
          <Grid
            columns={columns}
            filterParams={{
              tag: m.$page.tag,
            }}
            infinite
            scrollable
            style="height: 400px"
            cached
            remoteSort
            selection={{ type: KeySelection }}
            sortDirection={bind("sortDir")}
            sortField={bind("sortField")}
            onFetchRecords={async ({}, { store }) => {
              const tag = store.get(m.$page.tag);
              await new Promise((resolve) => setTimeout(resolve, 300));
              const response = await fetch(`https://dummyjson.com/posts`);
              const data = await response.json();
              let finalData = data.posts;

              if (tag) {
                finalData = finalData.filter((post) => post.tags.includes(tag));
              }

              return finalData;
            }}
          />
        </PureContainer>
      </PureContainer>
    </PureContainer>
  </cx>
));
