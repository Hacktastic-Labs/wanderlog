import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import { Fonts } from '@/constants/theme';
import type { PlaceCategory } from '@/types/places';

type Props = {
  id: PlaceCategory;
  label: string;
  selected: boolean;
  onPress: (id: PlaceCategory) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryChip({ id, label, selected, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.93, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={() => onPress(id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.chip, selected ? styles.chipSelected : styles.chipIdle, animatedStyle]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Filter by ${label}`}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderCurve: 'continuous',
    marginRight: 8,
  },
  chipIdle: {
    backgroundColor: '#1c1c1e',
    borderWidth: 1,
    borderColor: '#333333',
  },
  chipSelected: {
    backgroundColor: '#f4a261',
    borderWidth: 1,
    borderColor: '#f4a261',
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
  },
  labelIdle: {
    color: '#acacac',
  },
  labelSelected: {
    color: '#ffffff',
  },
});
