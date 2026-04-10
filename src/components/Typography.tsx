// src/components/Typography.tsx
// Usage: <Typography variant="h1" color="textPrimary">Hello</Typography>

import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { textStyles } from '../theme/typography';
import { colors } from '../theme/theme';

type Variant = keyof typeof textStyles;
type ColorToken = keyof typeof colors;

interface Props {
  variant?: Variant;          // which preset to use — defaults to 'body'
  color?: ColorToken;         // any color token from theme.colors
  style?: TextStyle;          // override/extend styles inline
  children: React.ReactNode;
}

export default function Typography({
  variant = 'body',
  color = 'textPrimary',
  style,
  children,
}: Props) {
  return (
    <Text style={[styles[variant], { color: colors[color] }, style]}>
      {children}
    </Text>
  );
}

// Build StyleSheet from textStyles presets
const styles = StyleSheet.create(
  Object.fromEntries(
    Object.entries(textStyles).map(([key, value]) => [key, value])
  ) as Record<Variant, TextStyle>
);