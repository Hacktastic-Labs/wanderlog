import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ScreenContainer } from '@/components/wanderlog/screen-container';
import { SearchBar } from '@/components/wanderlog/search-bar';
import { Fonts } from '@/constants/theme';

export default function HomeScreen() {
  const [query, setQuery] = useState('');

  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>Home</Text>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={() => {
          // TODO: wire search when backend is ready
        }}
      />
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
});
