import { useCallback } from 'react';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { colors, fontSizes } from './src/theme/theme';
import { fonts } from './src/theme/typography';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'MirandaSans-Regular':     require('./assets/fonts/MirandaSans-Regular.ttf'),
    'MirandaSans-Bold':        require('./assets/fonts/MirandaSans-Bold.ttf'),
    'GoogleSansFlex-Regular':  require('./assets/fonts/GoogleSansFlex-Regular.ttf'),
    'GoogleSansFlex-Bold':     require('./assets/fonts/GoogleSansFlex-Bold.ttf'),
    'PlayfairDisplay-Regular': require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Bold':    require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={{ fontFamily: fonts.brand, fontSize: fontSizes.display, color: colors.primary }}>
        Recycl.ai
      </Text>
      <Text style={{ fontFamily: fonts.titleUI, fontSize: fontSizes.xl, color: colors.textPrimary }}>
        Scan. Learn. Recycle.
      </Text>
      <Text style={{ fontFamily: fonts.body, fontSize: fontSizes.md, color: colors.textSecondary }}>
        Changing the world one can at a time
      </Text>
    </View>
  );
}