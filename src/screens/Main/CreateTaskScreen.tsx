/**
 * CreateTaskScreen - Pantalla de creación de tareas
 * Formulario con título, descripción, selector de prioridad,
 * DatePicker para deadline, y botón de guardar
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Colors from '../../utils/colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../store/AuthContext';

import { addTask, updateTaskDetails } from '../../services/taskService';
import { Priority, TaskStatus, Task } from '../../utils/priorities';
import PrioritySelector from '../../components/PrioritySelector';
import DeadlinePicker from '../../components/DeadlinePicker';
import { useRoute } from '@react-navigation/native';
import { showError, showSuccess } from '../../utils/errorHandler';

interface CreateTaskScreenProps {
  navigation: any;
}

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const route = useRoute<any>();

  const taskToEdit: Task | undefined = route.params?.taskToEdit;

  // Estados del formulario (con soporte edición)
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [priority, setPriority] = useState<Priority>(
    taskToEdit?.priority || Priority.MEDIUM,
  );
  const [deadline, setDeadline] = useState(
    taskToEdit?.deadline ? new Date(taskToEdit.deadline) : new Date(),
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const validate = (): boolean => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'El título es obligatorio';
      showError('El título no puede estar vacío');
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
      showError('Debes iniciar sesión para guardar tareas');
      return;
    }

    setLoading(true);

    try {
      if (taskToEdit) {
        // 🔄 ACTUALIZAR
        await updateTask(user.uid, taskToEdit.id, {
          title: title.trim(),
          description: description.trim(),
          priority,
          deadline,
          updatedAt: new Date(),
        });

        showSuccess('Tarea actualizada correctamente');
        navigation.navigate('Home');
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

        showSuccess('Tarea guardada correctamente');
        resetForm();
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error guardando tarea:', error);
      showError('No se pudo guardar la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
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

        <PrioritySelector priority={priority} onPriorityChange={setPriority} />

        <DeadlinePicker deadline={deadline} onDeadlineChange={setDeadline} />

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
  saveButton: {
    marginTop: 12,
  },
});

export default CreateTaskScreen;
