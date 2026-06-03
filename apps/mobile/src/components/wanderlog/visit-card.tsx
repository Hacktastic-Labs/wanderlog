import { StyleSheet, Text, View } from 'react-native';

import { CATEGORY_LABELS } from '@/constants/wanderlog';
import type { Visit } from '@/types/domain';
import { formatDateTime, formatDurationMinutes } from '@/utils/date';

export const VisitCard = ({ visit }: { visit: Visit }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{visit.placeName}</Text>
      <Text style={styles.meta}>{CATEGORY_LABELS[visit.category]}</Text>
      <Text style={styles.meta}>{formatDateTime(visit.arrivedAt)}</Text>
      <Text style={styles.duration}>{formatDurationMinutes(visit.durationMinutes)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE6EE',
    gap: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#102A43',
  },
  meta: {
    fontSize: 13,
    color: '#486581',
  },
  duration: {
    marginTop: 6,
    color: '#0E7490',
    fontWeight: '600',
  },
});
