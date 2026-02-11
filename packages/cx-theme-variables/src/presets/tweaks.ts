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

export const roundingVeryLarge: Partial<ThemeVariables> = {
   borderRadius: "12px",
};

// Density tweaks
export const densityMinimal: Partial<ThemeVariables> = {
   baseFontSize: "12px",
   inputWidth: "150px",
   inputLineHeight: "16px",
   inputPaddingX: "3px",
   inputPaddingY: "3px",
   inputTagSpacing: "1px",
   buttonLineHeight: "16px",
   buttonPaddingX: "8px",
   buttonPaddingY: "3px",
   checkboxSize: "14px",
   iconSize: "14px",
   dropdownPadding: "2px",
   dropdownArrowSize: "4px",
   dropdownArrowOffset: "16px",
   sliderAxisSize: "4px",
   sliderHandleSize: "12px",
   progressBarHeight: "10px",
   scrollbarWidth: "thin",
};

export const densityCondensed: Partial<ThemeVariables> = {
   baseFontSize: "13px",
   inputWidth: "160px",
   inputLineHeight: "18px",
   inputPaddingX: "4px",
   inputPaddingY: "4px",
   inputTagSpacing: "2px",
   buttonLineHeight: "18px",
   buttonPaddingX: "12px",
   buttonPaddingY: "4px",
   checkboxSize: "14px",
   iconSize: "14px",
   dropdownPadding: "3px",
   dropdownArrowSize: "5px",
   dropdownArrowOffset: "18px",
   sliderAxisSize: "5px",
   sliderHandleSize: "14px",
   progressBarHeight: "12px",
   scrollbarWidth: "thin",
};

export const densityCompact: Partial<ThemeVariables> = {
   baseFontSize: "14px",
   inputWidth: "180px",
   inputLineHeight: "20px",
   inputPaddingX: "5px",
   inputPaddingY: "5px",
   inputTagSpacing: "3px",
   buttonLineHeight: "20px",
   buttonPaddingX: "14px",
   buttonPaddingY: "5px",
   checkboxSize: "16px",
   iconSize: "16px",
   dropdownPadding: "4px",
   dropdownArrowSize: "5px",
   dropdownArrowOffset: "20px",
   sliderAxisSize: "6px",
   sliderHandleSize: "16px",
   progressBarHeight: "14px",
};

export const densityNormal: Partial<ThemeVariables> = {
   baseFontSize: "14px",
   inputWidth: "200px",
   inputLineHeight: "22px",
   inputPaddingX: "6px",
   inputPaddingY: "6px",
   inputTagSpacing: "3px",
   buttonLineHeight: "22px",
   buttonPaddingX: "16px",
   buttonPaddingY: "6px",
   checkboxSize: "16px",
   iconSize: "16px",
   dropdownPadding: "6px",
   dropdownArrowSize: "6px",
   dropdownArrowOffset: "26px",
   sliderAxisSize: "6px",
   sliderHandleSize: "18px",
   progressBarHeight: "16px",
};

export const densityComfortable: Partial<ThemeVariables> = {
   baseFontSize: "15px",
   inputWidth: "220px",
   inputLineHeight: "24px",
   inputPaddingX: "6px",
   inputPaddingY: "6px",
   inputTagSpacing: "4px",
   buttonLineHeight: "24px",
   buttonPaddingX: "18px",
   buttonPaddingY: "6px",
   checkboxSize: "17px",
   iconSize: "17px",
   dropdownPadding: "7px",
   dropdownArrowSize: "7px",
   dropdownArrowOffset: "28px",
   sliderAxisSize: "7px",
   sliderHandleSize: "20px",
   progressBarHeight: "18px",
};

export const densitySpacious: Partial<ThemeVariables> = {
   baseFontSize: "16px",
   inputWidth: "240px",
   inputLineHeight: "24px",
   inputPaddingX: "7px",
   inputPaddingY: "7px",
   inputTagSpacing: "4px",
   buttonLineHeight: "24px",
   buttonPaddingX: "20px",
   buttonPaddingY: "7px",
   checkboxSize: "18px",
   iconSize: "18px",
   dropdownPadding: "8px",
   dropdownArrowSize: "7px",
   dropdownArrowOffset: "30px",
   sliderAxisSize: "8px",
   sliderHandleSize: "22px",
   progressBarHeight: "20px",
};

// Grouped exports for easier discovery
export const roundingTweaks = {
   none: roundingNone,
   small: roundingSmall,
   medium: roundingMedium,
   large: roundingLarge,
   veryLarge: roundingVeryLarge,
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
