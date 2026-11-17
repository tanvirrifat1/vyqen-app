import { DarkTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { V } from '@/constants/vyqen';
import { BagProvider } from '@/store/bag';
import { FavoritesProvider } from '@/store/favorites';

SplashScreen.preventAutoHideAsync();

const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: V.bg, card: V.bg } };

export default function RootLayout() {
  return (
    <BagProvider>
      <FavoritesProvider>
      <ThemeProvider value={theme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: V.bg } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="bag" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="favorites" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="checkout" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </ThemeProvider>
      </FavoritesProvider>
    </BagProvider>
  );
}
