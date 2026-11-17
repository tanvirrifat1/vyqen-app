import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DURATION = 600;
const HOLD = 800;
const SPLASH_BG = '#1a0b04';

const fadeOut = new Keyframe({
  0: { transform: [{ scale: 1 }], opacity: 1 },
  20: { opacity: 1 },
  70: { opacity: 0, easing: Easing.elastic(0.7) },
  100: { opacity: 0, transform: [{ scale: 1 }], easing: Easing.elastic(0.7) },
});

/**
 * Branded JS splash that sits on top of the app until the lamp image has loaded,
 * then holds briefly and fades out. The native splash (app.json) uses the same
 * image + background colour so the hand-off is seamless.
 */
export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    let timer: ReturnType<typeof setTimeout>;
    SplashScreen.hideAsync().finally(() => {
      timer = setTimeout(() => setAnimate(true), HOLD);
    });
    return () => clearTimeout(timer);
  }, [loaded]);

  if (!visible) return null;

  const image = (
    <Image
      style={styles.splashImage}
      source={require('@/assets/images/splash-icon.png')}
      onLoad={() => setLoaded(true)}
    />
  );

  return animate ? (
    <Animated.View
      entering={fadeOut.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) scheduleOnRN(setVisible, false);
      })}
      style={styles.splashOverlay}>
      {image}
    </Animated.View>
  ) : (
    <View style={styles.splashOverlay}>{image}</View>
  );
}

const styles = StyleSheet.create({
  splashImage: { width: 240, height: 240 },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: SPLASH_BG,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
