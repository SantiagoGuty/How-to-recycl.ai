// src/theme/theme.ts

// ─── FULL TONAL SCALES ───────────────────────────────────────────────────────

const lavender = {
  50:  '#D9DAF2',  // ★ ORIGINAL → colors.lavender
  100: '#AEB0E4',  // → colors.lavenderLight
  200: '#8387D5',  // → colors.lavenderMid
  300: '#5960C2',  // → colors.lavenderDark
  400: '#373E98',  // → colors.lavenderDeeper
  500: '#1E225A',  // → colors.lavenderDeepest
  600: '#0B002D',  // → colors.lavenderAbyss
};

const green = {
  50:  '#D3FBD1',  // → colors.primaryLightest
  100: '#75ED6F',  // → colors.primaryLight
  200: '#5EC159',  // → colors.primaryMid
  300: '#489744',  // ★ ORIGINAL → colors.primary
  400: '#336F30',  // → colors.primaryDark
  500: '#204A1E',  // → colors.primaryDarker
  600: '#0E270C',  // → colors.primaryDeepest
};

const navyBlack = {
  50:  '#DFDFEE',  // → colors.bgGhost
  100: '#B5B8D9',  // → colors.bgSubtle
  200: '#8C8EC4',  // → colors.bgSoft
  300: '#6568AD',  // → colors.bgMid
  400: '#424587',  // → colors.bgLight
  500: '#252852',  // → colors.bgLighter
  600: '#0A0B1F',  // ★ ORIGINAL → colors.background
};

const indigoDark = {
  50:  '#F0F0F9',  // → colors.surfaceGhost
  100: '#CDCEEC',  // → colors.surfaceSubtle
  200: '#A3A4DC',  // → colors.surfaceSoft
  300: '#797CCB',  // → colors.surfaceMid
  400: '#515595',  // → colors.surfaceLight
  500: '#323582',  // → colors.surfaceLighter
  600: '#181A48',  // ★ ORIGINAL → colors.surface
};

// ─── SEMANTIC TOKENS ─────────────────────────────────────────────────────────

export const colors = {
  // ★ The 4 original anchor colors
  primary:    green[300],       // #489744
  lavender:   lavender[50],     // #D9DAF2
  background: navyBlack[600],   // #0A0B1F
  surface:    indigoDark[600],  // #181A48

  // Green scale
  primaryLightest: green[50],   // #D3FBD1
  primaryLight:    green[100],  // #75ED6F
  primaryMid:      green[200],  // #5EC159
  primaryDark:     green[400],  // #336F30
  primaryDarker:   green[500],  // #204A1E
  primaryDeepest:  green[600],  // #0E270C

  // Lavender scale
  lavenderLight:   lavender[100],  // #AEB0E4
  lavenderMid:     lavender[200],  // #8387D5
  lavenderDark:    lavender[300],  // #5960C2
  lavenderDeeper:  lavender[400],  // #373E98
  lavenderDeepest: lavender[500],  // #1E225A
  lavenderAbyss:   lavender[600],  // #0B002D

  // Navy / background scale
  bgLighter: navyBlack[500],  // #252852
  bgLight:   navyBlack[400],  // #424587
  bgMid:     navyBlack[300],  // #6568AD
  bgSoft:    navyBlack[200],  // #8C8EC4
  bgSubtle:  navyBlack[100],  // #B5B8D9
  bgGhost:   navyBlack[50],   // #DFDFEE

  // Indigo / surface scale
  surfaceLighter: indigoDark[500],  // #323582
  surfaceLight:   indigoDark[400],  // #515595
  surfaceMid:     indigoDark[300],  // #797CCB
  surfaceSoft:    indigoDark[200],  // #A3A4DC
  surfaceSubtle:  indigoDark[100],  // #CDCEEC
  surfaceGhost:   indigoDark[50],   // #F0F0F9

  // Semantic
  success: green[300],   // #489744
  warning: '#FFA726',
  error:   '#EF5350',

  // Text
  textPrimary:   lavender[50],   // #D9DAF2 — on dark backgrounds
  textSecondary: lavender[200],  // #8387D5
  textMuted:     lavender[400],  // #373E98
  textOnGreen:   '#FFFFFF',
  textOnLight:   navyBlack[600], // #0A0B1F

  // UI
  border:  indigoDark[400],           // #515595
  overlay: 'rgba(10,11,31,0.75)',
};

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────

export const fontSizes = {
  xs: 11, sm: 13, md: 15, lg: 18, xl: 22, xxl: 28, display: 36,
};

// ─── SPACING ─────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

// ─── RADII ───────────────────────────────────────────────────────────────────

export const radii = {
  sm: 6, md: 12, lg: 20, full: 9999,
};

// ─── SHADOWS ─────────────────────────────────────────────────────────────────

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
};

const theme = { colors, fontSizes, spacing, radii, shadows };
export default theme;