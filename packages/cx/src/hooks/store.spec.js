import {ref} from "./store";
import {createFunctionalComponent} from "../ui/createFunctionalComponent";
import {Store} from "../data/Store";
import renderer from "react-test-renderer";
import {HtmlElement} from "../widgets/HtmlElement";
import {VDOM} from "../ui/VDOM";
import {Cx} from "../ui/Cx";
import assert from 'assert';

describe('ref', () => {

   it('allows store references in functional components', () => {
      const FComp = createFunctionalComponent(({...props}) => {

         let testValue = ref({ bind: "x", defaultValue: 10 });

         return (
            <cx>
               <div text={testValue} />
            </cx>
         );
      });

      let store = new Store();

      const component = renderer.create(
         <Cx widget={FComp} store={store} subscribe immediate/>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: 'div',
         children: ["10"],
         props: {}
      })
   });
});