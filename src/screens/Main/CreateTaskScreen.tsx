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

import {addTask, updateTaskDetails} from '../../services/taskService';
import {
  Priority,
  TaskStatus,
  getPriorityColor,
  getPriorityLabel,
  Task,
} from '../../utils/priorities';
import {useRoute} from '@react-navigation/native';

interface CreateTaskScreenProps {
  navigation: any;
}

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({navigation}) => {
  const {user} = useAuth();
  const route = useRoute<any>();

  const taskToEdit: Task | undefined = route.params?.taskToEdit;

  // Estados del formulario (con soporte edición)
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(
    taskToEdit?.description || '',
  );
  const [priority, setPriority] = useState<Priority>(
    taskToEdit?.priority || Priority.MEDIUM,
  );
  const [deadline, setDeadline] = useState(
    taskToEdit?.deadline ? new Date(taskToEdit.deadline) : new Date(),
  );

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
   * Guardar o actualizar tarea
   */
  const handleSave = async () => {
    if (!validate()) return;

    if (!user?.uid) {
      Alert.alert('Error', 'Debes iniciar sesión para guardar tareas');
      return;
    }

    setLoading(true);

    try {
      if (taskToEdit) {
        // 🔄 ACTUALIZAR
        await updateTaskDetails(taskToEdit.id, {
          title: title.trim(),
          description: description.trim(),
          priority,
          deadline,
          updatedAt: new Date(),
        });

        Alert.alert('✅ Éxito', 'Tarea actualizada correctamente', [
          {text: 'OK', onPress: () => navigation.navigate('Home')},
        ]);
      } else {
        // ➕ CREAR
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
      }
    } catch (error) {
      console.error('Error guardando tarea:', error);
      Alert.alert('Error', 'No se pudo guardar la tarea');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
      if (Platform.OS === 'android') setShowTimePicker(true);
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) setDeadline(selectedDate);
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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
        </Text>
        <Text style={styles.headerSubtitle}>
          Completa los datos para añadir una tarea a tu agenda
        </Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="Título"
          placeholder="¿Qué necesitas hacer?"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <CustomInput
          label="Descripción (opcional)"
          placeholder="Añade detalles sobre esta tarea..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

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
                      backgroundColor: isSelected
                        ? color + '20'
                        : Colors.surface,
                      borderColor: isSelected ? color : Colors.border,
                    },
                  ]}
                  onPress={() => setPriority(p)}>
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

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Plazo (Deadline)</Text>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}>
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

        <CustomButton
          title={taskToEdit ? 'Actualizar Tarea' : 'Guardar Tarea'}
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
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1.5,
    borderRadius: 10,
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
    padding: 14,
  },
  dateIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  dateText: {
    fontSize: 15,
    color: Colors.text,
  },
  saveButton: {
    marginTop: 12,
  },
});

export default CreateTaskScreen;