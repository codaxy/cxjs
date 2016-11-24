import {HtmlElement} from 'cx/ui/HtmlElement';
import {Section} from 'cx/ui/Section';
import {FlexRow} from 'cx/ui/layout/FlexBox';

import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';

export default <cx>
   <span putInto="breadcrumbs">Charts</span>

   <FlexRow pad spacing wrap>
      <Section mod="well" style="flex:1" title="Line Chart">
         <LineChart />
      </Section>
      <Section mod="well" style="flex:1" title="Bar Chart">
         <BarChart />
      </Section>
      <Section mod="well" style="flex:1" title="Pie Chart">
         <PieChart />
      </Section>
   </FlexRow>
</cx>
