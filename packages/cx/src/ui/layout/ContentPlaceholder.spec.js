import {Cx} from '../Cx';
import {VDOM} from '../Widget';
import {HtmlElement} from '../../widgets/HtmlElement';
import {Store} from '../../data/Store';
import {Controller} from '../Controller';
import {ContentPlaceholder} from "./ContentPlaceholder";

import renderer from 'react-test-renderer';
import assert from 'assert';
import {PureContainer} from "../PureContainer";

describe('ContentPlaceholder', () => {

   it('allows putting content inside', () => {
      let store = new Store();
      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <div>
               <header>
                  <ContentPlaceholder name="header"/>
               </header>
               <main>
                  <h2 putInto="header">Header</h2>
               </main>
            </div>
         </Cx>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         props: {},
         children: [
            {
               type: 'header',
               props: {},
               children: [{
                  type: 'h2',
                  props: {},
                  children: [
                     'Header'
                  ]
               }]
            }, {
               type: 'main',
               props: {},
               children: null
            }
         ]
      });
   });

   it('updates content on change', () => {
      let store = new Store({
         data: {
            headerText: 'Header'
         }
      });
      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <div>
               <ContentPlaceholder name="header"/>
               <h2 putInto="header" text:bind="headerText"/>
            </div>
         </Cx>
      );

      let getTree = headerText => ({
         type: 'div',
         props: {},
         children: [{
            type: 'h2',
            props: {},
            children: [headerText]
         }]
      });

      assert.deepEqual(component.toJSON(), getTree('Header'));
      store.set('headerText', 'Footer');
      assert.deepEqual(component.toJSON(), getTree('Footer'));
   });

   it('is used for defining body position in outer layouts', () => {
      let store = new Store();

      let layout = <cx>
         <div>
            <header>Header</header>
            <ContentPlaceholder/>
            <footer>Footer</footer>
         </div>
      </cx>;

      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <main outerLayout={layout}/>
         </Cx>
      );

      assert.deepEqual(component.toJSON(), {
         type: 'div',
         props: {},
         children: [{
            type: 'header',
            props: {},
            children: ['Header']
         }, {
            type: 'main',
            props: {},
            children: null
         }, {
            type: 'footer',
            props: {},
            children: ['Footer']
         }]
      });
   });

   it('data in deeply nested placeholders is correctly updated', () => {
      let store = new Store({
         data: {
            header: 'H',
            footer: 'F',
            body: 'B'
         }
      });

      let layout = <cx>
         <div>
            <header><ContentPlaceholder name="header"/></header>
            <ContentPlaceholder/>
            <footer><ContentPlaceholder name="footer"/></footer>
         </div>
      </cx>;

      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <main outerLayout={layout}>
               <div putInto="header"><span text:bind="header"/></div>
               <div putInto="footer"><span text:bind="footer"/></div>
               <span text:bind="body"/>
            </main>
         </Cx>
      );

      let getTree = (h, b, f) => ({
         type: 'div',
         props: {},
         children: [{
            type: 'header',
            props: {},
            children: [{type: 'div', props: {}, children: [{type: 'span', props: {}, children: [h]}]}]
         }, {
            type: 'main',
            props: {},
            children: [{type: 'span', props: {}, children: [b]}]
         }, {
            type: 'footer',
            props: {},
            children: [{type: 'div', props: {}, children: [{type: 'span', props: {}, children: [f]}]}]
         }]
      });

      assert.deepEqual(component.toJSON(), getTree('H', 'B', 'F'));
      store.set('header', 'H2');
      assert.deepEqual(component.toJSON(), getTree('H2', 'B', 'F'));
      store.set('footer', 'F2');
      assert.deepEqual(component.toJSON(), getTree('H2', 'B', 'F2'));
      store.set('body', 'B2');
      assert.deepEqual(component.toJSON(), getTree('H2', 'B2', 'F2'));
   });

   it('inside a two-level deep outer-layout works', () => {
      let store = new Store();

      let outerLayout = <cx>
         <div>
            <ContentPlaceholder/>
         </div>
      </cx>;

      let innerLayout = <cx>
         <main outerLayout={outerLayout}>
            <ContentPlaceholder/>
         </main>
      </cx>;


      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <section outerLayout={innerLayout}/>
         </Cx>
      );

      assert.deepEqual(component.toJSON(), {
         type: 'div',
         props: {},
         children: [{type: 'main', props: {}, children: [{type: 'section', props: {}, children: null}]}]
      });
   });

   it('inside a complex two-level-deep outer-layout works', () => {
      let store = new Store();

      let outerLayout = <cx>
         <div>
            <ContentPlaceholder/>
         </div>
      </cx>;

      let innerLayout = <cx>
         <PureContainer>
            <main outerLayout={outerLayout}>
               <ContentPlaceholder/>
            </main>
         </PureContainer>
      </cx>;


      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <section outerLayout={innerLayout}/>
         </Cx>
      );

      assert.deepEqual(component.toJSON(), {
         type: 'div',
         props: {},
         children: [{type: 'main', props: {}, children: [{type: 'section', props: {}, children: null}]}]
      });
   });

   it('each level use an outer-layout', () => {
      let store = new Store();

      let outerLayout1 = <cx>
         <div>
            <ContentPlaceholder/>
         </div>
      </cx>;

      let outerLayout2 = <cx>
         <main>
            <ContentPlaceholder/>
         </main>
      </cx>;


      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <PureContainer outerLayout={outerLayout1}>
               <PureContainer outerLayout={outerLayout2}>
                  Content
               </PureContainer>
            </PureContainer>
         </Cx>
      );

      assert.deepEqual(component.toJSON(), {
         type: 'div',
         props: {},
         children: [{type: 'main', props: {}, children: ["Content"]}]
      });
   });

   it('data in a two-level deep outer-layout is correctly updated', () => {
      let store = new Store({
         data: {
            header: 'H',
            footer: 'F',
            body: 'B'
         }
      });

      let outerLayout = <cx>
         <div>
            <ContentPlaceholder/>
            <footer><ContentPlaceholder name="footer"/></footer>
         </div>
      </cx>;

      let innerLayout = <cx>
         <PureContainer>
            <PureContainer outerLayout={outerLayout}>
               <header><ContentPlaceholder name="header"/></header>
               <ContentPlaceholder/>
            </PureContainer>
         </PureContainer>
      </cx>;

      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <main outerLayout={innerLayout}>
               <div putInto="header"><span text:bind="header"/></div>
               <div putInto="footer"><span text:bind="footer"/></div>
               <span text:bind="body"/>
            </main>
         </Cx>
      );

      let getTree = (h, b, f) => ({
         type: 'div',
         props: {},
         children: [{
            type: 'header',
            props: {},
            children: [{type: 'div', props: {}, children: [{type: 'span', props: {}, children: [h]}]}]
         }, {
            type: 'main',
            props: {},
            children: [{type: 'span', props: {}, children: [b]}]
         }, {
            type: 'footer',
            props: {},
            children: [{type: 'div', props: {}, children: [{type: 'span', props: {}, children: [f]}]}]
         }]
      });

      assert.deepEqual(component.toJSON(), getTree('H', 'B', 'F'));
      store.set('header', 'H2');
      assert.deepEqual(component.toJSON(), getTree('H2', 'B', 'F'));
      store.set('footer', 'F2');
      assert.deepEqual(component.toJSON(), getTree('H2', 'B', 'F2'));
      store.set('body', 'B2');
      assert.deepEqual(component.toJSON(), getTree('H2', 'B2', 'F2'));
   });
});

