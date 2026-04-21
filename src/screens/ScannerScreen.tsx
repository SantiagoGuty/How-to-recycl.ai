import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Types';
import { colors, spacing, radii, fontSizes } from '../theme/theme';
import { textStyles } from '../theme/typography';
import { useMediaPermissions } from '../hooks/useMediaPermissions';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Scanner'>;
};

export default function ScannerScreen({ navigation: _navigation }: Props) {
  const {
    cameraStatus,
    libraryStatus,
    requestCameraPermission,
    requestLibraryPermission,
    openSettings,
  } = useMediaPermissions();

  const allGranted = cameraStatus === 'granted' && libraryStatus === 'granted';
  const anyDenied  = cameraStatus === 'denied'  || libraryStatus === 'denied';

  if (allGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.icon}>📷</Text>
        <Text style={[textStyles.h2, styles.title]}>Ready to scan mr tuna</Text>
        <Text style={[textStyles.body, styles.subtitle]}>
          Camera flow coming in S2-2
        </Text>
      </SafeAreaView>
    );
  }

  if (anyDenied) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={[textStyles.h2, styles.title]}>Permissions required</Text>
        <Text style={[textStyles.body, styles.subtitle]}>
          recycl.ai needs camera and photo access to identify materials.
          Please enable them in Settings.
        </Text>
        <TouchableOpacity style={styles.button} onPress={openSettings}>
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.icon}>📷</Text>
      <Text style={[textStyles.h2, styles.title]}>Let's get started</Text>
      <Text style={[textStyles.body, styles.subtitle]}>
        recycl.ai needs access to your camera and photo library to help
        you recycle smarter.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await requestCameraPermission();
          await requestLibraryPermission();
        }}
      >
        <Text style={styles.buttonText}>Allow Access</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    color: colors.textPrimary,     // #D9DAF2 — readable on dark bg
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,   // #8387D5 — was textMuted (#373E98), too dark
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,   // #489744
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  buttonText: {
    color: colors.textOnGreen,     // #FFFFFF
    fontWeight: '600',
    fontSize: fontSizes.md,        // 15
  },
});