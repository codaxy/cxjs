import {FlexCol, FlexRow, HtmlElement, Icon, Calendar, Wheel, DateTimePicker, DateTimeField, DateField, TimeField} from "cx/widgets";

export default (
   <cx>
      <div style="padding: 10px;" ws>
         <Calendar value:bind="date" />
         <DateTimePicker value:bind="date" />
         <DateTimePicker value:bind="date" />
         <DateTimeField value:bind="date" />
         <DateField value:bind="date" partial />
         <DateTimeField value:bind="date" partial segment="date"/>
         <TimeField value:bind="date" partial />
      </div>
      <div style="padding: 10px;" ws>
         <div style="background: white; padding: 10px; display: inline-block" ws>
            <Wheel 
               value:bind="month"
               size={5}
               options={[
                  {id: 1, text: "Jan"},
                  {id: 2, text: "Feb"},
                  {id: 3, text: "Mar"},
                  {id: 4, text: "Apr"},
                  {id: 5, text: "May"},
                  {id: 6, text: "Jun"},
                  {id: 7, text: "Jul"},
                  {id: 8, text: "Aug"},
                  {id: 9, text: "Sep"},
                  {id: 10, text: "Oct"},
                  {id: 11, text: "Nov"},
                  {id: 12, text: "Dec"},
               ]}/>

            &nbsp; &nbsp;

            <Wheel 
               options={[
                  {id: 1, text: "01"},
                  {id: 2, text: "02"},
                  {id: 3, text: "03"},
                  {id: 4, text: "04"},
                  {id: 5, text: "05"},
                  {id: 6, text: "06"},
                  {id: 7, text: "07"},
                  {id: 8, text: "08"},
                  {id: 9, text: "09"},
                  {id: 10, text: "10"},
                  {id: 11, text: "11"},
                  {id: 12, text: "12"},
               ]}/>

            &nbsp; &nbsp;

            <Wheel
               options={[
                  {id: 1, text: "2000"},
                  {id: 2, text: "2001"},
                  {id: 3, text: "2002"},
                  {id: 4, text: "2003"},
                  {id: 5, text: "2004"},
                  {id: 6, text: "2005"},
                  {id: 7, text: "2006"},
                  {id: 8, text: "2007"},
                  {id: 9, text: "2008"},
                  {id: 10, text: "2009"},
                  {id: 11, text: "2010"},
                  {id: 12, text: "2011"},
               ]}/>

         </div>
         <div style="background: #eee; padding: 10px; display: inline-block" ws>

            <Wheel 
               options={[
                  {id: 2, text: "01"},
                  {id: 3, text: "02"},
                  {id: 4, text: "03"},
                  {id: 5, text: "04"},
                  {id: 6, text: "05"},
                  {id: 7, text: "06"},
                  {id: 8, text: "07"},
                  {id: 9, text: "08"},
                  {id: 10, text: "09"},
                  {id: 11, text: "10"},
                  {id: 12, text: "11"},
                  {id: 13, text: "12"},
               ]}/>

            &nbsp; : &nbsp;

            <Wheel 
               options={[
                  {id: 2, text: "00"},
                  {id: 3, text: "05"},
                  {id: 4, text: "10"},
                  {id: 5, text: "15"},
                  {id: 6, text: "20"},
                  {id: 7, text: "25"},
                  {id: 8, text: "30"},
                  {id: 9, text: "35"},
                  {id: 10, text: "40"},
                  {id: 11, text: "45"},
                  {id: 12, text: "50"},
                  {id: 12, text: "55"},
               ]}/>

            &nbsp; &nbsp;

            <Wheel 
               options={[
                  {id: 2, text: "AM"},
                  {id: 3, text: "PM"}
               ]}/>
         </div>

         <div style="background: white; padding: 10px; display: inline-block" ws>
            <Wheel 
               value:bind="month"
               options={[
                  {id: 1, text: "Jan"},
                  {id: 2, text: "Feb"},
                  {id: 3, text: "Mar"},
                  {id: 4, text: "Apr"},
                  {id: 5, text: "May"},
                  {id: 6, text: "Jun"},
                  {id: 7, text: "Jul"},
                  {id: 8, text: "Aug"},
                  {id: 9, text: "Sep"},
                  {id: 10, text: "Oct"},
                  {id: 11, text: "Nov"},
                  {id: 12, text: "Dec"},
               ]}/>
         </div>
      </div>
   </cx>
);
