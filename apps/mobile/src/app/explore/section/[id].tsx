import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlaceList } from '@/components/explore/PlaceList';
import { EXPLORE_SECTIONS } from '@/constants/places';
import { BottomTabInset, Fonts } from '@/constants/theme';
import { useInfiniteSectionPlaces } from '@/hooks/use-places';
import type { ExploreLocation } from '@/types/places';

export default function ExploreSectionScreen() {
  const insets = useSafeAreaInsets();
  const { id, location: locationParam } = useLocalSearchParams<{
    id: string;
    location?: string;
  }>();

  const section = EXPLORE_SECTIONS.find((item) => item.id === id);
  const location = parseLocationParam(locationParam);
  const isReady = !!section && !!location;

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSectionPlaces(section ?? EXPLORE_SECTIONS[0]!, location, isReady);

  const places = data?.pages.flatMap((page) => page.results) ?? [];

  if (!isReady) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Section not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backButton}>←</Text>
        </Pressable>
        <Text style={styles.title}>
          {section.emoji} {section.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <PlaceList
        places={places}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onEndReached={() => fetchNextPage()}
        emptyMessage={`No ${section.title.toLowerCase()} found in ${location.label}`}
      />

      <View style={{ height: insets.bottom + BottomTabInset }} />
    </View>
  );
}

function parseLocationParam(value?: string): ExploreLocation | null {
  if (!value) return null;

  try {
    return JSON.parse(decodeURIComponent(value)) as ExploreLocation;
  } catch {
    return null;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  backButton: {
    color: '#ffffff',
    fontSize: 24,
    width: 32,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontFamily: Fonts.bodySemiBold,
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    gap: 12,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: Fonts.bodySemiBold,
  },
  backText: {
    color: '#f4a261',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
});
