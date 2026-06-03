import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: string | number;
};

export const StatPill = ({ label, value }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#102A43',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 4,
  },
  value: {
    color: '#F0F4F8',
    fontSize: 22,
    fontWeight: '700',
  },
  label: {
    color: '#BCCCDC',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
