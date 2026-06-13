import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthColors } from '@/constants/colors';
import { useSignInMutation } from '@/hooks/use-auth-mutations';
import { useAuthStore } from '@/stores/auth.store';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const session = useAuthStore((state) => state.session);
  const { mutateAsync: signIn, isPending } = useSignInMutation();

  if (session?.user.id) {
    return <Redirect href="/(tabs)/home" />;
  }

  const onLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    try {
      await signIn({ email: email.trim(), password });
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: AuthColors.background }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          gap: 24,
        }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontFamily: 'ChelseaMarket',
              fontSize: 40,
              color: AuthColors.foreground,
            }}
          >
            wanderlog.
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: AuthColors.foreground,
              textAlign: 'center',
            }}
          >
            Login
          </Text>

          <View style={{ gap: 12 }}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="Email"
              placeholderTextColor={AuthColors.muted}
              style={{
                backgroundColor: AuthColors.input,
                color: AuthColors.foreground,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                borderCurve: 'continuous',
              }}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
              placeholder="Password"
              placeholderTextColor={AuthColors.muted}
              style={{
                backgroundColor: AuthColors.input,
                color: AuthColors.foreground,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                borderCurve: 'continuous',
              }}
            />
          </View>

          <Pressable
            onPress={onLogin}
            disabled={isPending}
            style={({ pressed }) => ({
              backgroundColor: AuthColors.foreground,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 50,
              opacity: pressed || isPending ? 0.8 : 1,
              borderCurve: 'continuous',
            })}
          >
            {isPending ? (
              <ActivityIndicator color={AuthColors.foregroundInverse} />
            ) : (
              <Text
                style={{
                  color: AuthColors.foregroundInverse,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Sign in
              </Text>
            )}
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', gap: 16 }}>
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable>
              <Text style={{ color: AuthColors.muted, fontSize: 14 }}>Forgot Password?</Text>
            </Pressable>
          </Link>

          <Link href="/(auth)/signup" asChild>
            <Pressable>
              <Text style={{ color: AuthColors.muted, fontSize: 14 }}>
                Don&apos;t have an account?{' '}
                <Text style={{ color: AuthColors.foreground, fontWeight: '700' }}>Sign up</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
