import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import AppNavigator from './src/navigation/AppNavigator';


// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'PlayfairDisplay-Regular': require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Bold': require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
    'GoogleSansFlex-Regular': require('./assets/fonts/GoogleSansFlex-Regular.ttf'),
    'GoogleSansFlex-Bold': require('./assets/fonts/GoogleSansFlex-Bold.ttf'),
    'MirandaSans-Regular': require('./assets/fonts/MirandaSans-Regular.ttf'),
    'MirandaSans-Bold': require('./assets/fonts/MirandaSans-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (

    <ActionSheetProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppNavigator />
      </View>
    </ActionSheetProvider>

  );
}