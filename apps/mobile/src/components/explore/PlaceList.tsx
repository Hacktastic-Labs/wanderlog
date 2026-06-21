import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { LARGE_CARD_HEIGHT, LARGE_CARD_WIDTH } from '@/constants/places';
import { Fonts } from '@/constants/theme';
import type { PlaceSummary } from '@/types/places';
import { PlaceCard } from './PlaceCard';
import { PlaceCardSkeleton } from './PlaceCardSkeleton';

type Props = {
  places: PlaceSummary[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onEndReached?: () => void;
  emptyMessage?: string;
};

const SKELETON_COUNT = 3;

export function PlaceList({
  places,
  isLoading,
  isError,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onEndReached,
  emptyMessage = 'No places found',
}: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(LARGE_CARD_WIDTH, width - 32);

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load places</Text>
        {onRetry ? (
          <Pressable onPress={onRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  if (isLoading && places.length === 0) {
    return (
      <View style={styles.skeletonList}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <PlaceCardSkeleton key={index} width={cardWidth} height={LARGE_CARD_HEIGHT} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={places}
      keyExtractor={(item) => item.place_id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          onEndReached?.();
        }
      }}
      onEndReachedThreshold={0.4}
      ListEmptyComponent={
        !isLoading ? (
          <View style={styles.centered}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator color="#f4a261" style={styles.footerLoader} />
        ) : null
      }
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <PlaceCard place={item} width={cardWidth} height={LARGE_CARD_HEIGHT} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  listItem: {
    marginBottom: 16,
  },
  skeletonList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 48,
    lineHeight: 56,
  },
  emptyText: {
    color: '#8e8e93',
    fontSize: 15,
    fontFamily: Fonts.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorText: {
    color: '#ff453a',
    fontSize: 15,
    fontFamily: Fonts.body,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#1c1c1e',
    borderCurve: 'continuous',
  },
  retryText: {
    color: '#f4a261',
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
