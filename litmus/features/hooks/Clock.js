import {createFunctionalComponent, Format} from "cx/ui";
import {useInterval, ref} from "cx/hooks";

const Clock = createFunctionalComponent(() => {
   let time = ref("time", Date.now());
   useInterval(() => time.set(Date.now()), 1000);

   return <cx>
      <div text={() => Format.value(time.get(), "time")} />
   </cx>
});

export default <cx>
   <Clock/>
</cx>