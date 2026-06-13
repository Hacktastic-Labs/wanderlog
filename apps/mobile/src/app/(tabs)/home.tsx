import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenContainer } from '@/components/wanderlog/screen-container';
import { Fonts } from '@/constants/theme';

export default function HomeScreen() {
  const [query, setQuery] = useState('');

  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>Home</Text>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Where are you going?"
            placeholderTextColor="#8e8e93"
            style={styles.searchInput}
          />
          <Pressable
            onPress={() => {
              // TODO: wire search when backend is ready
            }}
            style={({ pressed }) => [
              styles.searchButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.searchIcon}>⌕</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 40,
    color: '#ffffff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 999,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderCurve: 'continuous',
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 16,
    color: '#ffffff',
    paddingVertical: 8,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f4a261',
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  searchIcon: {
    color: '#ffffff',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
  },
});
