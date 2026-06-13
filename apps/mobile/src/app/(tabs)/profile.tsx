import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { PLACEHOLDER_PROFILE, type ProfileStats } from '@/models/profile.model';
import { useAuthStore } from '@/stores/auth.store';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const signOut = useAuthStore((state) => state.signOut);
  const isSigningOut = useAuthStore((state) => state.isBootstrapping);

  const profile = PLACEHOLDER_PROFILE;

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Logout failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <Image
        source={{ uri: profile.coverUrl }}
        contentFit="cover"
        transition={300}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 260,
          opacity: 0.6,
        }}
      />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text
          style={{
            fontFamily: Fonts.display,
            fontSize: 32,
            lineHeight: 40,
            color: '#ffffff',
            marginBottom: 24,
          }}
        >
          Profile
        </Text>

        <View style={{ alignItems: 'center', gap: 16, marginTop: 40 }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              padding: 4,
              backgroundColor: '#ffffff',
            }}
          >
            <Image
              source={{ uri: profile.avatarUrl }}
              contentFit="cover"
              transition={300}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 58,
              }}
            />
          </View>

          <View style={{ alignItems: 'center', gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text
                style={{
                  fontFamily: Fonts.bodySemiBold,
                  fontSize: 24,
                  color: '#ffffff',
                }}
              >
                {profile.name}
              </Text>
              {profile.isVerified ? (
                <Text style={{ color: '#3b82f6', fontSize: 16 }}>✓</Text>
              ) : null}
            </View>
            {profile.handle ? (
              <Text
                style={{
                  fontFamily: Fonts.body,
                  fontSize: 14,
                  color: '#8e8e93',
                }}
              >
                {profile.handle}
              </Text>
            ) : null}
          </View>

          <Text
            style={{
              fontFamily: Fonts.body,
              fontSize: 16,
              lineHeight: 24,
              color: '#cccccc',
              textAlign: 'center',
              maxWidth: 320,
            }}
          >
            {profile.bio}
          </Text>
        </View>

        <ProfileStatsRow stats={profile.stats} />

        <View style={{ marginTop: 'auto', paddingTop: 32 }}>
          <Pressable
            onPress={handleLogout}
            disabled={isSigningOut}
            style={({ pressed }) => ({
              backgroundColor: '#ffffff',
              borderRadius: 999,
              paddingVertical: 14,
              paddingHorizontal: 24,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              minWidth: 160,
              opacity: pressed || isSigningOut ? 0.8 : 1,
              borderCurve: 'continuous',
            })}
          >
            {isSigningOut ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text
                style={{
                  fontFamily: Fonts.bodySemiBold,
                  fontSize: 16,
                  color: '#000000',
                }}
              >
                Log out
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function ProfileStatsRow({ stats }: { stats: ProfileStats }) {
  const items = [
    { label: 'Likes', value: stats.likes },
    { label: 'Posts', value: stats.posts },
    { label: 'Views', value: stats.views },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 32,
        marginTop: 32,
      }}
    >
      {items.map((item) => (
        <View key={item.label} style={{ alignItems: 'center', gap: 4 }}>
          <Text
            style={{
              fontFamily: Fonts.bodySemiBold,
              fontSize: 18,
              color: '#ffffff',
            }}
          >
            {item.value}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.body,
              fontSize: 13,
              color: '#8e8e93',
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
