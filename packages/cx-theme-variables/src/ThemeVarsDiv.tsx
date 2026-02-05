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
  /** Theme variables to apply */
  theme?: Prop<ThemeVariables>;

  /** Apply reset styles (background, color, font) to the div */
  applyReset?: boolean;
}

/**
 * Renders a <div> with CSS variables applied via inline style.
 * Use this for scoped theme overrides within a region.
 */
export class ThemeVarsDiv extends StyledContainer {
  declare theme: Partial<ThemeVariables>;
  declare applyReset: boolean;

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

    return (
      <div
        key={key}
        className={data.classNames}
        style={{
          ...themeStyle,
          ...(this.applyReset ? resetStyle : null),
          ...data.style,
        }}
      >
        {this.renderChildren(context, instance)}
      </div>
    );
  }
}
