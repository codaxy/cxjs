import { Cx } from './Cx';
import { VDOM } from './Widget';
import { HtmlElement } from '../widgets/HtmlElement';
import { Store } from '../data/Store';
import { createFunctionalComponent } from './createFunctionalComponent';


import renderer from 'react-test-renderer';
import assert from 'assert';

describe('createFunctionalComponent', () => {

   it('allows spread', () => {
      const SuperText = createFunctionalComponent(({...props}) => {
      
         return (
            <cx>
               <PureContainer>
                  <TextField {...props} value-bind="value" placeholder="Default" label="Default" />
                  <br/>
                  {props.children}
               </PureContainer>
            </cx>
         )
      });
      
      let props = {
         label: "Spread",
         placeholder: "Spread"
      }
      
      export default (
         <cx>
            <SuperText 
               // label="Standard"
               // placeholder="Standard"
               // {...props} 
               help= "Standard help"
               //{...props}
            >
               <TextField {...props} value-bind="value" />
            </SuperText>
         </cx>
      );

      let store = new Store();

      const component = renderer.create(
         <Cx widget={widget} store={store} subscribe immediate />
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         props: {},
         children: [
            {
               type: 'div',
               props: {},
               children: ["A"]
            },
            {
               type: 'div',
               props: {},
               children: ["B"]
            },
            {
               type: 'div',
               props: {},
               children: ["C"]
            }
         ]
      })
   });
});