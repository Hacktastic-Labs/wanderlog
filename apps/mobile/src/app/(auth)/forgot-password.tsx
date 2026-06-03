import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuthStore } from '@/stores/auth.store';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const sendReset = useAuthStore((state) => state.sendReset);

  const onReset = async () => {
    setLoading(true);
    try {
      await sendReset(email.trim());
      Alert.alert('Reset email sent', 'Check your email for password reset instructions.');
    } catch (error) {
      Alert.alert('Unable to send reset', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email address to receive reset instructions.</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email"
          style={styles.input}
        />

        <Pressable style={styles.primaryButton} onPress={onReset} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#F0F4F8" />
          ) : (
            <Text style={styles.primaryLabel}>Send Reset Link</Text>
          )}
        </Pressable>

        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text style={styles.footer}>Back to login</Text>
          </Pressable>
        </Link>
      </View>
    </View>
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
