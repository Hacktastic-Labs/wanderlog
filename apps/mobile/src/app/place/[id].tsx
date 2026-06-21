import { useLocalSearchParams } from 'expo-router';

import { PlaceDetails } from '@/components/explore/PlaceDetails';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <PlaceDetails placeId={id} />;
}
