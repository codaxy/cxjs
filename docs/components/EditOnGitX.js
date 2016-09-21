import {Widget, VDOM} from 'cx/ui/Widget';

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

      return <div className="cxb-editongitx">
          <a key={key} href={`https://github.com/codaxy/cx/edit/master/docs/content/${url}.js`}>Edit</a>
      </div>
   }
}
