import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../utils/colors';
import {
  Priority,
  getPriorityColor,
  getPriorityLabel,
} from '../utils/priorities';

interface PrioritySelectorProps {
  priority: Priority;
  onPriorityChange: (priority: Priority) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  priority,
  onPriorityChange,
}) => {
  const priorities = [
    Priority.URGENT,
    Priority.HIGH,
    Priority.MEDIUM,
    Priority.LOW,
  ];

  return (
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
              onPress={() => onPriorityChange(p)}
            >
              <View style={[styles.priorityDot, { backgroundColor: color }]} />
              <Text
                style={[
                  styles.priorityPillText,
                  { color: isSelected ? color : Colors.textSecondary },
                ]}
              >
                {getPriorityLabel(p)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default PrioritySelector;
