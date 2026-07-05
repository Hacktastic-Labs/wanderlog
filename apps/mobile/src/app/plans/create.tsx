import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthColors } from '@/constants/colors';
import { Fonts } from '@/constants/theme';
import { createPlan, type CreatePlanRequest } from '@/services/api/plans.api';

const initialForm: CreatePlanRequest = {
  title: '',
  description: '',
  visibility: 'private',
  status: 'draft',
  start_date: '',
  end_date: '',
  estimated_cost: 0,
};

export default function CreatePlanScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<CreatePlanRequest>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof CreatePlanRequest>(field: K, value: CreatePlanRequest[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    if (!form.title.trim()) {
      Alert.alert('Missing title', 'Please enter a plan title.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPlan({
        ...form,
        title: form.title.trim(),
      });
      Alert.alert('Success', 'Plan created successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert(
        'Failed to create plan',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          },
        ]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.title}>Create Plan</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        <View style={styles.form}>
          <TextInput
            value={form.title}
            onChangeText={(text) => updateField('title', text)}
            placeholder="Title"
            placeholderTextColor={AuthColors.muted}
            style={styles.input}
          />

          <TextInput
            value={form.description}
            onChangeText={(text) => updateField('description', text)}
            placeholder="Description"
            placeholderTextColor={AuthColors.muted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
          />

          <TextInput
            value={form.visibility}
            onChangeText={(text) => updateField('visibility', text)}
            placeholder="Visibility (e.g. private, public)"
            placeholderTextColor={AuthColors.muted}
            style={styles.input}
          />

          <TextInput
            value={form.status}
            onChangeText={(text) => updateField('status', text)}
            placeholder="Status (e.g. draft, active)"
            placeholderTextColor={AuthColors.muted}
            style={styles.input}
          />

          <TextInput
            value={form.start_date}
            onChangeText={(text) => updateField('start_date', text)}
            placeholder="Start date (YYYY-MM-DD)"
            placeholderTextColor={AuthColors.muted}
            style={styles.input}
          />

          <TextInput
            value={form.end_date}
            onChangeText={(text) => updateField('end_date', text)}
            placeholder="End date (YYYY-MM-DD)"
            placeholderTextColor={AuthColors.muted}
            style={styles.input}
          />

          <TextInput
            value={String(form.estimated_cost)}
            onChangeText={(text) => updateField('estimated_cost', Number(text) || 0)}
            placeholder="Estimated cost"
            placeholderTextColor={AuthColors.muted}
            keyboardType="numeric"
            style={styles.input}
          />

          <Pressable
            onPress={onSubmit}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.submitButton,
              { opacity: pressed || isSubmitting ? 0.8 : 1 },
            ]}>
            {isSubmitting ? (
              <ActivityIndicator color={AuthColors.foregroundInverse} />
            ) : (
              <Text style={styles.submitButtonText}>Create Plan</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AuthColors.input,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  backIcon: {
    color: AuthColors.foreground,
    fontSize: 20,
    lineHeight: 22,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 24,
    color: AuthColors.foreground,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: AuthColors.input,
    color: AuthColors.foreground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderCurve: 'continuous',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  submitButton: {
    backgroundColor: AuthColors.foreground,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    marginTop: 8,
    borderCurve: 'continuous',
  },
  submitButtonText: {
    color: AuthColors.foregroundInverse,
    fontSize: 16,
    fontWeight: '700',
  },
});
