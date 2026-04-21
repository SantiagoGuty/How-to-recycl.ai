import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Types';
import { colors, spacing } from '../theme/theme';
import { textStyles } from '../theme/typography';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

export default function ResultScreen({ route }: Props) {
  const { itemName } = route.params ?? {};

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>♻️</Text>
      <Text style={styles.title}>
        {itemName ? `Result: ${itemName}` : 'Result'}
      </Text>
      <Text style={styles.subtitle}>
        ML classification + recycling guidance{'\n'}coming in Sprint 3 & 4
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  title: {
    ...textStyles.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});