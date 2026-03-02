export const typography = {
  // Font Families
  fontFamily: {
    alexandria: "Alexandria",
    dancingScript: "Dancing Script",
    merriweather: "Merriweather",
  },

  // Font Sizes
  fontSize: {
    heading1: 32,
    heading2: 28,
    heading3: 24,
    cta: 18,
    body1Bold: 16,
    body1Regular: 16,
    body2Bold: 14,
    body2Regular: 14,
  },

  // Font Weights
  fontWeight: {
    regular: "400" as const,
    bold: "700" as const,
  },

  // Text Styles
  styles: {
    heading1: {
      fontFamily: "Alexandria",
      fontSize: 32,
      fontWeight: "700" as const,
    },
    heading2: {
      fontFamily: "Dancing Script",
      fontSize: 28,
      fontWeight: "400" as const,
    },
    heading3: {
      fontFamily: "Dancing Script",
      fontSize: 24,
      fontWeight: "400" as const,
    },
    cta: {
      fontFamily: "Merriweather",
      fontSize: 18,
      fontWeight: "400" as const,
    },
    body1Bold: {
      fontFamily: "Merriweather",
      fontSize: 16,
      fontWeight: "700" as const,
    },
    body1Regular: {
      fontFamily: "Merriweather",
      fontSize: 16,
      fontWeight: "400" as const,
    },
    body2Bold: {
      fontFamily: "Merriweather",
      fontSize: 14,
      fontWeight: "700" as const,
    },
    body2Regular: {
      fontFamily: "Merriweather",
      fontSize: 14,
      fontWeight: "400" as const,
    },
  },
} as const;
