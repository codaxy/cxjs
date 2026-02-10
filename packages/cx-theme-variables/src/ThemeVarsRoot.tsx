/** @jsxImportSource react */
import { Prop, Widget, WidgetConfig } from "cx/ui";
import { ThemeVariables, themeVariablesToCSS } from "./ThemeVariables";

export interface ThemeVarsRootConfig extends WidgetConfig {
  /** Theme variables to apply */
  theme?: Prop<ThemeVariables>;

  /** CSS selector (default: ":root") */
  cssSelector?: string;

  /** Optional CSS wrapper, e.g. "@media (prefers-color-scheme: dark)" */
  cssWrapper?: string;
}

/**
 * Renders a <style> element with CSS variables.
 * Use multiple instances with different cssSelector/cssWrapper for light and dark themes.
 */
export class ThemeVarsRoot extends Widget<ThemeVarsRootConfig> {
  declare theme: ThemeVariables;
  declare cssSelector: string;
  declare cssWrapper: string;

  declareData(...args: any[]): void {
    super.declareData(...args, {
      theme: { structured: true },
    });
  }

  render(context: any, instance: any, key: string) {
    const { data } = instance;
    const css = themeVariablesToCSS(
      data.theme,
      this.cssSelector,
      this.cssWrapper,
    );
    return <style key={key} dangerouslySetInnerHTML={{ __html: css }} />;
  }
}
