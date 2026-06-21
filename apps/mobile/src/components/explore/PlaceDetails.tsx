import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { usePlaceDetails } from '@/hooks/use-places';
import { formatDistance, getPhotoUrl } from '@/services/api/places.api';
import { usePlacesStore } from '@/stores/places.store';
import { callPlace, openInGoogleMaps, openWebsite, sharePlace } from '@/utils/place-actions';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop';

type Props = {
  placeId: string;
};

export function PlaceDetails({ placeId }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { data: place, isLoading, isError, refetch } = usePlaceDetails(placeId);
  const isSaved = usePlacesStore((state) => state.isSaved(placeId));
  const savePlace = usePlacesStore((state) => state.savePlace);
  const unsavePlace = usePlacesStore((state) => state.unsavePlace);

  if (isLoading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#f4a261" />
      </View>
    );
  }

  if (isError || !place) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorTitle}>Could not load place</Text>
        <Pressable onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const photos = place.photos?.length ? place.photos : [{ photo_reference: '', height: 1, width: 1 }];
  const phone = place.formatted_phone_number ?? place.international_phone_number;
  const isOpen = place.opening_hours?.open_now;
  const hasHours = place.opening_hours !== undefined;
  const address = place.formatted_address ?? place.vicinity ?? '';

  const handleSave = () => {
    if (isSaved) {
      unsavePlace(place.place_id);
    } else {
      savePlace(place);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Photo gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.gallery}
        >
          {photos.map((photo, index) => {
            const uri =
              photo.photo_reference.length > 0
                ? getPhotoUrl(photo.photo_reference, 1200)
                : FALLBACK_IMAGE;

            return (
              <Image
                key={`${photo.photo_reference}-${index}`}
                source={{ uri }}
                contentFit="cover"
                transition={300}
                style={{ width, height: 320 }}
              />
            );
          })}
        </ScrollView>

        <View style={styles.content}>
          <Text style={styles.name}>{place.name}</Text>

          <View style={styles.metaRow}>
            {place.rating !== undefined ? (
              <View style={styles.ratingRow}>
                <Text style={styles.star}>★</Text>
                <Text style={styles.rating}>{place.rating.toFixed(1)}</Text>
                {place.user_ratings_total !== undefined ? (
                  <Text style={styles.ratingCount}>({place.user_ratings_total})</Text>
                ) : null}
              </View>
            ) : null}

            {place.distance !== undefined ? (
              <Text style={styles.distance}>{formatDistance(place.distance)}</Text>
            ) : null}

            {hasHours ? (
              <View style={[styles.statusBadge, isOpen ? styles.openBadge : styles.closedBadge]}>
                <Text style={styles.statusText}>{isOpen ? 'Open now' : 'Closed'}</Text>
              </View>
            ) : null}
          </View>

          {address ? <Text style={styles.address}>{address}</Text> : null}

          {place.opening_hours?.weekday_text?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Opening hours</Text>
              {place.opening_hours.weekday_text.map((line) => (
                <Text key={line} style={styles.hoursLine}>
                  {line}
                </Text>
              ))}
            </View>
          ) : null}

          {place.reviews?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {place.reviews.slice(0, 3).map((review, index) => (
                <View key={`${review.author_name}-${index}`} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>{review.author_name}</Text>
                    <Text style={styles.reviewRating}>★ {review.rating.toFixed(1)}</Text>
                  </View>
                  <Text style={styles.reviewTime}>{review.relative_time_description}</Text>
                  <Text style={styles.reviewText} numberOfLines={4}>
                    {review.text}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Floating header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </Pressable>
        <Pressable onPress={() => sharePlace(place)} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>↗</Text>
        </Pressable>
      </View>

      {/* Bottom actions */}
      <View style={[styles.actionsBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable onPress={() => openInGoogleMaps(place)} style={styles.primaryAction}>
          <Text style={styles.primaryActionText}>Directions</Text>
        </Pressable>

        <View style={styles.secondaryActions}>
          {phone ? (
            <Pressable onPress={() => callPlace(phone)} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Call</Text>
            </Pressable>
          ) : null}

          {place.website ? (
            <Pressable onPress={() => openWebsite(place.website!)} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Website</Text>
            </Pressable>
          ) : null}

          <Pressable onPress={handleSave} style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>{isSaved ? 'Saved' : 'Save'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    gap: 12,
    paddingHorizontal: 32,
  },
  gallery: {
    backgroundColor: '#1c1c1e',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: Fonts.bodySemiBold,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  name: {
    fontSize: 28,
    fontFamily: Fonts.display,
    color: '#ffffff',
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    color: '#f4a261',
    fontSize: 14,
  },
  rating: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: Fonts.bodySemiBold,
  },
  ratingCount: {
    color: '#acacac',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  distance: {
    color: '#acacac',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  statusBadge: {
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
    fontSize: 12,
    fontFamily: Fonts.bodySemiBold,
  },
  address: {
    color: '#b0b4ba',
    fontSize: 15,
    fontFamily: Fonts.body,
    lineHeight: 22,
  },
  section: {
    marginTop: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bodySemiBold,
    color: '#ffffff',
  },
  hoursLine: {
    color: '#b0b4ba',
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 20,
  },
  reviewCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 14,
    gap: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewAuthor: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
  },
  reviewRating: {
    color: '#f4a261',
    fontSize: 13,
    fontFamily: Fonts.bodySemiBold,
  },
  reviewTime: {
    color: '#8e8e93',
    fontSize: 12,
    fontFamily: Fonts.body,
  },
  reviewText: {
    color: '#d1d1d6',
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 20,
    marginTop: 4,
  },
  actionsBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(0,0,0,0.92)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2c2c2e',
    gap: 10,
  },
  primaryAction: {
    backgroundColor: '#f4a261',
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: Fonts.bodySemiBold,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: Fonts.bodySemiBold,
    textAlign: 'center',
  },
  retryButton: {
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
  backLink: {
    paddingVertical: 8,
  },
  backLinkText: {
    color: '#8e8e93',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
});
