// src/theme/typography.ts
// Defines font family names and text style presets.
// Import this into components via the Typography component or directly.

// ─── FONT FAMILY NAMES ───────────────────────────────────────────────────────
// These strings must exactly match the keys used in useFonts() in App.tsx

export const fonts = {
  body:          'MirandaSans-Regular',   // all regular text
  bodyMedium:    'MirandaSans-Medium',    // slightly emphasized body
  bodyBold:      'MirandaSans-Bold',      // bold body text

  titleUI:       'GoogleSansFlex-Regular', // screen titles, section headers
  titleUIBold:   'GoogleSansFlex-Bold',    // bold UI titles

  brand:         'PlayfairDisplay-Regular', // "Recycl.ai" only
  brandBold:     'PlayfairDisplay-Bold',    // "Recycl.ai" bold variant
};

// ─── TEXT STYLE PRESETS ──────────────────────────────────────────────────────
// Ready-to-use style objects. Spread into StyleSheet or inline styles.
// Sizes come from theme.fontSizes — kept in sync manually.

export const textStyles = {

  // The app brand name — Recycl.ai only
  brand: {
    fontFamily: fonts.brand,
    fontSize: 36,        // theme.fontSizes.display
    letterSpacing: 1.5,
  },

  // Screen-level headings (Home title, Scanner title, etc.)
  h1: {
    fontFamily: fonts.titleUIBold,
    fontSize: 28,        // theme.fontSizes.xxl
    letterSpacing: 0.2,
  },

  // Section headings within a screen
  h2: {
    fontFamily: fonts.titleUI,
    fontSize: 22,        // theme.fontSizes.xl
    letterSpacing: 0.1,
  },

  // Card titles, list item headers
  h3: {
    fontFamily: fonts.titleUIBold,
    fontSize: 18,        // theme.fontSizes.lg
  },

  // Default body text — paragraphs, descriptions
  body: {
    fontFamily: fonts.body,
    fontSize: 15,        // theme.fontSizes.md
    lineHeight: 22,
  },

  // Slightly emphasized body — subtitles, secondary info
  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
  },

  // Small labels, tags, captions
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,        // theme.fontSizes.sm
    lineHeight: 18,
  },

  // Tiny metadata, timestamps
  micro: {
    fontFamily: fonts.body,
    fontSize: 11,        // theme.fontSizes.xs
    lineHeight: 16,
  },

  // Button labels
  button: {
    fontFamily: fonts.titleUIBold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
};