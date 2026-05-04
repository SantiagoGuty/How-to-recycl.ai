import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Types';
import { colors, spacing, radii, fontSizes, shadows } from '../theme/theme';
import { textStyles, fonts } from '../theme/typography';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// S2-6: hardcoded mock to validate layout. Replaced in S3 with ML output.

const MOCK_RESULT = {
  name: 'Plastic Bottle',
  material: 'PET #1',
  recyclable: true,
  confidence: 94,
  instructions:
    'Empty and rinse the bottle completely. Remove the cap — caps are often a different plastic type and may need to go in a separate bin or be checked with your local facility. Place the bottle in your blue recycling bin. Do not crush — some sorting facilities require bottles to be intact for optical identification.',
  craftIdeas: [
    {
      title: 'Bird feeder',
      description: 'Cut two holes, thread a wooden dowel through as a perch, hang with twine.',
    },
    {
      title: 'Mini planter',
      description: 'Cut in half horizontally, poke drainage holes in the bottom, fill with soil.',
    },
    {
      title: 'Terrarium',
      description: 'Remove cap, cut top third off, layer pebbles + soil + small plants inside.',
    },
  ],
};

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────

function MaterialBadge({ material, recyclable }: { material: string; recyclable: boolean }) {
  return (
    <View style={[badgeStyles.pill, recyclable ? badgeStyles.green : badgeStyles.red]}>
      <View style={[badgeStyles.dot, recyclable ? badgeStyles.dotGreen : badgeStyles.dotRed]} />
      <Text style={[badgeStyles.text, recyclable ? badgeStyles.textGreen : badgeStyles.textRed]}>
        {material}
      </Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: radii.full,
    gap: 6,
    marginTop: spacing.sm,
  },
  green: {
    backgroundColor: colors.primaryDeepest,
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  red: {
    backgroundColor: '#3B1010',
    borderWidth: 1,
    borderColor: colors.error,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotGreen: { backgroundColor: colors.primaryLight },
  dotRed:   { backgroundColor: colors.error },
  text: {
    ...textStyles.caption,
    fontFamily: fonts.titleUIBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textGreen: { color: colors.primaryLight },
  textRed:   { color: colors.error },
});

function ConfidencePill({ value }: { value: number }) {
  return (
    <View style={confStyles.pill}>
      <Text style={confStyles.text}>{value}% match</Text>
    </View>
  );
}

const confStyles = StyleSheet.create({
  pill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  text: {
    ...textStyles.micro,
    color: colors.textSecondary,
    fontFamily: fonts.titleUI,
  },
});

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={sectionStyles.row}>
      <View style={sectionStyles.accent} />
      <Text style={sectionStyles.label}>{label}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  accent: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  label: {
    ...textStyles.caption,
    fontFamily: fonts.titleUIBold,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

function CraftCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  const icons = ['🐦', '🌱', '🌿'];
  return (
    <View style={craftStyles.card}>
      <Text style={craftStyles.icon}>{icons[index] ?? '♻️'}</Text>
      <View style={craftStyles.textBlock}>
        <Text style={craftStyles.title}>{title}</Text>
        <Text style={craftStyles.desc}>{description}</Text>
      </View>
    </View>
  );
}

const craftStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 20,
    marginTop: 1,
  },
  textBlock: { flex: 1 },
  title: {
    ...textStyles.caption,
    fontFamily: fonts.titleUIBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  desc: {
    ...textStyles.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function ResultScreen({ navigation, route }: Props) {
  const { imageUri, upc, coords } = route.params;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const result = MOCK_RESULT;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Scrollable body */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Thumbnail + identity block ── */}
          <View style={styles.identityRow}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.thumbnail} resizeMode="cover" />
            ) : (
              <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                <Text style={styles.thumbnailPlaceholderText}>📦</Text>
              </View>
            )}


            <View style={styles.identityText}>
              <Text style={styles.objectName}>{result.name}</Text>
              {upc && (
                <Text style={styles.debugUpc}>UPC: {upc}</Text>
              )}
              {coords && (
                <Text style={styles.debugUpc}>
                  📍 {coords.latitude}, {coords.longitude}
                </Text>    
              )}
              <MaterialBadge material={result.material} recyclable={result.recyclable} />
              <ConfidencePill value={result.confidence} />
            </View>
          </View>

          {/* ── How to recycle ── */}
          <SectionHeader label="How to recycle" />
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsText}>{result.instructions}</Text>
          </View>

          {/* ── Craft ideas ── */}
          <SectionHeader label="Give it a second life" />
          {result.craftIdeas.map((idea, i) => (
            <CraftCard key={idea.title} title={idea.title} description={idea.description} index={i} />
          ))}

          {/* Bottom padding so last card clears the action bar */}
          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      {/* ── Fixed action bar ── */}
      <SafeAreaView edges={['bottom']} style={styles.actionBar}>
        <View style={styles.actionRow}>

          {/* Confirm */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionConfirm]}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>✓</Text>
            <Text style={[styles.actionLabel, styles.actionLabelConfirm]}>Correct</Text>
          </TouchableOpacity>

          {/* That's not right */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionWrong]}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>✕</Text>
            <Text style={[styles.actionLabel, styles.actionLabelWrong]}>Not right</Text>
          </TouchableOpacity>

          {/* Flag */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionFlag]}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>⚑</Text>
            <Text style={[styles.actionLabel, styles.actionLabelFlag]}>Flag</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Scroll ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  // ── Identity row ──
  identityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.card,
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: radii.md,
  },
  thumbnailPlaceholder: {
    backgroundColor: colors.bgLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailPlaceholderText: {
    fontSize: 32,
  },
  identityText: {
    flex: 1,
    paddingTop: 2,
  },
  objectName: {
    ...textStyles.h2,
    color: colors.textPrimary,
    lineHeight: 26,
  },

  // ── Instructions ──
  instructionsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  instructionsText: {
    ...textStyles.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // ── Action bar ──
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 3,
  },
  actionIcon: {
    fontSize: fontSizes.md,
    color: colors.lavender,
  },
  actionLabel: {
    ...textStyles.micro,
    fontFamily: fonts.titleUIBold,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  // Confirm — green tinted
  actionConfirm: {
    backgroundColor: colors.primaryDeepest,
    borderColor: colors.primaryDark,
  },
  actionLabelConfirm: {
    color: colors.primaryLight,
  },

  // Not right — neutral surface
  actionWrong: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  actionLabelWrong: {
    color: colors.textSecondary,
  },

  // Flag — warning tinted
  actionFlag: {
    backgroundColor: '#2A1F0A',
    borderColor: '#6B4A10',
  },
  actionLabelFlag: {
    color: '#FFA726',
  },

  debugUpc: {
  fontFamily: fonts.body,
  fontSize: fontSizes.sm,
  color: colors.textMuted,
  marginTop: spacing.xs,
  },
});