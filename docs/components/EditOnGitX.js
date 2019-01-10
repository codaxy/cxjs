import { Widget, VDOM } from 'cx/ui';

export class EditOnGitX extends Widget {

   declareData() {
      super.declareData({
         url: undefined
      }, ...arguments)
   }

   render(context, instance, key) {

      var {data} = instance;

      var url = data.url || '';
      url = url.replace('~/', '');
      url = url.replace(/Page$/, '');

      return <a
          key={key}
          href={`https://github.com/codaxy/cxjs/edit/master/docs/content/${url}.js`}
      >
          Edit
      </a>;
   }
}
