import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Types';
import { colors, spacing, radii, shadows, fontSizes } from '../theme/theme';
import { textStyles, fonts } from '../theme/typography';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

function LeafIcon({ size = 64 }: { size?: number }) {
  return (
    <View style={[leafStyles.container, { width: size, height: size }]}>
      <View style={[leafStyles.leaf, { width: size * 0.7, height: size * 0.7 }]} />
      <View style={[leafStyles.stem, { height: size * 0.35, bottom: size * 0.02 }]} />
    </View>
  );
}

const leafStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaf: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: radii.full,
    borderTopRightRadius: radii.full,
    borderBottomLeftRadius: radii.full,
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    top: 0,
  },
  stem: {
    width: 3,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.sm,
    position: 'absolute',
  },
});

export default function HomeScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleCamera = useRef(new Animated.Value(0.8)).current;
  const scaleChat = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scaleCamera, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleChat, {
          toValue: 1,
          tension: 60,
          friction: 8,
          delay: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.93,
      useNativeDriver: true,
      tension: 120,
      friction: 5,
    }).start();
  };

  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 5,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Profile button — top right */}
      <TouchableOpacity
        style={styles.profileBtn}
        onPress={() => navigation.navigate('Profile')}
        activeOpacity={0.7}
      >
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>SG</Text>
        </View>
      </TouchableOpacity>

      {/* Center content */}
      <Animated.View
        style={[
          styles.center,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <LeafIcon size={72} />

        <Text style={styles.title}>Recycl.ai</Text>
        <Text style={styles.tagline}>
          Changing the world{'\n'}one can at a time
        </Text>

        {/* Stats strip */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Scanned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Recycled</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
      </Animated.View>

      {/* Chat FAB — bottom left */}
      <Animated.View style={[styles.fabLeft, { transform: [{ scale: scaleChat }] }]}>
        <TouchableOpacity
          style={[styles.fab, styles.fabSecondary]}
          onPress={() => navigation.navigate('Chat')}
          onPressIn={() => handlePressIn(scaleChat)}
          onPressOut={() => handlePressOut(scaleChat)}
          activeOpacity={1}
        >
          <Text style={styles.fabIcon}>💬</Text>
          <Text style={styles.fabLabelSecondary}>Ask AI</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Camera FAB — bottom right */}
      <Animated.View style={[styles.fabRight, { transform: [{ scale: scaleCamera }] }]}>
        <TouchableOpacity
          style={[styles.fab, styles.fabPrimary]}
          onPress={() => navigation.navigate('Scanner')}
          onPressIn={() => handlePressIn(scaleCamera)}
          onPressOut={() => handlePressOut(scaleCamera)}
          activeOpacity={1}
        >
          <Text style={styles.fabIcon}>📷</Text>
          <Text style={styles.fabLabelPrimary}>Scan</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glowTop: {
    position: 'absolute',
    top: -(height * 0.1),
    left: width * 0.1,
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    opacity: 0.06,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -(height * 0.05),
    right: -(width * 0.2),
    width: width * 0.8,
    height: height * 0.3,
    borderRadius: radii.full,
    backgroundColor: colors.primaryLight,
    opacity: 0.07,
  },
  profileBtn: {
    position: 'absolute',
    top: spacing.xxl + spacing.md,
    right: spacing.lg,
    zIndex: 10,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    ...textStyles.micro,
    fontFamily: fonts.titleUIBold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },
  title: {
    ...textStyles.brand,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  tagline: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  statNumber: {
    ...textStyles.h2,
    color: colors.primary,
  },
  statLabel: {
    ...textStyles.micro,
    fontFamily: fonts.titleUIBold,
    color: colors.textMuted,
    marginTop: spacing.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  fabLeft: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.lg,
  },
  fabRight: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: spacing.lg,
  },
  fab: {
    width: 80,
    height: 80,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPrimary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  fabSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.card,
  },
  fabIcon: {
    fontSize: 26,
    marginBottom: spacing.xs,
  },
  fabLabelPrimary: {
    ...textStyles.button,
    color: colors.textOnGreen,
    fontSize: fontSizes.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  fabLabelSecondary: {
    ...textStyles.button,
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});