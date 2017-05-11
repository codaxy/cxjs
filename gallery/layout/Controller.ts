import {Controller, Url, History} from 'cx/ui';
import Route from 'route-parser';

export default class extends Controller {
   onInit() {
      this.store.init("layout.aside.open", window.innerWidth >= 800);

      this.addTrigger('navigation', ['url'], () => {
         if (window.innerWidth < 800)
            this.store.set('layout.aside.open', false);
      });

      this.addComputable('themeName', ['$route.theme'], theme => {
         switch (theme) {
            case "core": return "Core";
            case "material": return "Material";
            case "frost": return "Frost";
            case "dark": return "Dark";
            default: return "New theme?";
         }
      });

      // this.addTrigger('theme-change', ['theme'], (theme) => {
      //    let url = Url.unresolve(document.location.toString());
      //    let route = new Route("~/:theme/(*remainder)");
      //    let result = route.match(url);
      //    let redirect = route.reverse({
      //       ...result,
      //       theme
      //    });
      //    History.pushState({}, null, redirect);
      // });
   }

   onMainClick(e, {store}) {
      if (window.innerWidth < 800)
         store.set('layout.aside.open', false);
   }
}
