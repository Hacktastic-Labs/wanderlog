import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MapExplorePanel } from '@/components/wanderlog/map-explore-panel';
import { StatsExplorePanel } from '@/components/wanderlog/stats-explore-panel';
import { TimelineExplorePanel } from '@/components/wanderlog/timeline-explore-panel';

const SECTIONS = [
  { id: 'places', label: 'Places' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'stats', label: 'Stats' },
] as const;

type ExploreSection = (typeof SECTIONS)[number]['id'];

export default function ExploreScreen() {
  const [section, setSection] = useState<ExploreSection>('places');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.segmentRow}>
          {SECTIONS.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.segment, section === item.id ? styles.segmentActive : null]}
              onPress={() => setSection(item.id)}>
              <Text style={[styles.segmentLabel, section === item.id ? styles.segmentLabelActive : null]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        {section === 'places' ? <MapExplorePanel /> : null}
        {section === 'timeline' ? <TimelineExplorePanel /> : null}
        {section === 'stats' ? <StatsExplorePanel /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF3F9',
  },
  header: {
    paddingTop: 8,
    paddingHorizontal: 16,
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#102A43',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#BCCCDC',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  segmentActive: {
    backgroundColor: '#102A43',
    borderColor: '#102A43',
  },
  segmentLabel: {
    color: '#334E68',
    fontSize: 13,
    fontWeight: '700',
  },
  segmentLabelActive: {
    color: '#F0F4F8',
  },
  panel: {
    flex: 1,
  },
});
