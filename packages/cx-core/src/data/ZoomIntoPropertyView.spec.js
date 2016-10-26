import assert from 'assert';

import {Binding} from './Binding';
import {Store} from './Store';
import {ZoomIntoPropertyView} from './ZoomIntoPropertyView';

describe('ZoomIntoPropertyView', () => {

   const getZoom = () => {
      let store = new Store({
         data: {
            a: 3,
            item: {
               firstName: 'Jack'
            }
         }
      });

      return new ZoomIntoPropertyView({
         store: store,
         binding: Binding.get('item')
      });
   };

   it('allows direct access to properties of zoomed object', ()=> {
      let zoom = getZoom();
      assert.equal(zoom.get('firstName'), 'Jack');
   });

   it('allows access to outside data through $root', ()=> {
      let zoom = getZoom();
      assert.equal(zoom.get('$root.a'), 3);
   });

   it('correctly sets zoomed object', ()=> {
      let zoom = getZoom();
      zoom.set('firstName', 'Joe');
      assert.equal(zoom.get('firstName'), 'Joe');
   });

   it('correctly sets zoomed values', ()=> {
      let zoom = getZoom();
      zoom.set('firstName', 'Joe');
      assert.equal(zoom.get('firstName'), 'Joe');
      assert.equal(zoom.get('$root.item.firstName'), 'Joe');
   });

   it('correctly sets outside values', ()=> {
      let zoom = getZoom();
      zoom.set('$root.a', 6);
      assert.equal(zoom.get('$root.a'), 6);
   });

   it('correctly deletes zoomed values', ()=> {
      let zoom = getZoom();
      zoom.delete('firstName');
      assert.equal(zoom.get('firstName'), undefined);
   });

   it('correctly deletes outside values', ()=> {
      let zoom = getZoom();
      zoom.delete('$root.a');
      assert.equal(zoom.get('$root.a'), undefined);
   });
});
