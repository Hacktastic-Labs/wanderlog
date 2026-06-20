import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import { CARD_HEIGHT, CARD_WIDTH } from '@/constants/places';
import { Fonts } from '@/constants/theme';
import { formatDistance, getPhotoUrl } from '@/services/api/places.api';
import { usePlacesStore } from '@/stores/places.store';
import type { PlaceSummary } from '@/types/places';
import { openInGoogleMaps, sharePlace } from '@/utils/place-actions';

type Props = {
  place: PlaceSummary;
  /** Width override for featured / large cards */
  width?: number;
  height?: number;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop';

const AnimatedView = Animated.createAnimatedComponent(View);

export function PlaceCard({ place, width = CARD_WIDTH, height = CARD_HEIGHT }: Props) {
  const scale = useSharedValue(1);
  const isSaved = usePlacesStore((state) => state.isSaved(place.place_id));
  const savePlace = usePlacesStore((state) => state.savePlace);
  const unsavePlace = usePlacesStore((state) => state.unsavePlace);

  const coverUri =
    place.photos && place.photos.length > 0
      ? getPhotoUrl(place.photos[0]!.photo_reference, 600)
      : FALLBACK_IMAGE;

  const isOpen = place.opening_hours?.open_now;
  const hasHours = place.opening_hours !== undefined;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    router.push(`/place/${place.place_id}`);
  };

  const handleShare = () => {
    void sharePlace(place);
  };

  const handleMaps = () => {
    void openInGoogleMaps(place);
  };

  const handleSave = () => {
    if (isSaved) {
      unsavePlace(place.place_id);
    } else {
      savePlace(place);
    }
  };

  // Derive a short category label from the types array
  const categoryLabel = deriveCategoryLabel(place.types ?? []);

  return (
    <AnimatedView style={[{ width, height, marginRight: 12 }, animStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { width, height }]}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${place.name}`}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: coverUri }}
            contentFit="cover"
            transition={300}
            recyclingKey={place.place_id}
            style={styles.image}
            accessibilityIgnoresInvertColors
          />
        </View>

        <View style={styles.overlay} pointerEvents="none" />

        {/* Action buttons */}
      <View style={styles.actionRow}>
        <Pressable
          onPress={handleShare}
          hitSlop={8}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel={`Share ${place.name}`}
        >
          <Text style={styles.actionIcon}>↗</Text>
        </Pressable>
        <Pressable
          onPress={handleMaps}
          hitSlop={8}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel={`Open ${place.name} in Google Maps`}
        >
          <Text style={styles.actionIcon}>🗺</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          hitSlop={8}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save place'}
        >
          <Text style={styles.saveIcon}>{isSaved ? '♥' : '♡'}</Text>
        </Pressable>
      </View>

      {/* Open/Closed badge */}
      {hasHours && (
        <View style={[styles.statusBadge, isOpen ? styles.openBadge : styles.closedBadge]}>
          <Text style={styles.statusText}>{isOpen ? 'Open' : 'Closed'}</Text>
        </View>
      )}

      {/* Bottom content */}
      <View style={styles.content}>
        {categoryLabel ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{categoryLabel}</Text>
          </View>
        ) : null}

        <Text style={styles.name} numberOfLines={2}>
          {place.name}
        </Text>

        <View style={styles.meta}>
          {place.rating !== undefined && (
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{place.rating.toFixed(1)}</Text>
              {place.user_ratings_total !== undefined && (
                <Text style={styles.ratingCount}>({formatCount(place.user_ratings_total)})</Text>
              )}
            </View>
          )}

          {place.distance !== undefined && (
            <Text style={styles.distance}>{formatDistance(place.distance)}</Text>
          )}
        </View>

        {(place.vicinity ?? place.formatted_address) ? (
          <Text style={styles.address} numberOfLines={1}>
            {place.vicinity ?? place.formatted_address}
          </Text>
        ) : null}
      </View>
      </Pressable>
    </AnimatedView>
  );
}

function deriveCategoryLabel(types: string[]): string {
  const MAP: Record<string, string> = {
    restaurant: 'Restaurant',
    cafe: 'Café',
    bar: 'Bar',
    night_club: 'Nightlife',
    park: 'Park',
    museum: 'Museum',
    art_gallery: 'Gallery',
    tourist_attraction: 'Attraction',
    shopping_mall: 'Shopping',
    store: 'Store',
    gym: 'Fitness',
    amusement_park: 'Activity',
    movie_theater: 'Cinema',
    bowling_alley: 'Activity',
  };

  for (const type of types) {
    if (MAP[type]) return MAP[type];
  }
  return '';
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: '#1c1c1e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  imageContainer: {
    ...StyleSheet.absoluteFill,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  actionRow: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 20,
  },
  saveIcon: {
    fontSize: 18,
    color: '#ff6b6b',
    lineHeight: 22,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderCurve: 'continuous',
  },
  openBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.85)',
  },
  closedBadge: {
    backgroundColor: 'rgba(255, 59, 48, 0.75)',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: Fonts.bodySemiBold,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    paddingTop: 40,
    // Bottom fade via a repeated background trick
    backgroundColor: 'rgba(0,0,0,0.55)',
    gap: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(244, 162, 97, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderCurve: 'continuous',
    marginBottom: 2,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: Fonts.bodySemiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: Fonts.bodySemiBold,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  star: {
    color: '#f4a261',
    fontSize: 13,
  },
  rating: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: Fonts.bodySemiBold,
  },
  ratingCount: {
    color: '#acacac',
    fontSize: 12,
    fontFamily: Fonts.body,
  },
  distance: {
    color: '#acacac',
    fontSize: 12,
    fontFamily: Fonts.body,
  },
  address: {
    color: '#b0b4ba',
    fontSize: 12,
    fontFamily: Fonts.body,
    marginTop: 1,
  },
});
