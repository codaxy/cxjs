import {Content, ContentPlaceholder, Button, TextField, PureContainer} from 'cx/widgets';

var AppLayout = <cx>
   <div>
      <header><ContentPlaceholder name="header" /></header>
      <ContentPlaceholder/>
      <ContentPlaceholder name="modules"/>
   </div>
</cx>;

var MainLayout = <cx>
   <PureContainer>
      <main>
         <ContentPlaceholder/>
      </main>
      <footer>
         <ContentPlaceholder name="footer" />
      </footer>
   </PureContainer>
</cx>;


export default <cx>
   <PureContainer outerLayout={AppLayout}>
      <PureContainer outerLayout={MainLayout}>
         Content
         <PureContainer putInto="footer">Footer</PureContainer>
         <PureContainer putInto="header">Header</PureContainer>
      </PureContainer>
   </PureContainer>
</cx>