import {HtmlElement} from 'cx/ui/HtmlElement';
import {Section} from 'shared/components/Section';

import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';

export default <cx>
   <span putInto="breadcrumbs">Charts</span>

   <div class="flexrow phone">
      <Section mod="well" style="flex:1" title="Line Chart">
         <LineChart />
      </Section>
      <Section mod="well" style="flex:1" title="Bar Chart">
         <BarChart />
      </Section>
      <Section mod="well" style="flex:1" title="Pie Chart">
         <PieChart />
      </Section>
   </div>
</cx>
