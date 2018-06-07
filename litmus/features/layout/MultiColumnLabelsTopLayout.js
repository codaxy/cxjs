import {Content, ContentPlaceholder, Button, TextField, PureContainer} from 'cx/widgets';
import {LabelsTopLayout} from 'cx/ui';


export default <cx>
   <div layout={{type: LabelsTopLayout, columns: 2}}>
      <TextField label="Label1" value-bind="v1"/>
      <TextField label="Label1" value-bind="v1"/>
      <TextField label="Label1" value-bind="v1"/>
      <TextField label="Label1" value-bind="v1"/>
      <TextField label="Label1" value-bind="v1"/>
      <TextField label="Label1" value-bind="v1"/>
      <TextField label="Label1" value-bind="v1"/>
      <TextField label="Label1" value-bind="v1"/>
   </div>
</cx>