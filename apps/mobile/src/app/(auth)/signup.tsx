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

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const session = useAuthStore((state) => state.session);
  const signUp = useAuthStore((state) => state.signUp);

  if (session?.user) {
    return <Redirect href="/(tabs)/home" />;
  }

  const onSignup = async () => {
    setLoading(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      Alert.alert('Check your inbox', 'Verify your email, then sign in.');
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Signup failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start building your personal world exploration map.</Text>

        <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
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

        <Pressable style={styles.primaryButton} onPress={onSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#F0F4F8" /> : <Text style={styles.primaryLabel}>Sign Up</Text>}
        </Pressable>

        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text style={styles.footer}>Already have an account? Login</Text>
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
  footer: {
    textAlign: 'center',
    color: '#486581',
    marginTop: 8,
  },
});
