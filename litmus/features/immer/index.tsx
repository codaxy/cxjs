import { enableImmerMutate } from "cx-immer";
import { createAccessorModelProxy } from "cx/src/data/createAccessorModelProxy";
import { expr, Instance, Repeater } from "cx/ui";
import { Button, TextField } from "cx/widgets";

enableImmerMutate();

interface Record {
   id: number;
   text: string;
}

interface Model {
   a: number;
   records: Record[];
}

interface WithRecord extends Model {
   $record: Record;
}

let m = createAccessorModelProxy<Model>();

let { $record } = createAccessorModelProxy<WithRecord>();

export default (
   <cx>
      <div>
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
         <Repeater records={m.records}>
            <div>
               <div text={expr($record, (r) => `Item ${r.id} - ${r.text}`)} />
               <TextField value={{ bind: $record.text }} />
            </div>
         </Repeater>
      </div>
   </cx>
);
