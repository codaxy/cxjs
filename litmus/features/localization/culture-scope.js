import { PrivateStore, bind, enableCultureSensitiveFormatting, createCulture, Content, ContentResolver } from "cx/ui";
import { Button, Grid } from "cx/widgets";

enableCultureSensitiveFormatting();

const CultureScope = ({ culture, numberCulture, dateCulture, children, data }) => (
   <cx>
      <ContentResolver
         params={{ culture, numberCulture, dateCulture }}
         onResolve={(params) => {
            let cultureInfo = createCulture(params);
            return (
               <cx>
                  <PrivateStore culture={cultureInfo} detached data={data}>
                     {children}
                  </PrivateStore>
               </cx>
            );
         }}
      />
   </cx>
);

export default (
   <cx>
      <div
         controller={{
            onInit() {
               this.store.init("today", new Date().toISOString());
               this.store.init("number", 123456.789);
            },
            onSetEnglish() {
               this.store.set("culture", "en");
            },
            onSetSerbian() {
               this.store.set("culture", "sr");
            },
            onSetGerman() {
               this.store.set("culture", "de");
            },
         }}
      >
         <Button onClick="onSetEnglish">English</Button>
         <Button onClick="onSetSerbian">Srpski</Button>
         <Button onClick="onSetGerman">German</Button>

         <div style="font-weight: bold; font-size: 14px; margin-top: 10px">Root Level</div>
         <div text-tpl="Date: {today:dt}" />
         <div text-tpl="Number: {number:n;4}" />
         <Grid
            records={[{ abc: 10000, date: Date.now() }]}
            border
            columns={[
               { field: "abc", header: "Value", format: "n;2" },
               { field: "date", header: "Date", format: "dt" },
            ]}
         />

         <CultureScope culture-bind="culture" data={{ number: bind("number"), today: bind("today") }}>
            <div style="font-weight: bold; font-size: 14px; margin-top: 20px">Culture Scope</div>
            <div text-tpl="Date: {today:dt}" />
            <div text-tpl="Number: {number:n;4}" />
            <Grid
               records={[{ abc: 10000, date: Date.now() }]}
               border
               columns={[
                  { field: "abc", header: "Value", format: "n;2" },
                  { field: "date", header: "Date", format: "dt" },
               ]}
            />

            <CultureScope
               culture="it-CH"
               numberCulture-bind="culture"
               data={{ number: bind("number"), today: bind("today") }}
            >
               <div style="font-weight: bold; font-size: 14px; margin-top: 20px">Nested Culture: IT-CH</div>
               <div text-tpl="Date: {today:dt}" />
               <div text-tpl="Number: {number:n;4}" />
               <Grid
                  records={[{ abc: 10000, date: Date.now() }]}
                  border
                  columns={[
                     { field: "abc", header: "Value", format: "n;2" },
                     { field: "date", header: "Date", format: "dt" },
                  ]}
               />
            </CultureScope>
            <PrivateStore
               detached
               data={{
                  today: bind("today"),
                  number: bind("number"),
               }}
            >
               <div style="font-weight: bold; font-size: 14px; margin-top: 20px">Private Store (inherit)</div>
               <div text-tpl="Date: {today:dt}" />
               <div text-tpl="Number: {number:n;4}" />
               <Grid
                  records={[{ abc: 10000, date: Date.now() }]}
                  border
                  columns={[
                     { field: "abc", header: "Value", format: "n;2" },
                     { field: "date", header: "Date", format: "dt" },
                  ]}
               />
            </PrivateStore>
         </CultureScope>
      </div>
   </cx>
);
