import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
};

export const SearchInput = ({ value, onChangeText, placeholder }: Props) => {
  return (
    <View style={styles.wrapper}>
      <MaterialCommunityIcons name="magnify" size={20} color="#486581" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7B8794"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#102A43',
    fontSize: 15,
  },
});
