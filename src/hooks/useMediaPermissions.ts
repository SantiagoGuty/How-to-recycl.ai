import { useState, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { useCameraPermissions, PermissionStatus } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export type PermissionState = 'undetermined' | 'granted' | 'denied';

interface MediaPermissions {
  cameraStatus: PermissionState;
  libraryStatus: PermissionState;
  requestCameraPermission: () => Promise<boolean>;
  requestLibraryPermission: () => Promise<boolean>;
  openSettings: () => void;
}

export function useMediaPermissions(): MediaPermissions {
  const [cameraPermission, requestCamera] = useCameraPermissions();
  const [libraryStatus, setLibraryStatus] = useState<PermissionState>('undetermined');

  // Check library permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      setLibraryStatus(mapStatus(status));
    })();
  }, []);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    const result = await requestCamera();
    return result?.granted ?? false;
  }, [requestCamera]);

  const requestLibraryPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setLibraryStatus(mapStatus(status));
    return status === PermissionStatus.GRANTED;
  }, []);

  const openSettings = useCallback(() => {
    // iOS: opens app-specific Settings page
    // Android: opens app info page
    Linking.openSettings();
  }, []);

  return {
    cameraStatus: mapStatus(cameraPermission?.status),
    libraryStatus,
    requestCameraPermission,
    requestLibraryPermission,
    openSettings,
  };
}

// Maps expo's PermissionStatus enum to our simpler 3-state type
function mapStatus(status: string | undefined): PermissionState {
  if (status === PermissionStatus.GRANTED) return 'granted';
  if (status === PermissionStatus.DENIED) return 'denied';
  return 'undetermined';
}