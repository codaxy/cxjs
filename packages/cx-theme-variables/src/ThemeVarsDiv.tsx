/** @jsxImportSource react */
import {
  Prop,
  StyledContainer,
  StyledContainerConfig,
} from "cx/ui";
import { ThemeVariables, themeVariablesToStyle } from "./ThemeVariables";

const resetStyle = {
  backgroundColor: "var(--cx-theme-background-color)",
  color: "var(--cx-theme-text-color)",
  fontFamily: "var(--cx-theme-font-family)",
  fontWeight: "var(--cx-theme-font-weight)",
  fontSize: "var(--cx-theme-base-font-size)",
};

export interface ThemeVarsDivConfig extends StyledContainerConfig {
  /** Theme variables to apply (partial - only overrides the specified variables) */
  theme?: Prop<Partial<ThemeVariables>>;

  /** Apply reset styles (background, color, font) to the div */
  applyReset?: boolean;

  /** CSS selector (e.g. ".my-theme") to use class-based scoping instead of inline styles.
   * When provided, the class is applied to the div and a data-theme-container-class attribute
   * is set so portaled overlays can inherit the scoped theme. A separate ThemeVarsRoot with
   * the same cssSelector must define the actual CSS variables. */
  cssSelector?: string;
}

/**
 * Renders a <div> with CSS variables applied via inline style.
 * Use this for scoped theme overrides within a region.
 */
export class ThemeVarsDiv extends StyledContainer {
  declare theme: Partial<ThemeVariables>;
  declare applyReset: boolean;
  declare cssSelector: string;

  constructor(config: ThemeVarsDivConfig) {
    super(config);
  }

  declareData(...args: any[]): void {
    super.declareData(...args, {
      theme: { structured: true },
    });
  }

  render(context: any, instance: any, key: string) {
    const { data } = instance;
    const { theme } = data;
    const themeStyle = themeVariablesToStyle(theme);

    let themeCssClass = this.cssSelector?.startsWith(".") ? this.cssSelector.substring(1) : this.cssSelector;

    return (
      <div
        key={key}
        className={this.CSS.expand(data.classNames, themeCssClass)}
        style={{
          ...themeStyle,
          ...(this.applyReset ? resetStyle : null),
          ...data.style,
        }}
        data-theme-container-class={themeCssClass}
      >
        {this.renderChildren(context, instance)}
      </div>
    );
  }
}
