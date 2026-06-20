import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Fonts } from '@/constants/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Where are you going?',
}: Props) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchBar}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor="#8e8e93"
          returnKeyType="search"
          style={styles.searchInput}
        />
        <Pressable
          onPress={onSubmit}
          style={({ pressed }) => [styles.searchButton, { opacity: pressed ? 0.8 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Text style={styles.searchIcon}>⌕</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
