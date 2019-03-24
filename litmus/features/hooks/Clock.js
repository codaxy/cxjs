import {createFunctionalComponent, Format, computable} from "cx/ui";
import {useInterval, ref, useTrigger, useStoreMethods} from "cx/hooks";

const Clock = createFunctionalComponent(() => {
   let time = ref("time", Date.now());
   useInterval(() => time.set(Date.now()), 1000);
   let {get, set} = useStoreMethods();

   useTrigger([time], time => {
      set("time2", time);
   });

   let oneHourMore = computable(time, time => time + 60 * 60 * 1000);

   return <cx>
      <div text={() => Format.value(time.get(), "time")}/>
      <div text={() => Format.value(oneHourMore(), "time")}/>
   </cx>
});

export default <cx>
   <div>
      <Clock/>
      <div text-tpl="T{time2:time}"/>
   </div>
</cx>