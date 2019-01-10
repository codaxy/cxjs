import {Content, ContentPlaceholder, Button, TextField} from 'cx/widgets';

var AppLayout = <cx>
   <div style={{height: '200px', width: '300px', display: 'flex', flexDirection: 'column', border: '1px solid black'}}>
      <header style={{background: "lightblue", padding: '5px'}}>App Header</header>
      <div style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
         <aside style={{width: '70px', background: 'lightgray', padding: '5px'}}>
            <ContentPlaceholder name="sidebar"/>
         </aside>
         <main style={{flex: 1, padding: '5px'}}>
            <ContentPlaceholder /* name="body" *//>
         </main>
      </div>
   </div>
</cx>;

export default <cx>
   <div style="padding: 50px">
      <TextField value:bind="value" />

      <div outerLayout={AppLayout}>
         <Content name="sidebar">
            Test
            <TextField value:bind="value" />
         </Content>
         Main 1
         <TextField value:bind="value" />
      </div>

      <Button
         onClick={(e, {store}) => { store.toggle('x')}}
      >
         X
      </Button>

      <TextField value:bind="value" />
   </div>
</cx>