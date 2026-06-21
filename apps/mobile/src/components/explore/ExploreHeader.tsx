import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SearchBar } from '@/components/wanderlog/search-bar';
import { CATEGORIES } from '@/constants/places';
import { Fonts } from '@/constants/theme';
import type { ExploreLocation, PlaceCategory } from '@/types/places';
import { CategoryChip } from './CategoryChip';

type Props = {
  location: ExploreLocation | null;
  isLoadingLocation: boolean;
  selectedCategory: PlaceCategory;
  onRequestNearMe: () => void;
  onSubmitCustomLocation: (query: string) => void;
  onSelectCategory: (category: PlaceCategory) => void;
};

export function ExploreHeader({
  location,
  isLoadingLocation,
  selectedCategory,
  onRequestNearMe,
  onSubmitCustomLocation,
  onSelectCategory,
}: Props) {
  const [searchText, setSearchText] = useState('');

  const handleSubmit = () => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      onRequestNearMe();
      return;
    }
    Keyboard.dismiss();
    onSubmitCustomLocation(trimmed);
  };

  const handleNearMe = () => {
    setSearchText('');
    Keyboard.dismiss();
    onRequestNearMe();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        onSubmit={handleSubmit}
        placeholder="City, area, or neighbourhood…"
      />

      <View style={styles.locationRow}>
        {isLoadingLocation ? (
          <ActivityIndicator size="small" color="#f4a261" />
        ) : (
          <>
            <Pressable onPress={handleNearMe} style={styles.nearMeButton}>
              <Text style={styles.nearMeIcon}>📍</Text>
              <Text
                style={[
                  styles.nearMeLabel,
                  location?.mode === 'near_me' && styles.nearMeLabelActive,
                ]}
              >
                Near Me
              </Text>
            </Pressable>

            {location ? (
              <Text style={styles.locationLabel} numberOfLines={1}>
                {location.label}
              </Text>
            ) : null}
          </>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
        style={styles.chipsScrollView}
        keyboardShouldPersistTaps="handled"
      >
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.id}
            id={cat.id}
            label={cat.label}
            selected={selectedCategory === cat.id}
            onPress={onSelectCategory}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2c2c2e',
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 40,
    color: '#ffffff',
    paddingTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 28,
    marginTop: 4,
  },
  nearMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#1c1c1e',
    borderCurve: 'continuous',
  },
  nearMeIcon: {
    fontSize: 13,
  },
  nearMeLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: '#8e8e93',
  },
  nearMeLabelActive: {
    color: '#f4a261',
  },
  locationLabel: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#8e8e93',
    textAlign: 'right',
  },
  chipsScrollView: {
    marginTop: 8,
  },
  chipsScroll: {
    paddingBottom: 2,
    gap: 0,
  },
});
