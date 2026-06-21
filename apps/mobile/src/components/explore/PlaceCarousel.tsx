import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CARD_HEIGHT, CARD_WIDTH } from '@/constants/places';
import { Fonts } from '@/constants/theme';
import type { PlaceSummary } from '@/types/places';
import { PlaceCard } from './PlaceCard';
import { PlaceCardSkeleton } from './PlaceCardSkeleton';

type Props = {
  emoji: string;
  title: string;
  places: PlaceSummary[];
  isLoading: boolean;
  isError: boolean;
  onSeeAll?: () => void;
  onRetry?: () => void;
  cardWidth?: number;
  cardHeight?: number;
};

const SKELETON_COUNT = 4;

export function PlaceCarousel({
  emoji,
  title,
  places,
  isLoading,
  isError,
  onSeeAll,
  onRetry,
  cardWidth = CARD_WIDTH,
  cardHeight = CARD_HEIGHT,
}: Props) {
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load places</Text>
        {onRetry ? (
          <Pressable onPress={onRetry} hitSlop={8}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {emoji} {title}
        </Text>
        {onSeeAll && (
          <Pressable onPress={onSeeAll} hitSlop={8}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        )}
      </View>

      {/* Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
        snapToInterval={cardWidth + 12}
        snapToAlignment="start"
      >
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <PlaceCardSkeleton key={i} width={cardWidth} height={cardHeight} />
            ))
          : places.map((place) => (
              <PlaceCard
                key={place.place_id}
                place={place}
                width={cardWidth}
                height={cardHeight}
              />
            ))}
      </ScrollView>

      {!isLoading && places.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No places found nearby</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bodySemiBold,
    color: '#ffffff',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: '#f4a261',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  emptyContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#8e8e93',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  errorText: {
    color: '#ff453a',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  retryText: {
    color: '#f4a261',
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
  },
});
