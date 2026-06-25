import { StyleSheet, Text, View } from 'react-native';

import { CATEGORY_EMOJI, CATEGORY_LABELS } from '@/constants/home';
import { Fonts } from '@/constants/theme';
import { formatDuration, formatVisitDate } from '@/hooks/use-home-dashboard';
import type { Visit } from '@/types/domain';

type Props = {
  visit: Visit;
};

export function RecentVisitCard({ visit }: Props) {
  const emoji = CATEGORY_EMOJI[visit.category];
  const categoryLabel = CATEGORY_LABELS[visit.category];

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {visit.placeName}
        </Text>
        <Text style={styles.category}>{categoryLabel}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatVisitDate(visit.arrivedAt)} · {formatDuration(visit.durationMinutes)}
        </Text>
        {visit.city ? (
          <Text style={styles.location} numberOfLines={1}>
            {visit.city}
            {visit.country ? `, ${visit.country}` : ''}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 14,
    gap: 12,
    alignItems: 'center',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: '#2c2c2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: '#ffffff',
  },
  category: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#f4a261',
  },
  meta: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
  },
  location: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: '#636366',
  },
});
