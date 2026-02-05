import { ThemeVariables } from "../ThemeVariables";

/**
 * Tweak presets are partial theme configurations that can be
 * layered on top of base themes to adjust specific aspects.
 */

// Rounding tweaks
export const roundingNone: Partial<ThemeVariables> = {
   borderRadius: "0",
};

export const roundingSmall: Partial<ThemeVariables> = {
   borderRadius: "3px",
};

export const roundingMedium: Partial<ThemeVariables> = {
   borderRadius: "5px",
};

export const roundingLarge: Partial<ThemeVariables> = {
   borderRadius: "8px",
};


// Density tweaks
export const densityMinimal: Partial<ThemeVariables> = {
   baseFontSize: "12px",
   inputLineHeight: "16px",
   inputPaddingX: "3px",
   inputPaddingY: "3px",
   buttonLineHeight: "16px",
   buttonPaddingX: "8px",
   buttonPaddingY: "3px",
   checkboxSize: "14px",
   iconSize: "14px",
};

export const densityCondensed: Partial<ThemeVariables> = {
   baseFontSize: "13px",
   inputLineHeight: "18px",
   inputPaddingX: "4px",
   inputPaddingY: "4px",
   buttonLineHeight: "18px",
   buttonPaddingX: "12px",
   buttonPaddingY: "4px",
   checkboxSize: "14px",
   iconSize: "14px",
};

export const densityCompact: Partial<ThemeVariables> = {
   baseFontSize: "14px",
   inputLineHeight: "20px",
   inputPaddingX: "5px",
   inputPaddingY: "5px",
   buttonLineHeight: "20px",
   buttonPaddingX: "14px",
   buttonPaddingY: "5px",
   checkboxSize: "16px",
   iconSize: "16px",
};

export const densityNormal: Partial<ThemeVariables> = {
   baseFontSize: "14px",
   inputLineHeight: "22px",
   inputPaddingX: "6px",
   inputPaddingY: "6px",
   buttonLineHeight: "22px",
   buttonPaddingX: "16px",
   buttonPaddingY: "6px",
   checkboxSize: "16px",
   iconSize: "16px",
};

export const densityComfortable: Partial<ThemeVariables> = {
   baseFontSize: "14px",
   inputLineHeight: "23px",
   inputPaddingX: "6px",
   inputPaddingY: "6px",
   buttonLineHeight: "23px",
   buttonPaddingX: "18px",
   buttonPaddingY: "6px",
   checkboxSize: "17px",
   iconSize: "17px",
};

export const densitySpacious: Partial<ThemeVariables> = {
   baseFontSize: "14px",
   inputLineHeight: "24px",
   inputPaddingX: "7px",
   inputPaddingY: "7px",
   buttonLineHeight: "24px",
   buttonPaddingX: "20px",
   buttonPaddingY: "7px",
   checkboxSize: "18px",
   iconSize: "18px",
};

// Grouped exports for easier discovery
export const roundingTweaks = {
   none: roundingNone,
   small: roundingSmall,
   medium: roundingMedium,
   large: roundingLarge,
};

export const densityTweaks = {
   minimal: densityMinimal,
   condensed: densityCondensed,
   compact: densityCompact,
   normal: densityNormal,
   comfortable: densityComfortable,
   spacious: densitySpacious,
};

// Font tweaks
export const fontSystem: Partial<ThemeVariables> = {
   fontFamily: "system-ui, -apple-system, sans-serif",
};

export const fontInter: Partial<ThemeVariables> = {
   fontFamily: "'Inter', sans-serif",
};

export const fontRoboto: Partial<ThemeVariables> = {
   fontFamily: "'Roboto', sans-serif",
};

export const fontOpenSans: Partial<ThemeVariables> = {
   fontFamily: "'Open Sans', sans-serif",
};

export const fontPoppins: Partial<ThemeVariables> = {
   fontFamily: "'Poppins', sans-serif",
};

export const fontLato: Partial<ThemeVariables> = {
   fontFamily: "'Lato', sans-serif",
};

export const fontTweaks = {
   system: fontSystem,
   inter: fontInter,
   roboto: fontRoboto,
   openSans: fontOpenSans,
   poppins: fontPoppins,
   lato: fontLato,
};
