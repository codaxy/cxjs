import { enableImmerMutate } from "cx-immer";
import { createAccessorModelProxy } from "cx/src/data/createAccessorModelProxy";
import { bind, expr, Instance, KeySelection, Repeater } from "cx/ui";
import { Button, List, TextField } from "cx/widgets";

enableImmerMutate();

interface Record {
   id: number;
   text: string;
}

interface Model {
   a: number;
   records: Record[];
   selection: number;
}

interface WithRecord extends Model {
   $record: Record;
}

let m = createAccessorModelProxy<Model>();

let { $record } = createAccessorModelProxy<WithRecord>();

export default (
   <cx>
      <div styles="display: flex">
         Hello
         <Button
            text={m.a}
            onClick={(e, { store }: Instance<Model>) => {
               store.mutate(m.a, (a) => (a ?? 0) + 1);
               store.mutate((s) => {
                  if (s.records == null) s.records = [];
                  s.records.push({
                     id: s.records.length + 1,
                     text: null,
                  });
               });
            }}
         />
         <div>
            <Repeater records={m.records}>
               <div>
                  <div text={expr($record, (r) => `Item ${r.id} - ${r.text}`)} />
                  <TextField value={bind($record.text)} />
               </div>
            </Repeater>
         </div>
         <List
            records={m.records}
            selection={{
               type: KeySelection,
               bind: m.selection,
            }}
         >
            <div text={$record.text} />
         </List>
      </div>
   </cx>
);
