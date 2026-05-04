import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PermissionState = 'undetermined' | 'granted' | 'denied';

const ASKED_KEY = 'location_permission_asked';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface LocationPermission {
  status: PermissionState;
  coords: LocationCoords | null;
  request: () => Promise<{ granted: boolean; coords: LocationCoords | null }>;
}

export function useLocationPermission(): LocationPermission {
  const [status, setStatus] = useState<PermissionState>('undetermined');
  const [coords, setCoords] = useState<LocationCoords | null>(null);

  // On mount: check current permission state (never prompt here)
  useEffect(() => {
    (async () => {
      const { status: current } = await Location.getForegroundPermissionsAsync();
      const mapped = mapStatus(current);
      setStatus(mapped);

      // If already granted from a previous session, grab coords immediately
      if (mapped === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        setCoords({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    })();
  }, []);

  // Called from PreviewScreen — prompts only if we haven't asked before
    const request = useCallback(async (): Promise<{ granted: boolean; coords: LocationCoords | null }> => {
        const alreadyAsked = await AsyncStorage.getItem(ASKED_KEY);

        if (alreadyAsked) {
            const { status: current } = await Location.getForegroundPermissionsAsync();
            if (current === Location.PermissionStatus.GRANTED) {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
            const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
            setCoords(coords);
            return { granted: true, coords };
            }
            return { granted: false, coords: null };
        }

        await AsyncStorage.setItem(ASKED_KEY, 'true');
        const { status: result } = await Location.requestForegroundPermissionsAsync();
        const mapped = mapStatus(result);
        setStatus(mapped);

        if (mapped === 'granted') {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
            const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
            setCoords(coords);
            return { granted: true, coords };
        }

        return { granted: false, coords: null };
        }, []);
        return { status, coords, request };
    }



function mapStatus(status: string | undefined): PermissionState {
  if (status === Location.PermissionStatus.GRANTED) return 'granted';
  if (status === Location.PermissionStatus.DENIED) return 'denied';
  return 'undetermined';
}