import {Controller, Url, History} from 'cx/ui';

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
            case "material-dark": return "Material Dark"
            case "frost": return "Frost";
            case "dark": return "Dark";
            case "aquamarine": return "Aquamarine (beta)";
            default: return "New theme?";
         }
      });
   }

   onMainClick(e, {store}) {
      if (window.innerWidth < 800)
         store.set('layout.aside.open', false);
   }
}
