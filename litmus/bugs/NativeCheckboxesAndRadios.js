import {Checkbox, Radio, HtmlElement} from 'cx/widgets';

export default <cx>

   <div style="padding: 100px">
      <h3>Checkbox</h3>
      <p>
         <Checkbox value:bind="x" native/>
      </p>

      <p>
         <Checkbox value:bind="x"/>
      </p>

      <h3>Checkbox</h3>
      <p>
         <Radio value:bind="y" native option={1}/>
      </p>

      <p>
         <Radio value:bind="y" option={2}/>
      </p>
   </div>
</cx>
