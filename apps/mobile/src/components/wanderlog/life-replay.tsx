import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { LifeReplayFrame } from '@/types/domain';

type Props = {
  frames: LifeReplayFrame[];
  onFrameChange?: (frame: LifeReplayFrame) => void;
};

export const LifeReplay = ({ frames, onFrameChange }: Props) => {
  const [index, setIndex] = useState(0);

  const frame = useMemo(() => frames[index], [frames, index]);

  if (!frames.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Life Replay</Text>
        <Text style={styles.timestamp}>{new Date(frame.timestamp).toLocaleDateString()}</Text>
      </View>

      <Text style={styles.progress}>{`${index + 1} / ${frames.length}`}</Text>

      <View style={styles.controls}>
        <Pressable
          style={styles.playButton}
          onPress={() => {
            const nextIndex = Math.max(0, index - 1);
            setIndex(nextIndex);
            onFrameChange?.(frames[nextIndex]);
          }}>
          <Text style={styles.playLabel}>Back</Text>
        </Pressable>

        <Pressable
          style={styles.playButton}
          onPress={() => {
            const nextIndex = Math.min(frames.length - 1, index + 1);
            setIndex(nextIndex);
            onFrameChange?.(frames[nextIndex]);
          }}>
          <Text style={styles.playLabel}>Forward</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    padding: 12,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#102A43',
  },
  timestamp: {
    fontSize: 12,
    color: '#486581',
  },
  playButton: {
    backgroundColor: '#102A43',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  progress: {
    color: '#486581',
    fontSize: 12,
  },
  playLabel: {
    color: '#F0F4F8',
    fontWeight: '600',
    fontSize: 12,
  },
});
