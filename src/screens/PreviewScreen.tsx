import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useLocationPermission } from '../hooks/useLocationPermission';
import { RootStackParamList } from '../navigation/Types';
import { colors, spacing, radii, fontSizes } from '../theme/theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Preview'>;
  route: RouteProp<RootStackParamList, 'Preview'>;
};

const { width, height } = Dimensions.get('window');


export default function PreviewScreen({ navigation, route }: Props) {
  const { imageUri } = route.params;
  const { coords, request: requestLocation } = useLocationPermission(); 


  //  handleUsePhoto
  // OS permission grant will work whenever 
  const handleUsePhoto = async () => {
    const { coords: freshCoords } = await requestLocation();
    navigation.navigate('Result', {
      imageUri,
      coords: freshCoords ?? undefined,
    });
  };

  const handleRetake = () => {
    navigation.goBack(); // goes back to ScannerScreen
  };

  return (
    <View style={styles.container}>

      {/* Full-screen photo */}
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Top bar — Retake on the left */}
      <SafeAreaView edges={['top']} style={styles.topBar}>
        <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
          <Text style={styles.retakeText}>✕  Retake</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom bar — Use this photo */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity style={styles.useButton} onPress={handleUsePhoto}>
          <Text style={styles.useButtonText}>Use this photo</Text>
        </TouchableOpacity>
      </SafeAreaView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width,
    height,
    position: 'absolute',
  },

  // ── Top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  retakeButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(10,11,31,0.6)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
  },
  retakeText: {
    color: '#fff',
    fontSize: fontSizes.md,
    fontWeight: '600',
  },

  // ── Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  useButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  useButtonText: {
    color: colors.textOnGreen,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
});