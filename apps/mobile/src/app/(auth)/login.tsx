import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useAuthStore } from '@/stores/auth.store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const session = useAuthStore((state) => state.session);
  const signIn = useAuthStore((state) => state.signIn);

  if (session?.user) {
    return <Redirect href="/(tabs)/home" />;
  }

  const onLogin = async () => {
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your private travel journal.</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          style={styles.input}
        />

        <Pressable style={styles.primaryButton} onPress={onLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#F0F4F8" /> : <Text style={styles.primaryLabel}>Login</Text>}
        </Pressable>

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable>
            <Text style={styles.link}>Forgot Password?</Text>
          </Pressable>
        </Link>

        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <Text style={styles.footer}>New here? Create an account</Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EEF3F9',
    padding: 20,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#D9E2EC',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#102A43',
  },
  subtitle: {
    color: '#486581',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD2D9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#102A43',
    backgroundColor: '#F7FAFC',
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#102A43',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryLabel: {
    color: '#F0F4F8',
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    textAlign: 'center',
    color: '#0E7490',
    marginTop: 6,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    color: '#486581',
    marginTop: 6,
  },
});
