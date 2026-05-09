/**
 * CreateTaskScreen - Pantalla de creación de tareas
 * Formulario con título, descripción, selector de prioridad,
 * DatePicker para deadline, y botón de guardar
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Colors from '../../utils/colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {useAuth} from '../../store/AuthContext';
import {addTask} from '../../services/taskService';
import {
  Priority,
  TaskStatus,
  getPriorityColor,
  getPriorityLabel,
} from '../../utils/priorities';

interface CreateTaskScreenProps {
  navigation: any;
}

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({navigation}) => {
  const {user} = useAuth();

  // Estados del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{title?: string}>({});

  const priorities = [
    Priority.URGENT,
    Priority.HIGH,
    Priority.MEDIUM,
    Priority.LOW,
  ];

  const validate = (): boolean => {
    const newErrors: {title?: string} = {};

    if (!title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(Priority.MEDIUM);
    setDeadline(new Date());
    setErrors({});
  };

  /**
   * Guardar tarea en Firestore
   * Usa addTask del taskService y navega de vuelta al inicio
   */
  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    if (!user?.uid) {
      Alert.alert('Error', 'Debes iniciar sesión para guardar tareas');
      return;
    }

    setLoading(true);
    try {
      await addTask(user.uid, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status: TaskStatus.PENDING,
        deadline,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      Alert.alert('✅ Éxito', 'Tarea guardada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('Error guardando tarea:', error);
      Alert.alert('Error', 'No se pudo guardar la tarea. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
      // Después de seleccionar fecha, mostrar selector de hora
      if (Platform.OS === 'android') {
        setShowTimePicker(true);
      }
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nueva Tarea</Text>
        <Text style={styles.headerSubtitle}>
          Completa los datos para añadir una tarea a tu agenda
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Título */}
        <CustomInput
          label="Título"
          placeholder="¿Qué necesitas hacer?"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        {/* Descripción */}
        <CustomInput
          label="Descripción (opcional)"
          placeholder="Añade detalles sobre esta tarea..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        {/* Selector de Prioridad */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Prioridad</Text>
          <View style={styles.priorityContainer}>
            {priorities.map(p => {
              const isSelected = priority === p;
              const color = getPriorityColor(p);
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityPill,
                    {
                      backgroundColor: isSelected ? color + '20' : Colors.surface,
                      borderColor: isSelected ? color : Colors.border,
                    },
                  ]}
                  onPress={() => setPriority(p)}
                  activeOpacity={0.7}>
                  <View
                    style={[styles.priorityDot, {backgroundColor: color}]}
                  />
                  <Text
                    style={[
                      styles.priorityPillText,
                      {color: isSelected ? color : Colors.textSecondary},
                    ]}>
                    {getPriorityLabel(p)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selector de Fecha/Hora (Deadline) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Plazo (Deadline)</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}>
            <Text style={styles.dateIcon}>📅</Text>
            <Text style={styles.dateText}>{formatDate(deadline)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && Platform.OS === 'android' && (
            <DateTimePicker
              value={deadline}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>

        {/* Botón Guardar */}
        <CustomButton
          title="Guardar Tarea"
          onPress={handleSave}
          loading={loading}
          size="large"
          style={styles.saveButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  form: {},
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  dateText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 12,
  },
});

export default CreateTaskScreen;
