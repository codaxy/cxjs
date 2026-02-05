/** @jsxImportSource react */
import { Prop, Widget, WidgetConfig } from "cx/ui";
import {
   ThemeVariables,
   themeVariablesToCSS,
} from "./ThemeVariables";

export interface ThemeVarsRootConfig extends WidgetConfig {
   /** Theme variables to apply to :root */
   theme?: Prop<ThemeVariables>;
}

/**
 * Renders a <style> element with CSS variables applied to :root.
 * Use this for setting global theme defaults.
 */
export class ThemeVarsRoot extends Widget {
   declare theme: ThemeVariables;

   declareData(...args: any[]): void {
      super.declareData(...args, {
         theme: { structured: true },
      });
   }

   render(context: any, instance: any, key: string) {
      const { data } = instance;
      const css = themeVariablesToCSS(data.theme);
      return <style key={key} dangerouslySetInnerHTML={{ __html: css }} />;
   }
}
