import {
   PureContainer,
   ContentPlaceholder
} from "cx/widgets";

export default (
   <cx>
      <div>
         <ContentPlaceholder name="footer"/>
         <PureContainer putInto="footer-content">works</PureContainer>
         <PureContainer putInto="footer">
            It
            <ContentPlaceholder name="footer-content">
               doesn't work
            </ContentPlaceholder>
         </PureContainer>
      </div>
   </cx>
);