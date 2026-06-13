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
import { useSignUpMutation } from '@/hooks/use-auth-mutations';
import { useAuthStore } from '@/stores/auth.store';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const session = useAuthStore((state) => state.session);
  const { mutateAsync: signUp, isPending } = useSignUpMutation();

  if (session?.user.id) {
    return <Redirect href="/(tabs)/home" />;
  }

  const onSignup = async () => {
    if (!email.trim() || !password || !username.trim() || !displayName.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    try {
      await signUp({
        email: email.trim(),
        password,
        username: username.trim(),
        display_name: displayName.trim(),
      });
      Alert.alert('Welcome!', 'Your account has been created.');
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Signup failed', error instanceof Error ? error.message : 'Please try again.');
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
            Signup
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
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoComplete="username"
              placeholder="Username"
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
              value={displayName}
              onChangeText={setDisplayName}
              autoComplete="name"
              placeholder="Display name"
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
              autoComplete="new-password"
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
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              placeholder="Confirm Password"
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
            onPress={onSignup}
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
                Sign up
              </Text>
            )}
          </Pressable>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={{ color: AuthColors.muted, fontSize: 14 }}>
                Already have an account?{' '}
                <Text style={{ color: AuthColors.foreground, fontWeight: '700' }}>Sign in</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
