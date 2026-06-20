import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

type Props = {
  title: string;
  actionLabel?: string;
};

export function SectionHeader({ title, actionLabel }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? <Text style={styles.action}>{actionLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 18,
    color: '#ffffff',
  },
  action: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: '#f4a261',
  },
});
