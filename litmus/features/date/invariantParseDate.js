import { Calendar, DateField, DateTimeField, MonthField, PureContainer, TimeField } from "cx/widgets";

export default (
   <cx>
      <PureContainer
         controller={{
            onInit() {
               this.store.set("date", "2024-12-13");
               this.store.set("datetime", "2020-02-20");
               this.store.set("time", "2024-11-10");
               this.store.set("month", "2024-01-01");
               this.store.set("calendar", "2022-12-31");
               this.store.set("list", "2022-12-31");
            },
         }}
      >
         <div style="display: flex; flex-direction: column; gap: 20px">
            <DateField value-bind="date" partial />
            <DateTimeField value-bind="datetime" partial />
            <TimeField value-bind="time" partial />
            <MonthField value-bind="month" />

            <Calendar value-bind="calendar" startWithMonday={false} />

            <TimeField picker="list" value-bind="list" />
            <div text-tpl="{date:date}" />
            <div text-tpl="{time:time}" />
         </div>
      </PureContainer>
   </cx>
);
