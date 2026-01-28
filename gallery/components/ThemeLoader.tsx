import { createFunctionalComponent } from "cx/ui";
import { ContentResolver } from "cx/widgets";
import { loadTheme } from "../themes";

function importTheme(theme) {
   switch (theme) {
      case "material":
         return import(/* webpackChunkName: 'material' */ "../themes/material");

      case "frost":
         return import(/* webpackChunkName: 'frost' */ "../themes/frost");

      case "dark":
         return import(/* webpackChunkName: 'dark' */ "../themes/dark");

      case "core":
         return import(/* webpackChunkName: 'core' */ "../themes/core");

      case "aquamarine":
         return import(/* webpackChunkName: 'aquamarine' */ "../themes/aquamarine");

      case "material-dark":
         return import(/* webpackChunkName: 'material-dark' */ "../themes/material-dark");

      case "space-blue":
         return import(/* webpackChunkName: 'space-blue' */ "../themes/space-blue");

      case "packed-dark":
         return import(/* webpackChunkName: 'packed-dark' */ "../themes/packed-dark");
   }
}

export const ThemeLoader = createFunctionalComponent(({ theme, children }: any) => (
   <cx>
      <ContentResolver
         params={theme}
         onResolve={(theme) => {
            return importTheme(theme).then(() => {
               loadTheme(theme);
               return children;
            });
         }}
      />
   </cx>
));
