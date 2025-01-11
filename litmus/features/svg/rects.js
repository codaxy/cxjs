import {Svg, Rectangle} from "cx/svg";
import {Chart} from 'cx/charts';

export default <cx>
   <Svg style="width:400px;height:400px;background:white" padding={5}>
      <Rectangle anchors="0 .25 .25 0" margin={5} colorIndex={0} rx={25}/>
      <Rectangle anchors="0 .5 .25 .25" margin={5} colorIndex={1} rx="10in" ry="15%"/>
      <Rectangle anchors="0 .75 .25 .5" margin={5} colorIndex={2} rx="7px" ry="12" />
      <Rectangle anchors="0 1 .25 .75" margin={5} colorIndex={3} rx="3%"/>

      <Rectangle anchors=".25 .25 .5 0" margin={5} colorIndex={7} ry="5mm"/>
      <Rectangle anchors=".25 .5 .5 .25" margin={5} colorIndex={6} rx="0.2in" ry="2em"/>
      <Rectangle anchors=".25 .75 .5 .5" margin={5} colorIndex={5} />
      <Rectangle anchors=".25 1 .5 .75" margin={5} colorIndex={4} />

      <Rectangle anchors=".5 .25 .75 0" margin={5} colorIndex={8} />
      <Rectangle anchors=".5 .5 .75 .25" margin={5} colorIndex={9} />
      <Rectangle anchors=".5 .75 .75 .5" margin={5} colorIndex={10} />
      <Rectangle anchors=".5 1 .75 .75" margin={5} colorIndex={11} />

      <Rectangle anchors=".75 .25 1 0" margin={5} colorIndex={15} />
      <Rectangle anchors=".75 .5 1 .25" margin={5} colorIndex={14} />
      <Rectangle anchors=".75 .75 1 .5" margin={5} colorIndex={13} />
      <Rectangle anchors=".75 1 1 .75" margin={5} colorIndex={12} />
   </Svg>
</cx>