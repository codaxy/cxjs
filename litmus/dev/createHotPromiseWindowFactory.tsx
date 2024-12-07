import { Store } from "cx/data";
import { Button, createHotPromiseWindowFactoryWithProps, Window } from "cx/widgets";

let getInfo2 = createHotPromiseWindowFactoryWithProps(module, (id: string) => (resolve, reject) => {
   let result = null;
   return Window.create({
      title: id,
      onDestroy: () => resolve(result),
      children: (
         <cx>
            <div>Hello4</div>
            <Button
               onClick={async () => {
                  let result = await getInfo2(id);
                  console.log(result);
               }}
            >
               One more
            </Button>
         </cx>
      ),
   });
});

function getInfo() {
   return new Promise((resolve, reject) => {
      let result = null;
      let window = Window.create({
         title: "Hello",
         onDestroy: () => resolve(result),
         children: (
            <cx>
               <div>Text123456</div>
            </cx>
         ),
      });
      let store = new Store();
      window.open(store);
   });
}

export default (
   <cx>
      <Button
         onClick={async (e, { store }) => {
            let result = await getInfo();
            console.log(result);
         }}
         text="Open Modal Window"
      />

      <Button
         onClick={async (e, { store }) => {
            let result = await getInfo2(Math.random().toString());
            console.log(result);
         }}
         text="Open Hot Modal Window"
      />
   </cx>
);
