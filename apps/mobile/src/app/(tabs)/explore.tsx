import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { PlaceCarousel } from '@/components/explore/PlaceCarousel';
import { PlaceList } from '@/components/explore/PlaceList';
import { EXPLORE_SECTIONS } from '@/constants/places';
import { BottomTabInset } from '@/constants/theme';
import { useInfiniteCategoryPlaces, useSectionPlaces } from '@/hooks/use-places';
import { queryClient } from '@/lib/query-client';
import type { ExploreLocation, PlaceCategory } from '@/types/places';

// ---------------------------------------------------------------------------
// Per-section carousel rendered only when needed
// ---------------------------------------------------------------------------
function SectionCarousel({
  sectionIndex,
  location,
}: {
  sectionIndex: number;
  location: ExploreLocation;
}) {
  const section = EXPLORE_SECTIONS[sectionIndex]!;
  const { data = [], isLoading, isError, refetch } = useSectionPlaces(section, location);

  const handleSeeAll = () => {
    router.push({
      pathname: '/explore/section/[id]',
      params: {
        id: section.id,
        location: encodeURIComponent(JSON.stringify(location)),
      },
    });
  };

  return (
    <PlaceCarousel
      emoji={section.emoji}
      title={section.title}
      places={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      onSeeAll={handleSeeAll}
    />
  );
}

// ---------------------------------------------------------------------------
// Category results view (replaces sections when a category is active)
// ---------------------------------------------------------------------------
function CategoryResults({
  category,
  location,
}: {
  category: PlaceCategory;
  location: ExploreLocation;
}) {
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCategoryPlaces(category, location);

  const places = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <PlaceList
      places={places}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onEndReached={() => fetchNextPage()}
      emptyMessage="No places found for this category"
    />
  );
}

// ---------------------------------------------------------------------------
// Empty / no-location state
// ---------------------------------------------------------------------------
function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🗺️</Text>
      <Text style={styles.emptyTitle}>Start Exploring</Text>
      <Text style={styles.emptyBody}>
        Use{' '}
        <Text style={styles.emptyHighlight}>Near Me</Text>{' '}
        or search for a city to discover places around you.
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<ExploreLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleNearMe = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location permission required',
          'Please allow location access to use Near Me.',
        );
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          'Location services disabled',
          'Please turn on location services in your device settings.',
        );
        return;
      }

      let pos = await Location.getLastKnownPositionAsync();
      if (!pos) {
        pos = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Location request timed out')), 15000),
          ),
        ]);
      }

      let label = 'Near Me';
      try {
        const [geo] = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        if (geo) {
          label = geo.city ?? geo.district ?? geo.subregion ?? 'Near Me';
        }
      } catch {
        // Fall back to default label
      }

      setLocation({
        mode: 'near_me',
        coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
        label,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Please try again.';
      Alert.alert(
        'Could not get location',
        `${message}\n\nIf you are on an emulator, set a mock location under Extended Controls → Location.`,
      );
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const handleCustomLocation = useCallback(async (query: string) => {
    setIsLoadingLocation(true);
    try {
      const results = await Location.geocodeAsync(query);
      const first = results[0];

      setLocation({
        mode: 'custom',
        query,
        label: query,
        coords: first
          ? { latitude: first.latitude, longitude: first.longitude }
          : undefined,
      });
    } catch {
      setLocation({
        mode: 'custom',
        query,
        label: query,
      });
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['places'] });
    setIsRefreshing(false);
  }, []);

  const showCategoryList = location && selectedCategory !== 'all';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ExploreHeader
        location={location}
        isLoadingLocation={isLoadingLocation}
        selectedCategory={selectedCategory}
        onRequestNearMe={handleNearMe}
        onSubmitCustomLocation={handleCustomLocation}
        onSelectCategory={setSelectedCategory}
      />

      {showCategoryList ? (
        <CategoryResults category={selectedCategory} location={location} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + BottomTabInset + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#f4a261"
            />
          }
        >
          {!location ? (
            <EmptyState />
          ) : (
            <View style={styles.sections}>
              {EXPLORE_SECTIONS.map((_, index) => (
                <SectionCarousel
                  key={`${EXPLORE_SECTIONS[index]!.id}-${location.label}`}
                  sectionIndex={index}
                  location={location}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  sections: {
    gap: 28,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 64,
    lineHeight: 72,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'BricolageGrotesqueSemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 15,
    fontFamily: 'BricolageGrotesque',
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyHighlight: {
    color: '#f4a261',
    fontFamily: 'BricolageGrotesqueSemiBold',
  },
});
