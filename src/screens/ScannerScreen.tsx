import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Types';
import { colors, spacing, radii, fontSizes } from '../theme/theme';
import { useMediaPermissions } from '../hooks/useMediaPermissions';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Scanner'>;
};

export default function ScannerScreen({ navigation }: Props) {
  const {
    cameraStatus,
    libraryStatus,
    requestCameraPermission,
    requestLibraryPermission,
    openSettings,
  } = useMediaPermissions();

  const cameraRef = useRef<CameraView>(null);
  const [facing] = useState<CameraType>('back');
  const [isBarcodeModeActive, setIsBarcodeModeActive] = useState(false);
  const scanned = useRef(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const allGranted = cameraStatus === 'granted' && libraryStatus === 'granted';
  const anyDenied  = cameraStatus === 'denied'  || libraryStatus === 'denied';

  // ── Android back button: close sheet first, then navigate back ─────
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (sheetOpen) {
        setSheetOpen(false);
        return true; // true = event consumed, don't propagate
      }
      return false; // false = let React Navigation handle it (go back)
    });
    return () => handler.remove();
  }, [sheetOpen]);

  // ── Permission gate ────────────────────────────────────────────────
  if (!allGranted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.icon}>{anyDenied ? '🔒' : '📷'}</Text>
        <Text style={styles.title}>
          {anyDenied ? 'Permissions required' : "Let's get started"}
        </Text>
        <Text style={styles.subtitle}>
          {anyDenied
            ? 'recycl.ai needs camera and photo access. Please enable them in Settings.'
            : 'recycl.ai needs access to your camera and photo library to help you recycle smarter.'}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={anyDenied
            ? openSettings
            : async () => {
                await requestCameraPermission();
                await requestLibraryPermission();
              }
          }
        >
          <Text style={styles.buttonText}>
            {anyDenied ? 'Open Settings' : 'Allow Access'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Handlers ───────────────────────────────────────────────────────
  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo?.uri) {
      navigation.navigate('Preview', { imageUri: photo.uri });
    }
  };

  const handleChooseFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      navigation.navigate('Preview', { imageUri: result.assets[0].uri });
    }
  };

  const handleScanBarcode = () => {
    scanned.current = false;       // reset guard for a fresh scan session
    setIsBarcodeModeActive(true);  // switch camera into barcode mode
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned.current) return;   // guard: only fire once
    scanned.current = true;
    setIsBarcodeModeActive(false); // exit barcode mode
    navigation.navigate('Result', { upc: data });
  };

  // ── Camera view ────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={
          isBarcodeModeActive
            ? { barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }
            : undefined
        }
        onBarcodeScanned={isBarcodeModeActive ? handleBarcodeScanned : undefined}
      />

      {isBarcodeModeActive && (
        <View style={styles.barcodeOverlay} pointerEvents="none">
          <View style={styles.bracketTopLeft} />
          <View style={styles.bracketTopRight} />
          <View style={styles.bracketBottomLeft} />
          <View style={styles.bracketBottomRight} />
          <Text style={styles.barcodeHint}>Point at a barcode</Text>
        </View>
      )}

      {sheetOpen && (
        <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)} />
      )}

      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setSheetOpen(true)}
        >
          <View style={styles.grid}>
            <View style={styles.gridRow}>
              <View style={styles.gridDot} />
              <View style={styles.gridDot} />
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridDot} />
              <View style={styles.gridDot} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutter} onPress={handleTakePhoto}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        {isBarcodeModeActive ? (
          <TouchableOpacity
            style={styles.cancelBarcodeBtn}
            onPress={() => setIsBarcodeModeActive(false)}
          >
            <Text style={styles.cancelBarcodeText}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </SafeAreaView>

      {sheetOpen && (
        <View style={styles.sheet}>
          <TouchableOpacity
            style={styles.sheetOption}
            onPress={() => { setSheetOpen(false); handleChooseFromLibrary(); }}
          >
            <Text style={styles.sheetText}>🌄  Choose from Library</Text>
          </TouchableOpacity>
          <View style={styles.sheetDivider} />
          <TouchableOpacity
            style={styles.sheetOption}
            onPress={() => { setSheetOpen(false); handleScanBarcode(); }}
          >
            <Text style={styles.sheetText}>𝄃𝄃𝄂𝄂𝄀𝄁𝄃𝄂𝄂𝄃  Scan Barcode</Text>
          </TouchableOpacity>
          <View style={styles.sheetDivider} />
          <TouchableOpacity
            style={styles.sheetOption}
            onPress={() => setSheetOpen(false)}
          >
            <Text style={[styles.sheetText, { color: colors.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Permission gate
  permissionContainer: {
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
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  buttonText: {
    color: colors.textOnGreen,
    fontWeight: '600',
    fontSize: fontSizes.md,
  },

  // ── Camera
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },

    // ── Barcode overlay
  barcodeOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeHint: {
    color: '#fff',
    fontSize: fontSizes.md,
    backgroundColor: 'rgba(10,11,31,0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },

  // Corner brackets — 4 absolute Views, each showing 2 sides of a corner
  bracketTopLeft: {
    position: 'absolute',
    top: '28%',
    left: '15%',
    width: 36,
    height: 36,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    borderTopLeftRadius: 4,
  },
  bracketTopRight: {
    position: 'absolute',
    top: '28%',
    right: '15%',
    width: 36,
    height: 36,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    borderTopRightRadius: 4,
  },
  bracketBottomLeft: {
    position: 'absolute',
    bottom: '28%',
    left: '15%',
    width: 36,
    height: 36,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  bracketBottomRight: {
    position: 'absolute',
    bottom: '28%',
    right: '15%',
    width: 36,
    height: 36,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    borderBottomRightRadius: 4,
  },

  // ── Backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject, // covers the entire screen
    backgroundColor: 'transparent',  // invisible but catches taps
  },

  // ── Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: 'rgba(10,11,31,0.6)',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    gap: 4,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 4,
  },
  gridDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: '#fff',
  },

  // ── Inline sheet
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  sheetOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  sheetText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xl,
  },


  spacer: { width: 44 },  // was 80 — must match actionButton width to center shutter

  cancelBarcodeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBarcodeText: {
    color: '#fff',
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
});