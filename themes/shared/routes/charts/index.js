import { HtmlElement, Section, FlexRow } from 'cx/widgets';

import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';

export default <cx>
   <span putInto="breadcrumbs">Charts</span>

   <FlexRow pad spacing wrap>
      <Section mod="card" style="flex:1" title="Line Chart">
         <LineChart />
      </Section>
      <Section mod="card" style="flex:1" title="Bar Chart">
         <BarChart />
      </Section>
      <Section mod="card" style="flex:1" title="Pie Chart">
         <PieChart />
      </Section>
   </FlexRow>
</cx>
