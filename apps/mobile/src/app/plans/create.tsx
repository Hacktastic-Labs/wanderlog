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
  Switch,
  Text,
  TextInput,
  View,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { AuthColors } from '@/constants/colors';
import { Fonts } from '@/constants/theme';
import { createPlan, type CreatePlanRequest } from '@/services/api/plans.api';

const STATUS_OPTIONS = ['pending', 'active', 'completed', 'cancelled'] as const;

const initialForm: CreatePlanRequest = {
  title: '',
  description: '',
  visibility: 'private',
  status: 'pending',
  start_date: '',
  end_date: '',
  estimated_cost: 0,
};

export default function CreatePlanScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<CreatePlanRequest>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const updateField = <K extends keyof CreatePlanRequest>(field: K, value: CreatePlanRequest[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const onStartChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (event.type === 'set' && selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (event.type === 'set' && selectedDate) {
      setEndDate(selectedDate);
    }
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
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
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

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Visibility</Text>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>
                {form.visibility === 'public' ? 'Public' : 'Private'}
              </Text>
              <Switch
                value={form.visibility === 'public'}
                onValueChange={(value) => updateField('visibility', value ? 'public' : 'private')}
                trackColor={{ false: '#333', true: '#f4a261' }}
                thumbColor={form.visibility === 'public' ? '#fff' : '#8e8e93'}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Status</Text>
            <Pressable
              style={styles.pickerButton}
              onPress={() => setShowStatusPicker(true)}>
              <Text style={styles.pickerButtonText}>
                {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
              </Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </Pressable>
          </View>

          <Modal
            visible={showStatusPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowStatusPicker(false)}>
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowStatusPicker(false)}>
              <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
                <Text style={styles.modalTitle}>Select Status</Text>
                <FlatList
                  data={STATUS_OPTIONS}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Pressable
                      style={[
                        styles.modalItem,
                        form.status === item && styles.modalItemActive,
                      ]}
                      onPress={() => {
                        updateField('status', item);
                        setShowStatusPicker(false);
                      }}>
                      <Text
                        style={[
                          styles.modalItemText,
                          form.status === item && styles.modalItemTextActive,
                        ]}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
            </Pressable>
          </Modal>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Start Date</Text>
            <Pressable
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}>
              <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
              <Text style={styles.pickerArrow}>📅</Text>
            </Pressable>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onStartChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>End Date</Text>
            <Pressable
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}>
              <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
              <Text style={styles.pickerArrow}>📅</Text>
            </Pressable>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onEndChange}
                minimumDate={startDate}
              />
            )}
          </View>

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
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: AuthColors.muted,
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AuthColors.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleLabel: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: AuthColors.foreground,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AuthColors.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerButtonText: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: AuthColors.foreground,
  },
  pickerArrow: {
    color: AuthColors.muted,
    fontSize: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AuthColors.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateButtonText: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: AuthColors.foreground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AuthColors.input,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '50%',
  },
  modalTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: AuthColors.foreground,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  modalItemActive: {
    backgroundColor: '#f4a261',
  },
  modalItemText: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: AuthColors.foreground,
  },
  modalItemTextActive: {
    color: AuthColors.foregroundInverse,
    fontWeight: '600',
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
