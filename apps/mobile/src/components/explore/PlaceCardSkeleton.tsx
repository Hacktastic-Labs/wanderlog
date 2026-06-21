import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { CARD_HEIGHT, CARD_WIDTH } from '@/constants/places';

type Props = {
  width?: number;
  height?: number;
};

export function PlaceCardSkeleton({ width = CARD_WIDTH, height = CARD_HEIGHT }: Props) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(opacity);
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.card, { width, height }, animStyle]}>
      <View style={styles.imageSkeleton} />
      <View style={styles.content}>
        <View style={[styles.bar, { width: '70%', height: 14 }]} />
        <View style={[styles.bar, { width: '45%', height: 11, marginTop: 6 }]} />
        <View style={[styles.bar, { width: '55%', height: 11, marginTop: 4 }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: '#1c1c1e',
    overflow: 'hidden',
    marginRight: 12,
  },
  imageSkeleton: {
    flex: 1,
    backgroundColor: '#2c2c2e',
  },
  content: {
    padding: 12,
  },
  bar: {
    borderRadius: 6,
    backgroundColor: '#3a3a3c',
  },
});
