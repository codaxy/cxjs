import {createFunctionalComponent, Format, computable, enableCultureSensitiveFormatting} from "cx/ui";
import {useInterval, ref, useTrigger, useStoreMethods, useStore, useState, useCleanup} from "cx/hooks";
import {Button} from "cx/widgets";

enableCultureSensitiveFormatting();

const Clock = createFunctionalComponent(({value}) => {
   let valueRef = useState(Date.now());
   let timer = null;

   let stop = () => {
      clearInterval(timer);
   };

   let start = () => {
      stop();
      timer = setInterval(() => {
         valueRef.set(Date.now());
      }, 1000)
   };

   useCleanup(stop);

   start();

   let oneHourMore = computable(valueRef, time => time + 60 * 60 * 1000);

   return <cx>
      <div text={() => Format.value(valueRef.get(), "time")}/>
      <div text={() => Format.value(oneHourMore(), "datetime;HHMMSS")}/>
      <Button onClick={stop}>Stop</Button>
      <Button onClick={start}>Start</Button>
   </cx>
});

export default <cx>
   <div>
      <Clock value-bind="time"/>
      <div text-tpl="T{time2:time}"/>
   </div>
</cx>